import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import path from "path";
import { ReportDocument } from "@/lib/pdf/ReportDocument";
import { findDisease } from "@/lib/diseases";

export const runtime = "nodejs";
export const maxDuration = 60;

interface Body {
  diseaseId: string;
  confidence: number;
  otherPredictions?: { label: string; confidence: number }[];
  imageDataUrl?: string;
  patientNote?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const disease = findDisease(body.diseaseId);

    if (!disease) {
      return NextResponse.json({ error: "Unknown condition." }, { status: 400 });
    }

    const reportId = `PPH-${Date.now().toString(36).toUpperCase()}`;
    const generatedAt = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    });

    const element = React.createElement(ReportDocument, {
      data: {
        disease,
        confidence: body.confidence ?? 0,
        otherPredictions: body.otherPredictions ?? [],
        imageDataUrl: body.imageDataUrl,
        generatedAt,
        reportId,
        patientNote: body.patientNote,
        logoPath: path.join(process.cwd(), "public", "logo.png")
      }
    });

    // ReportDocument is a wrapper around react-pdf's <Document>, but its own
    // props ({ data }) don't structurally match react-pdf's DocumentProps —
    // renderToBuffer only cares that the rendered tree is a <Document> at
    // runtime, so the cast here is safe.
    const buffer = await renderToBuffer(
      element as unknown as Parameters<typeof renderToBuffer>[0]
    );

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="pantheon-report-${disease.id}.pdf"`
      }
    });
  } catch (err) {
    console.error("Report generation error:", err);
    return NextResponse.json({ error: "Failed to generate report." }, { status: 500 });
  }
}
