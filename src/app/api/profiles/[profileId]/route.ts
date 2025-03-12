import { NextResponse } from "next/server";
import { mockProfiles } from "@/mocks/profiles";

export async function GET(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const profileId = params.profileId;

    if (!profileId) {
      return NextResponse.json({ error: "Profile ID is required" }, { status: 400 });
    }

    // Find profile in mock data
    const profile = mockProfiles.find(p => p.id === profileId) || null;

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("[PROFILE_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}