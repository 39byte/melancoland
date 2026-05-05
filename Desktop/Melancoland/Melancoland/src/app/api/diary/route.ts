import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapEmotionToPlant } from "@/lib/plant-mapper";
import { findEmptyCell } from "@/components/garden/GardenGrid";
import { generateId } from "@/lib/utils";
import type { EmotionAnalysis } from "@/engine/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  let query = supabase
    .from("diary_entries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (userId) {
    query = query.eq("user_id", userId);
  } else {
    query = query.eq("is_private", false);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ entries: [] });
  }

  const entries = (data ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    content: row.content,
    isPrivate: row.is_private,
    createdAt: row.created_at,
    analysis: row.analysis,
    plantInstanceId: row.plant_instance_id ?? "",
  }));

  return NextResponse.json({ entries });
}

export async function POST(request: Request) {
  try {
    const { content, isPrivate, analysis, userId } = await request.json() as {
      content: string;
      isPrivate: boolean;
      analysis: EmotionAnalysis;
      userId?: string;
    };

    const ownerId = userId || "anonymous";
    const diaryId = generateId();

    const { error: diaryError } = await supabase.from("diary_entries").insert({
      id: diaryId,
      user_id: ownerId,
      content,
      is_private: isPrivate,
      analysis,
    });

    if (diaryError) {
      return NextResponse.json({ error: "일기 저장에 실패했습니다." }, { status: 500 });
    }

    const { speciesId } = mapEmotionToPlant(analysis);
    const { data: existingPlants } = await supabase.from("plants").select("position_col, position_row");
    const plantPositions = (existingPlants ?? []).map((p) => ({
      id: "", speciesId: "", plantedAt: "", emotion: analysis.primaryEmotion,
      growthStage: "full" as const, diaryEntryId: "", ownerId: "", isPrivate: false,
      position: { col: p.position_col, row: p.position_row },
    }));

    const position = findEmptyCell(plantPositions);

    await supabase.from("plants").insert({
      owner_id: ownerId,
      diary_entry_id: diaryId,
      species_id: speciesId,
      position_col: position.col,
      position_row: position.row,
      emotion: analysis.primaryEmotion,
      color_variant: analysis.secondaryEmotion,
      is_private: isPrivate,
      growth_stage: "full",
    });

    return NextResponse.json({ success: true, diaryId });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
