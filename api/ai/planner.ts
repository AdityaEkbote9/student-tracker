import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { syllabus, examDate, availableHours, subjectDifficulty } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    let plan;

    // Try Gemini API if key exists
    if (apiKey) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `Act as an expert study planner. Create a personalized study roadmap for a student.
Input Details:
- Syllabus: ${syllabus}
- Exam Date: ${examDate}
- Available Hours per day: ${availableHours}
- Subject Difficulty: ${subjectDifficulty}

Generate a JSON response containing a realistic, structured roadmap with daily milestones, study topics, and brief revision suggestions. 
The output MUST exactly follow this JSON schema:
{
  "roadmap": [
    { "day": "Day 1", "topic": "...", "duration": "...", "suggestion": "..." }
  ],
  "advice": [ "..." ]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });

        if (!response.text) throw new Error("No response text");
        plan = JSON.parse(response.text.trim());
      } catch (aiError: any) {
        console.warn("Gemini API failed, using smart fallback:", aiError.message);
        plan = null;
      }
    }

    // Smart fallback — always works, no API key needed
    if (!plan) {
      const topics = syllabus.split(/[,;\n]+/).map((t: string) => t.trim()).filter(Boolean);
      const daysUntilExam = Math.max(1, Math.ceil((new Date(examDate).getTime() - Date.now()) / 86400000));
      const daysToSchedule = Math.min(daysUntilExam, 14);

      plan = {
        roadmap: Array.from({ length: daysToSchedule }, (_, i) => {
          const topic = topics[i % topics.length];
          const isReview = i >= topics.length;
          return {
            day: `Day ${i + 1}`,
            topic: isReview ? `Review: ${topic}` : topic,
            duration: `${availableHours}h`,
            suggestion: isReview
              ? `Revise ${topic} using active recall and spaced repetition. Solve previous year questions.`
              : i === 0
              ? `Start with fundamentals of ${topic}. Build a concept map and identify key formulas/theorems.`
              : `Deep dive into ${topic}. Practice ${subjectDifficulty === 'Hard' ? 'advanced' : 'intermediate'} problems and make concise notes.`
          };
        }),
        advice: [
          `With ${daysUntilExam} days remaining, focus on understanding core concepts before memorizing details.`,
          `Allocate ${availableHours}h/day with Pomodoro technique (25 min focus + 5 min break).`,
          subjectDifficulty === 'Hard'
            ? "For this difficult subject, prioritize problem-solving over passive reading."
            : "Balance between theory revision and practice problems for optimal retention.",
          "Schedule a full mock test 2 days before the exam to identify weak areas.",
          "Sleep 7-8 hours — memory consolidation happens during deep sleep."
        ]
      };
    }

    res.json(plan);
  } catch (error: any) {
    console.error("AI Planner error:", error);
    res.status(500).json({ error: error.message });
  }
}
