export interface Prediction {
  label: string;
  confidence: number;
}

export interface AnalyzeResult {
  predictions: Prediction[];
  raw: unknown;
}

const ROBOFLOW_URL =
  process.env.ROBOFLOW_WORKFLOW_URL ??
  "https://serverless.roboflow.com/faraimupfuti/workflows/precisionhealth-skin-condition-classification-v10-logic";

/**
 * Calls the Roboflow workflow with a base64-encoded image (no external
 * image hosting required). If your workflow is configured to require a
 * public image URL instead of base64, set ROBOFLOW_INPUT_TYPE=url and
 * host the image yourself, passing its URL to analyzeImageUrl() instead.
 */
export async function analyzeImageBase64(base64: string): Promise<AnalyzeResult> {
  const apiKey = process.env.ROBOFLOW_API_KEY;
  if (!apiKey) {
    throw new Error("ROBOFLOW_API_KEY is not configured on the server.");
  }

  const res = await fetch(ROBOFLOW_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      inputs: {
        image: { type: "base64", value: base64 }
      }
    })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Inference request failed (${res.status}): ${text.slice(0, 500)}`);
  }

  const json = await res.json();
  return { predictions: extractPredictions(json), raw: json };
}

export async function analyzeImageUrl(imageUrl: string): Promise<AnalyzeResult> {
  const apiKey = process.env.ROBOFLOW_API_KEY;
  if (!apiKey) {
    throw new Error("ROBOFLOW_API_KEY is not configured on the server.");
  }

  const res = await fetch(ROBOFLOW_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      inputs: {
        image: { type: "url", value: imageUrl }
      }
    })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Inference request failed (${res.status}): ${text.slice(0, 500)}`);
  }

  const json = await res.json();
  return { predictions: extractPredictions(json), raw: json };
}

/**
 * Roboflow workflow response shapes vary by workflow configuration.
 * This walks the response looking for the common shapes:
 *  - { predictions: [{ class, confidence }, ...] }
 *  - { top, confidence }
 *  - { predicted_classes: [...], predictions: { <class>: { confidence } } }
 * and falls back to a best-effort recursive search so the app keeps
 * working even if the exact schema differs from what's documented.
 */
export function extractPredictions(json: unknown): Prediction[] {
  const found: Prediction[] = [];
  const seen = new Set<string>();

  function pushPrediction(label: unknown, confidence: unknown) {
    if (typeof label !== "string") return;
    const conf = typeof confidence === "number" ? confidence : Number(confidence);
    const key = label.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    found.push({ label, confidence: Number.isFinite(conf) ? conf : 0 });
  }

  function walk(node: unknown, depth: number) {
    if (depth > 8 || node === null || node === undefined) return;

    if (Array.isArray(node)) {
      for (const item of node) walk(item, depth + 1);
      return;
    }

    if (typeof node === "object") {
      const obj = node as Record<string, unknown>;

      // Shape: { class: "...", confidence: 0.9 } or { class_name, confidence }
      const label = obj.class ?? obj.class_name ?? obj.label ?? obj.top;
      const confidence = obj.confidence ?? obj.score;
      if (typeof label === "string" && (typeof confidence === "number" || typeof confidence === "string")) {
        pushPrediction(label, confidence);
      }

      // Shape: { predictions: { "class_name": { confidence: 0.9 }, ... } }
      if (obj.predictions && typeof obj.predictions === "object" && !Array.isArray(obj.predictions)) {
        for (const [key, val] of Object.entries(obj.predictions as Record<string, unknown>)) {
          if (val && typeof val === "object") {
            const v = val as Record<string, unknown>;
            const c = v.confidence ?? v.score;
            if (typeof c === "number" || typeof c === "string") {
              pushPrediction(key, c);
            }
          }
        }
      }

      for (const value of Object.values(obj)) {
        walk(value, depth + 1);
      }
    }
  }

  walk(json, 0);

  return found.sort((a, b) => b.confidence - a.confidence);
}
