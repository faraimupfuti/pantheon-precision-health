import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Temporary diagnostic route — safe to leave in, but feel free to delete
// this file once ROBOFLOW_API_KEY is confirmed working. It never returns
// the key itself, only whether it's present and how long it is.
export async function GET() {
  const key = process.env.ROBOFLOW_API_KEY;
  return NextResponse.json({
    hasApiKey: Boolean(key && key.trim().length > 0),
    keyLength: key ? key.trim().length : 0,
    workflowUrlConfigured: Boolean(process.env.ROBOFLOW_WORKFLOW_URL),
    nodeEnv: process.env.NODE_ENV ?? null
  });
}
