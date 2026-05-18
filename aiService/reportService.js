// aiService/reportService.js  — add this to your existing aiService file (or import alongside it)
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Compute per-phoneme stats across all attempts for a given word session.
 * Returns a map: { [phone]: { scores: number[], soundsSeen: string[] } }
 */
const aggregatePhonemes = (attempts) => {
  const map = {};
  for (const attempt of attempts) {
    for (const p of attempt.phone_score_list ?? []) {
      if (!map[p.phone]) map[p.phone] = { scores: [], soundsSeen: [] };
      map[p.phone].scores.push(p.quality_score);
      map[p.phone].soundsSeen.push(p.sound_most_like);
    }
  }
  return map;
};

/** Standard deviation */
const stdDev = (arr) => {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.sqrt(arr.reduce((s, v) => s + (v - mean) ** 2, 0) / arr.length);
};

/** Derive phoneme status label */
const phonemeStatus = (avg, trend) => {
  if (avg >= 85) return "mastered";
  if (avg >= 70 && trend >= 0) return "improving";
  if (avg >= 55) return "needs_practice";
  return "struggling";
};

/** Derive overall rating from average score */
const overallRating = (avg) => {
  if (avg >= 85) return "excellent";
  if (avg >= 70) return "good";
  if (avg >= 55) return "developing";
  return "needs_support";
};

// ─── Prompt Builder ───────────────────────────────────────────────────────────

export const buildReportPrompt = (word, attempts, phonemeMap) => {
  const scores = attempts.map((a) => a.quality_score);
  const first = scores[0];
  const latest = scores[scores.length - 1];
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const best = Math.max(...scores);

  // Phoneme summary lines
  const phonemeLines = Object.entries(phonemeMap)
    .map(([phone, { scores: ps }]) => {
      const pavg = Math.round(ps.reduce((a, b) => a + b, 0) / ps.length);
      const ptrend = ps[ps.length - 1] - ps[0];
      const status = phonemeStatus(pavg, ptrend);
      return `  /${phone}/: avg ${pavg}/100, trend ${ptrend >= 0 ? "+" : ""}${ptrend}, status: ${status}`;
    })
    .join("\n");

  // Full attempt history
  const attemptHistory = attempts
    .map(
      (a, i) =>
        `  Attempt ${i + 1} (${new Date(a.createdAt).toLocaleDateString()}): ` +
        `score=${a.quality_score}/100, class=${a.quality_class}`,
    )
    .join("\n");

  return `
You are a professional speech-language pathologist writing a structured progress report for a child (ages 4–10) with Autism Spectrum Disorder.

Word being practiced: "${word}"
Total attempts: ${attempts.length}
First score: ${first}/100
Latest score: ${latest}/100
Best score: ${best}/100
Average score: ${avg}/100
Overall progress: ${latest - first >= 0 ? "+" : ""}${latest - first} points

Attempt history:
${attemptHistory}

Phoneme-by-phoneme analysis:
${phonemeLines}

Generate a JSON report (no markdown, raw JSON only) with EXACTLY this structure:
{
  "overallFeedback": "<2-3 sentence professional summary of the child's pronunciation journey for this word>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3 if applicable>"],
  "areasToImprove": ["<area 1>", "<area 2>", "<area 3 if applicable>"],
  "practiceExercises": ["<concrete exercise 1>", "<concrete exercise 2>", "<concrete exercise 3>"],
  "encouragement": "<1-2 warm, playful sentences directed at the child — simple language, no scores>",
  "therapistNotes": "<1-2 professional sentences for the therapist or parent about next steps>"
}

Rules:
- strengths, areasToImprove, practiceExercises: 2–3 items each, concise bullet-style strings
- encouragement: child-friendly, no numbers, warm and fun
- therapistNotes: clinical but accessible, mention specific phonemes if relevant
- Return ONLY the raw JSON object. No preamble, no markdown fences.
`.trim();
};

// ─── Compute Metrics ─────────────────────────────────────────────────────────

export const computeMetrics = (attempts, phonemeMap) => {
  const scores = attempts.map((a) => a.quality_score);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = stdDev(scores);
  const consistency = Math.max(0, Math.round(100 - variance));

  const phonemeBreakdown = Object.entries(phonemeMap).map(
    ([phone, { scores: ps }]) => {
      const pavg = Math.round(ps.reduce((a, b) => a + b, 0) / ps.length);
      const pbest = Math.max(...ps);
      const ptrend = ps[ps.length - 1] - ps[0];
      const status = phonemeStatus(pavg, ptrend);
      return { phone, avgScore: pavg, bestScore: pbest, trend: ptrend, status };
    },
  );

  const masteredPhonemes = phonemeBreakdown.filter(
    (p) => p.status === "mastered",
  ).length;
  const strugglingPhonemes = phonemeBreakdown.filter(
    (p) => p.status === "struggling",
  ).length;

  const attemptTimeline = attempts.map((a, i) => ({
    attemptId: a._id,
    attemptNumber: i + 1,
    qualityScore: a.quality_score,
    qualityClass: a.quality_class,
    date: new Date(a.createdAt),
  }));

  return {
    metrics: {
      totalAttempts: attempts.length,
      averageScore: Math.round(avg),
      bestScore: Math.max(...scores),
      latestScore: scores[scores.length - 1],
      firstScore: scores[0],
      overallProgress: scores[scores.length - 1] - scores[0],
      consistencyScore: consistency,
      masteredPhonemes,
      strugglingPhonemes,
    },
    phonemeBreakdown,
    attemptTimeline,
    overallRating: overallRating(Math.round(avg)),
  };
};

// ─── Main Generator ───────────────────────────────────────────────────────────

/**
 * Generates a full structured report for a word session.
 * @param {string} word
 * @param {Array} attempts  — array of attempt objects from DB
 * @returns {Promise<{ llmReport: object, metrics: object, phonemeBreakdown: array, attemptTimeline: array, overallRating: string }>}
 */
export const generateReport = async (word, attempts) => {
  const phonemeMap = aggregatePhonemes(attempts);
  const prompt = buildReportPrompt(word, attempts, phonemeMap);
  console.log("prompt", prompt);
  const computed = computeMetrics(attempts, phonemeMap);

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a professional speech-language pathologist. You return only valid JSON with no markdown or extra text.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.5,
    max_tokens: 600,
  });

  const raw = completion.choices?.[0]?.message?.content?.trim();
  if (!raw) throw new Error("No response from LLM");

  let llmReport;
  try {
    // Strip any accidental markdown fences just in case
    const clean = raw.replace(/^```(?:json)?|```$/gm, "").trim();
    llmReport = JSON.parse(clean);
  } catch (err) {
    throw new Error(`LLM returned invalid JSON: ${raw}`);
  }

  return { llmReport, ...computed };
};
