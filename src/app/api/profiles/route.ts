import { NextResponse } from "next/server";
import { mockProfiles } from "@/mocks/profiles";

export async function GET() {
  try {
    // Using mock data instead of database for testing
    return NextResponse.json({ profiles: mockProfiles }, { status: 200 });
  } catch (error) {
    console.error("[PROFILES_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 