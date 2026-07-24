import { NextRequest, NextResponse } from "next/server";
import { analyzeImageBase64 } from "@/lib/roboflow";
import { findDisease } from "@/lib/diseases";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("image");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No image was provided." }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image is too large. Please use an image under 8MB." },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const result = await analyzeImageBase64(base64);

    const enriched = result.predictions.slice(0, 5).map((p) => {
      const info = findDisease(p.label);
      return {
        label: p.label,
        confidence: p.confidence,
        matched: Boolean(info),
        diseaseId: info?.id ?? null
      };
    });

    return NextResponse.json({
      predictions: enriched,
      hasResults: enriched.length > 0
    });
  } catch (err) {
    console.error("Analyze error:", err);
    const message = err instanceof Error ? err.message : "Unknown error during analysis.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
