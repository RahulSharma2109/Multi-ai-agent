import { NextResponse } from "next/server";
import { agentManager } from "@/agents/shared/manager";

export const dynamic = "force-dynamic";

/** Sanitize error messages so internal details are never exposed to clients. */
function sanitizeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Allow safe, high-level messages through
    const msg = error.message;
    if (
      msg.includes("API") ||
      msg.includes("timeout") ||
      msg.includes("configured")
    ) {
      return msg;
    }
  }
  return "An unexpected error occurred while generating the dashboard. Please try again.";
}

export async function GET() {
  try {
    const dashboard = await agentManager.dashboard();

    return NextResponse.json({
      success: true,
      data: dashboard,
    });
  } catch (error: unknown) {
    console.error("[API /dashboard]", error);

    return NextResponse.json(
      {
        success: false,
        data: null,
        error: sanitizeErrorMessage(error),
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  agentManager.clearCache();

  try {
    const dashboard = await agentManager.dashboard();

    return NextResponse.json({
      success: true,
      data: dashboard,
    });
  } catch (error: unknown) {
    console.error("[API /dashboard POST]", error);

    return NextResponse.json(
      {
        success: false,
        data: null,
        error: sanitizeErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
