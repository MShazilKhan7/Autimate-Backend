import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Builds a child-friendly prompt from the pronunciation score report
 */
// aiService/aiService.js
const buildFeedbackPrompt = (scoreReport) => {
  const { word, attempts, childInfo } = scoreReport;

  const childName = childInfo?.name || null;
  const childAge = childInfo?.age || null;

  // Current attempt
  const latestAttempt = attempts[attempts.length - 1];

  // Previous attempts (excluding current)
  const previousAttempts = attempts.slice(0, -1);

  const phoneScores = latestAttempt?.phone_score_list || [];
  const overallScore = latestAttempt?.quality_score ?? 0;
  const passed = latestAttempt?.quality_class === "pass";

  const weakPhonemes = phoneScores.filter((p) => p.quality_score < 70);
  const strongPhonemes = phoneScores.filter((p) => p.quality_score >= 80);

  const phonemeDetails = phoneScores
    .map(
      (p) =>
        `  - Phoneme "/${p.phone}/": score ${Math.round(p.quality_score)}/100, heard as "/${p.sound_most_like}/"`,
    )
    .join("\n");

  const weakDetails = weakPhonemes
    .map((p) => `"/${p.phone}/" (scored ${Math.round(p.quality_score)}/100)`)
    .join(", ");

  const previousAttemptsText =
    previousAttempts.length > 0
      ? previousAttempts
          .map((attempt, index) => {
            const phoneBreakdown = attempt.phone_score_list
              .map(
                (p) =>
                  `     - /${p.phone}/ → ${Math.round(p.quality_score)}/100, heard as /${p.sound_most_like}/`,
              )
              .join("\n");

            return `
Previous Attempt ${index + 1}:
Overall Score: ${Math.round(attempt.quality_score)}/100
Result: ${attempt.quality_class}

Phone Breakdown:
${phoneBreakdown}
`;
          })
          .join("\n")
      : "No previous attempts available.";

  const prompt = `
You are a warm, encouraging speech therapy assistant helping a young child (ages 4–10) with Autism Spectrum Disorder learn to pronounce words correctly.

Child Information:
${childName ? `Name: ${childName}` : ""}
${childAge ? `Age: ${childAge}` : ""}

The child just attempted to say the word: "${word}"

Previous attempts:
${previousAttemptsText}

Current attempt:
Overall Score: ${overallScore}/100
Result: ${passed ? "PASSED ✓" : "NEEDS MORE PRACTICE"}

Phoneme-by-phoneme breakdown:
${phonemeDetails}

${
  weakPhonemes.length > 0
    ? `Phonemes needing improvement: ${weakDetails}`
    : "All phonemes were pronounced well!"
}

Your task:
1. Start with warm, positive encouragement (1-2 sentences). Always find something to praise.
2. If the score is above 85, celebrate their success enthusiastically.
3. If there are weak phonemes, gently explain how to make that sound correctly. Use simple, fun descriptions a child can understand (e.g., "make your lips like a fish" or "let air blow through your teeth like wind").
4. Give one simple tip or exercise they can try right now to improve.
5. End with a motivating sentence that encourages them to try again.
6. If the child's name is available, naturally use it once in the feedback to make it more personal.

Rules:
- Use very simple words. No medical jargon.
- Keep the response under 80 words.
- Be warm, playful, and supportive — like a friendly teacher.
- Do NOT use bullet points or lists. Write in natural spoken sentences (this will be read aloud as audio).
- Do NOT mention scores or numbers to the child.
`;

  return prompt.trim();
};
/**
 * Generates child-friendly feedback using Llama-3.3-70b-versatile via Groq
 * @param {Object} scoreReport - The pronunciation score report
 * @returns {Promise<string>} - The generated feedback text
 */
export const generateFeedback = async (scoreReport) => {
  const prompt = buildFeedbackPrompt(scoreReport);

  console.log("PROMPT", prompt);
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a gentle, encouraging speech therapy assistant for children with ASD. You speak in simple, warm, playful language. Your responses will be converted to audio and played for young children.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  const feedback = completion.choices?.[0]?.message?.content?.trim();

  if (!feedback) {
    throw new Error("No feedback generated from LLM");
  }

  return feedback;
};
