import { getGeminiClient } from "@/agents/shared/gemini";
import { opportunityPrompt } from "./prompt";
import type {
  YouTubeReport,
  NewsReport,
  OpportunityReport,
  Opportunity,
} from "@/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_RETRIES = 2;
const BASE_DELAY_MS = 3000;
const GEMINI_TIMEOUT_MS = 30_000;
const VALID_DIFFICULTIES: ReadonlySet<string> = new Set(["Easy", "Medium", "Hard"]);

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Validate and sanitize a single opportunity item from Gemini's response.
 * Returns a well-formed Opportunity with safe defaults for malformed fields.
 */
function validateOpportunity(raw: unknown): Opportunity | null {
  if (typeof raw !== "object" || raw === null) return null;

  const item = raw as Record<string, unknown>;

  // Title is required
  if (typeof item.title !== "string" || item.title.trim() === "") return null;

  const difficulty = typeof item.difficulty === "string" && VALID_DIFFICULTIES.has(item.difficulty)
    ? (item.difficulty as Opportunity["difficulty"])
    : "Medium";

  const rawScore = typeof item.score === "number" ? item.score : Number(item.score);
  const score = isNaN(rawScore) ? 50 : Math.max(0, Math.min(100, Math.round(rawScore)));

  const keywords = Array.isArray(item.keywords)
    ? item.keywords.filter((k): k is string => typeof k === "string").slice(0, 10)
    : [];

  return {
    title: String(item.title).trim(),
    description: typeof item.description === "string" ? item.description : "",
    reason: typeof item.reason === "string" ? item.reason : "",
    difficulty,
    score,
    estimatedViews: typeof item.estimatedViews === "string" ? item.estimatedViews : "",
    keywords,
  };
}

interface GeminiOpportunityResponse {
  opportunities: Opportunity[];
}

function parseGeminiResponse(text: string): GeminiOpportunityResponse {
  // Strip markdown code fences if the model wraps its JSON output
  const cleanText = text
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleanText);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("opportunities" in parsed) ||
    !Array.isArray((parsed as GeminiOpportunityResponse).opportunities)
  ) {
    throw new Error("Invalid response structure from Gemini — missing 'opportunities' array");
  }

  const rawOpportunities = (parsed as GeminiOpportunityResponse).opportunities;
  const validated = rawOpportunities
    .map(validateOpportunity)
    .filter((o): o is Opportunity => o !== null);

  if (validated.length === 0) {
    throw new Error("Gemini returned opportunities but none passed validation");
  }

  return { opportunities: validated };
}

// ---------------------------------------------------------------------------
// Gemini call with retry + timeout
// ---------------------------------------------------------------------------

function getRetryDelay(attempt: number, isRateLimit: boolean): number {
  if (isRateLimit) {
    return BASE_DELAY_MS * Math.pow(3, attempt);
  }
  return BASE_DELAY_MS * Math.pow(2, attempt);
}

async function generateOpportunities(
  prompt: string,
  attempt: number = 0
): Promise<GeminiOpportunityResponse> {
  try {
    const ai = getGeminiClient();

    // Apply a timeout via AbortController so Gemini calls can't hang forever
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          abortSignal: controller.signal,
        },
      });
    } finally {
      clearTimeout(timeout);
    }

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return parseGeminiResponse(text);
  } catch (error) {
    const isRateLimit =
      error instanceof globalThis.Error &&
      "status" in error &&
      (error as { status: number }).status === 429;

    const isServerError =
      error instanceof globalThis.Error &&
      "status" in error &&
      [500, 502, 503].includes((error as { status: number }).status);

    if (attempt < MAX_RETRIES && (isRateLimit || isServerError || !(error instanceof DOMException))) {
      const delay = getRetryDelay(attempt, isRateLimit);
      console.warn(
        `[Opportunity Agent] ${isRateLimit ? "Rate limited" : "Failed"} (attempt ${attempt + 1}/${MAX_RETRIES + 1}), retrying in ${delay / 1000}s...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return generateOpportunities(prompt, attempt + 1);
    }
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function opportunityAgent(
  youtube: YouTubeReport,
  news: NewsReport
): Promise<OpportunityReport> {
  try {
    const prompt = opportunityPrompt(youtube, news);
    const result = await generateOpportunities(prompt);

    return {
      generatedAt: new Date().toISOString(),
      opportunities: result.opportunities,
    };
  } catch (error) {
    console.error("[Opportunity Agent] Failed:", error);

    return {
      generatedAt: new Date().toISOString(),
      opportunities: [],
    };
  }
}