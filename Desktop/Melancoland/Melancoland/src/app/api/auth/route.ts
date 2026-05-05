import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateCharacter } from "@/lib/character-gen";
import { generateId } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { nickname } = await request.json();

    if (!nickname || nickname.length < 2 || nickname.length > 12) {
      return NextResponse.json(
        { error: "닉네임은 2자 이상 12자 이하로 입력해주세요." },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("profiles")
      .select("*")
      .eq("nickname", nickname)
      .single();

    if (existing) {
      return NextResponse.json({
        id: existing.id,
        nickname: existing.nickname,
        character: existing.character,
        createdAt: existing.created_at,
      });
    }

    const userId = generateId();
    const character = generateCharacter(userId);

    const { error } = await supabase.from("profiles").insert({
      id: userId,
      nickname,
      character,
    });

    if (error) {
      return NextResponse.json({ error: "프로필 생성에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({
      id: userId,
      nickname,
      character,
      createdAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
