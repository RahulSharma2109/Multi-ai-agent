import { NextResponse } from "next/server";
import { agentManager } from "@/agents/shared/manager";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dashboard = await agentManager.dashboard();

    return NextResponse.json({
      success: true,
      data: dashboard.opportunity,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[API /opportunity]", message);

    return NextResponse.json(
      {
        success: false,
        data: null,
        error: message,
      },
      { status: 500 }
    );
  }
}