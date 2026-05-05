import { NextResponse } from "next/server";
import { analyzeDiary } from "@/lib/claude";

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content || content.length < 20 || content.length > 2000) {
      return NextResponse.json(
        { error: "일기는 20자 이상 2000자 이하로 작성해주세요." },
        { status: 400 }
      );
    }

    const analysis = await analyzeDiary(content);
    return NextResponse.json(analysis);
  } catch {
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
