import { db } from "./db";
import { profiles } from "./schema/profiles";
import { seedProfiles } from "./schema/seed-data";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Clear existing data
    await db.delete(profiles);

    // Insert seed profiles
    await db.insert(profiles).values(seedProfiles);

    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed(); 