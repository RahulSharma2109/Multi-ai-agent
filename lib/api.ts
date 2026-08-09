import type { DashboardData } from "@/types";

interface DashboardApiResponse {
  success: boolean;
  data: DashboardData;
  error?: string;
}

export async function getDashboardData(
  forceRefresh: boolean = false
): Promise<DashboardData> {
  const response = await fetch("/api/dashboard", {
    method: forceRefresh ? "POST" : "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Dashboard API error: ${response.status}`);
  }

  const json: DashboardApiResponse = await response.json();

  if (!json.success || !json.data) {
    throw new Error(json.error || "Failed to fetch dashboard data");
  }

  return json.data;
}