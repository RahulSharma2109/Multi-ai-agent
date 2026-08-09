import { NextResponse } from "next/server";
import { youtubeAgent } from "@/agents/youtube/agent";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const report = await youtubeAgent();

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[API /youtube]", message);

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