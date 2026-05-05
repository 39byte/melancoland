import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("diary_entries")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "일기를 찾을 수 없습니다." }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const requesterId = searchParams.get("userId");

  if (data.is_private && data.user_id !== requesterId) {
    return NextResponse.json({
      id: data.id,
      isPrivate: true,
      emotion: data.analysis?.primaryEmotion,
      plantedAt: data.created_at,
    });
  }

  return NextResponse.json({
    id: data.id,
    userId: data.user_id,
    content: data.content,
    isPrivate: data.is_private,
    createdAt: data.created_at,
    analysis: data.analysis,
  });
}
