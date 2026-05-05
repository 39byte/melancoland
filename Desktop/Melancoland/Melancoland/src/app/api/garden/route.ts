import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("plants")
    .select("*")
    .order("planted_at", { ascending: false });

  if (error) {
    return NextResponse.json({ plants: [] });
  }

  const plants = (data ?? []).map((row) => ({
    id: row.id,
    speciesId: row.species_id,
    position: { col: row.position_col, row: row.position_row },
    plantedAt: row.planted_at,
    emotion: row.emotion,
    colorVariant: row.color_variant,
    growthStage: row.growth_stage,
    diaryEntryId: row.diary_entry_id,
    ownerId: row.owner_id,
    isPrivate: row.is_private,
  }));

  return NextResponse.json({ plants });
}
