# CLAUDE.md — Melancoland 프로젝트 지침

## 프로젝트 개요

**Melancoland**는 여러 사용자가 **하나의 공유 정원**에 함께 참여하는 감성 웹 서비스입니다. 사용자가 일기를 작성하면 AI가 글의 감정과 분위기를 분석하여 그에 어울리는 꽃이나 나무를 정원에 심어주고, 사용자들은 픽셀 캐릭터로 정원을 돌아다니며 서로의 식물과 이야기를 감상할 수 있습니다.

### 핵심 컨셉

- 모든 사용자가 **하나의 공유 정원**에 접속한다. 정원은 모두의 감정이 모여 만들어진다.
- 사용자는 **원하는 때에 원하는 만큼** 일기를 작성할 수 있다 (하루 횟수 제한 없음).
- Claude API가 일기의 감정, 분위기, 키워드를 분석한다.
- 분석 결과에 따라 고유한 식물이 공유 정원에 자라난다.
- 다른 사용자의 식물을 클릭하면 해당 일기를 읽을 수 있다.
- 일기를 **비공개**로 설정하면, 식물은 정원에 보이지만 일기 내용은 본인만 볼 수 있다.
- 접속한 사용자는 **랜덤 픽셀 캐릭터**로 정원을 자유롭게 돌아다닐 수 있다.
- 시간이 지나면 모두의 감정이 어우러진 거대한 공유 정원이 완성된다.

---

## 기술 스택

| 영역 | 기술 | 선택 이유 |
|------|------|-----------|
| 프레임워크 | **Next.js 14+ (App Router)** | SSR/CSR 유연 전환, API Routes 내장, 실시간 UI 업데이트 용이 |
| 언어 | **TypeScript** | 타입 안정성, AI 응답 스키마 검증에 유리 |
| 픽셀아트 렌더링 | **HTML5 Canvas + 커스텀 렌더러** | 픽셀 단위 제어, 외부 의존성 최소화, 애니메이션 자유도 높음 |
| 스타일링 | **Tailwind CSS + CSS Variables** | 빠른 UI 구성, 테마(낮/밤/계절) 전환 용이 |
| 상태 관리 | **Zustand** | 가볍고 직관적, 정원 상태와 일기 데이터 관리에 적합 |
| AI | **Claude API (Anthropic SDK)** | 감정 분석 및 식물 매핑용 텍스트 분석 |
| 실시간 통신 | **Supabase Realtime** | 공유 정원의 실시간 동기화, 캐릭터 위치 브로드캐스트 |
| DB | **Supabase (PostgreSQL + RLS)** | 일기 저장, 정원 상태 영속화, 인증, 비공개 설정 정책 적용 |
| 배포 | **Vercel** | Next.js 최적 배포 환경 |

### 패키지 설치 명령어

```bash
npx create-next-app@latest melancoland --typescript --tailwind --app --src-dir
cd melancoland
npm install @anthropic-ai/sdk zustand @supabase/supabase-js
npm install -D @types/node
```

---

## 디렉토리 구조

```
melancoland/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 루트 레이아웃 (폰트, 메타데이터)
│   │   ├── page.tsx                # 랜딩 페이지 (정원 뷰)
│   │   ├── write/
│   │   │   └── page.tsx            # 일기 작성 페이지
│   │   ├── garden/
│   │   │   └── page.tsx            # 정원 전체 보기
│   │   ├── history/
│   │   │   └── page.tsx            # 과거 일기 + 식물 기록
│   │   └── api/
│   │       ├── analyze/
│   │       │   └── route.ts        # Claude API 호출 엔드포인트
│   │       ├── garden/
│   │       │   └── route.ts        # 공유 정원 상태 조회
│   │       ├── diary/
│   │       │   ├── route.ts        # 일기 CRUD (작성, 목록 조회)
│   │       │   └── [id]/
│   │       │       └── route.ts    # 개별 일기 조회 (비공개 체크 포함)
│   │       └── auth/
│   │           └── route.ts        # 간편 인증 (닉네임 기반 or Supabase Auth)
│   │
│   ├── components/
│   │   ├── garden/
│   │   │   ├── GardenCanvas.tsx    # 메인 픽셀아트 캔버스 (공유 정원)
│   │   │   ├── PixelPlant.ts       # 식물 렌더링 클래스
│   │   │   ├── PixelRenderer.ts    # 캔버스 렌더링 엔진
│   │   │   ├── PlantAnimator.ts    # 성장 애니메이션 로직
│   │   │   ├── GardenGrid.ts       # 정원 격자 배치 시스템
│   │   │   ├── PlantTooltip.tsx    # 식물 호버/클릭 시 정보 표시 (일기 미리보기 or 🔒)
│   │   │   └── DiaryModal.tsx      # 식물 클릭 → 일기 전문 모달 (공개 일기만)
│   │   ├── character/
│   │   │   ├── CharacterSprite.ts  # 캐릭터 스프라이트 정의 및 렌더링
│   │   │   ├── CharacterController.ts # 키보드/터치 이동 로직
│   │   │   ├── CharacterLayer.tsx  # 캔버스 위 캐릭터 레이어 관리
│   │   │   ├── NameTag.ts          # 캐릭터 위 닉네임 표시
│   │   │   └── CharacterGenerator.ts # 랜덤 캐릭터 외형 생성기
│   │   ├── diary/
│   │   │   ├── DiaryEditor.tsx     # 일기 작성 에디터
│   │   │   ├── EmotionPreview.tsx  # 분석 결과 미리보기
│   │   │   ├── PlantReveal.tsx     # 식물 등장 연출 컴포넌트
│   │   │   ├── PrivacyToggle.tsx   # 공개/비공개 토글 스위치
│   │   │   └── DiaryFeed.tsx       # 최근 공개 일기 피드 (타임라인)
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── Navigation.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   │
│   ├── engine/                      # 픽셀아트 렌더링 엔진 (프레임워크 독립)
│   │   ├── types.ts                 # 엔진 타입 정의
│   │   ├── canvas.ts                # Canvas 초기화 및 유틸리티
│   │   ├── sprites.ts               # 스프라이트 시트 관리
│   │   ├── plants/                  # 식물별 픽셀 데이터
│   │   │   ├── index.ts             # 식물 레지스트리
│   │   │   ├── flowers.ts           # 꽃 스프라이트 정의
│   │   │   ├── trees.ts             # 나무 스프라이트 정의
│   │   │   ├── moss.ts              # 이끼/풀 스프라이트
│   │   │   └── special.ts           # 특별 식물 (무지개꽃 등)
│   │   ├── characters/               # 캐릭터 픽셀 데이터
│   │   │   ├── index.ts             # 캐릭터 파츠 레지스트리
│   │   │   ├── bodies.ts            # 몸체 스프라이트 (8종+)
│   │   │   ├── heads.ts             # 머리/헤어 스프라이트 (10종+)
│   │   │   ├── accessories.ts       # 악세서리 (모자, 안경 등 8종+)
│   │   │   └── colors.ts            # 캐릭터 색상 팔레트
│   │   ├── weather.ts               # 날씨 효과 (비, 눈, 햇살)
│   │   ├── particles.ts             # 파티클 시스템 (꽃잎, 반딧불)
│   │   ├── camera.ts                # 카메라 시스템 (캐릭터 추적, 정원 탐색)
│   │   └── animation.ts             # 애니메이션 프레임 루프
│   │
│   ├── lib/
│   │   ├── claude.ts                # Claude API 클라이언트 래퍼
│   │   ├── emotion.ts               # 감정 분석 결과 파싱
│   │   ├── plant-mapper.ts          # 감정 → 식물 매핑 로직
│   │   ├── supabase.ts              # Supabase 클라이언트
│   │   ├── realtime.ts              # Supabase Realtime 채널 관리 (캐릭터 동기화)
│   │   ├── character-gen.ts         # 랜덤 캐릭터 생성 알고리즘
│   │   └── utils.ts                 # 공통 유틸리티
│   │
│   ├── stores/
│   │   ├── gardenStore.ts           # 공유 정원 상태 (전체 식물 배치)
│   │   ├── diaryStore.ts            # 일기 작성 상태
│   │   ├── characterStore.ts        # 내 캐릭터 + 다른 접속자 캐릭터 상태
│   │   ├── presenceStore.ts         # 실시간 접속자 목록 관리
│   │   └── uiStore.ts               # UI 상태 (모달, 테마)
│   │
│   ├── data/
│   │   ├── plant-catalog.ts         # 전체 식물 카탈로그 정의
│   │   ├── emotion-map.ts           # 감정-식물 매핑 테이블
│   │   ├── color-palettes.ts        # 픽셀아트 색상 팔레트
│   │   └── character-parts.ts       # 캐릭터 파츠 조합 데이터
│   │
│   └── styles/
│       └── globals.css              # 글로벌 스타일 + CSS 변수
│
├── public/
│   └── sprites/                     # (선택) 사전 제작 스프라이트 이미지
│
├── CLAUDE.md                        # 이 파일
├── .env.local                       # API 키 (ANTHROPIC_API_KEY, SUPABASE_*)
└── package.json
```

---

## 핵심 기능 상세

### 1. 일기 작성 (DiaryEditor)

**사용자 흐름:**
1. `/write` 페이지에서 텍스트 에디터가 나타남
2. 사용자가 오늘 있었던 일을 자유롭게 작성 (최소 20자, 최대 2000자)
3. "정원에 심기" 버튼 클릭
4. 로딩 애니메이션 → Claude API 분석 → 결과 표시
5. 식물이 정원에 심어지는 연출

**에디터 요구사항:**
- 심플한 textarea 기반 (리치 에디터 불필요)
- 글자 수 카운터 표시
- placeholder에 오늘 날짜와 가이드 문구
- 자동 저장(localStorage)으로 실수 방지

### 2. AI 감정 분석 (Claude API)

**API 엔드포인트:** `POST /api/analyze`

**Claude API 호출 시 사용할 시스템 프롬프트:**

```typescript
const SYSTEM_PROMPT = `당신은 감정 정원 "Melancoland"의 정원사 AI입니다.
사용자의 일기를 읽고, 글에서 느껴지는 감정과 분위기를 분석하여
정원에 심을 식물을 추천합니다.

반드시 아래 JSON 형식으로만 응답하세요:

{
  "primaryEmotion": "joy" | "sadness" | "anger" | "fear" | "surprise" | "love" | "peace" | "anxiety" | "hope" | "nostalgia" | "loneliness" | "gratitude" | "excitement" | "melancholy" | "determination",
  "secondaryEmotion": string | null,
  "intensity": 1-10,
  "mood": "bright" | "warm" | "cool" | "dark" | "dreamy" | "stormy" | "serene",
  "season": "spring" | "summer" | "autumn" | "winter",
  "keywords": string[],          // 글에서 추출한 핵심 키워드 3개
  "plantRecommendation": {
    "type": "flower" | "tree" | "moss" | "special",
    "species": string,            // plant-catalog.ts의 ID와 매칭
    "reason": string              // 왜 이 식물인지 한 줄 설명 (사용자에게 표시)
  },
  "weatherEffect": "sunny" | "rainy" | "cloudy" | "snowy" | "foggy" | "starry" | "rainbow" | null,
  "gardenMessage": string         // 정원사가 건네는 따뜻한 한마디 (2문장 이내)
}`;
```

**Claude API 호출 코드 패턴:**

```typescript
// src/lib/claude.ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeDiary(content: string) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `오늘의 일기:\n\n${content}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return JSON.parse(text) as EmotionAnalysis;
}
```

**비용 최적화 주의사항:**
- `claude-sonnet-4-20250514` 모델 사용 (비용 대비 성능 최적)
- `max_tokens: 1024`로 제한 (JSON 응답에 충분)
- 응답 파싱 실패 시 1회 재시도 후 기본값 반환

### 3. 감정 → 식물 매핑 시스템

**매핑 테이블 (`src/data/emotion-map.ts`):**

```typescript
export const EMOTION_PLANT_MAP: Record<PrimaryEmotion, PlantMapping> = {
  joy:           { default: "sunflower",       tree: "cherry_blossom",  color: "#FFD700" },
  sadness:       { default: "blue_hydrangea",  tree: "weeping_willow",  color: "#4A90D9" },
  anger:         { default: "red_rose",        tree: "thorn_bush",      color: "#DC143C" },
  fear:          { default: "nightshade",      tree: "dead_oak",        color: "#483D8B" },
  surprise:      { default: "jack_in_box",     tree: "firework_tree",   color: "#FF69B4" },
  love:          { default: "pink_tulip",      tree: "heart_tree",      color: "#FF8FAB" },
  peace:         { default: "white_lily",      tree: "olive_tree",      color: "#98FB98" },
  anxiety:       { default: "thistle",         tree: "twisted_vine",    color: "#9370DB" },
  hope:          { default: "dandelion",       tree: "young_sprout",    color: "#7CFC00" },
  nostalgia:     { default: "dried_lavender",  tree: "autumn_maple",    color: "#DEB887" },
  loneliness:    { default: "single_daisy",    tree: "lone_pine",       color: "#B0C4DE" },
  gratitude:     { default: "golden_dahlia",   tree: "fruit_tree",      color: "#DAA520" },
  excitement:    { default: "firecracker",     tree: "rainbow_tree",    color: "#FF4500" },
  melancholy:    { default: "forget_me_not",   tree: "mist_willow",     color: "#778899" },
  determination: { default: "cactus_flower",   tree: "bamboo",          color: "#228B22" },
};
```

**식물 선택 로직:**
1. `primaryEmotion`으로 기본 식물 카테고리 결정
2. `intensity` 7 이상이면 나무(tree), 미만이면 꽃(flower) 선택
3. `secondaryEmotion`이 있으면 색상 변형 적용
4. `mood`에 따라 추가 시각 효과 (빛남, 그림자 등)
5. Claude가 `plantRecommendation.species`를 직접 지정한 경우 그것을 우선 사용

### 4. 픽셀아트 정원 렌더링 엔진

**캔버스 설정:**
- 기본 해상도: 320×240 픽셀 (4배 스케일 → 화면에는 1280×960으로 표시)
- `image-rendering: pixelated` CSS 적용 필수
- 픽셀 크기: 4px × 4px (실제 화면 기준)

**정원 격자:**
- 격자 크기: 40열 × 30행 = 최대 1200 셀
- 각 셀은 8×8 픽셀 (실제 화면에서 32×32px)
- 지형: 하단 60%는 초원/흙, 상단 40%는 하늘

**식물 스프라이트 정의 방식:**

```typescript
// src/engine/plants/flowers.ts
// 각 식물은 2D 픽셀 배열로 정의
// 0 = 투명, 숫자 = 팔레트 인덱스

export const SUNFLOWER_SPRITE: PlantSprite = {
  id: "sunflower",
  name: "해바라기",
  frames: {
    seed:   { width: 8, height: 8, data: [[0,0,0,0,0,0,0,0], /* ... */] },
    sprout: { width: 8, height: 8, data: [[/* ... */]] },
    grow:   { width: 8, height: 16, data: [[/* ... */]] },
    bloom:  { width: 16, height: 16, data: [[/* ... */]] },
    full:   { width: 16, height: 24, data: [[/* ... */]] },
  },
  palette: ["transparent", "#228B22", "#FFD700", "#8B4513", "#FFEC8B", "#654321"],
  growthDuration: 3000,  // ms, 심기 애니메이션 시간
};
```

**성장 애니메이션 단계:**
1. **seed** (0.0s): 씨앗이 흙에 떨어짐
2. **sprout** (0.5s): 작은 새싹이 올라옴
3. **grow** (1.5s): 줄기가 자라남
4. **bloom** (2.5s): 꽃봉오리/잎이 펼쳐짐
5. **full** (3.0s): 완전히 핀 상태 + 파티클 효과

**idle 애니메이션:**
- 완전히 자란 식물은 2프레임 흔들림 애니메이션 (바람 효과)
- 특별 식물은 반짝임 파티클 추가

**날씨 효과 렌더링:**
- 비: 위에서 아래로 떨어지는 1px 파란색 라인
- 눈: 느리게 떨어지는 1px 흰색 점
- 햇살: 상단에서 대각선 노란색 라인
- 안개: 반투명 흰색 레이어
- 별: 상단 하늘에 깜빡이는 흰색 점
- 무지개: 곡선 색상 밴드

### 5. 정원 상태 관리

**Zustand Store 구조:**

```typescript
// src/stores/gardenStore.ts
interface GardenState {
  plants: PlantInstance[];       // 심어진 모든 식물
  gridSize: { cols: 40, rows: 30 };
  weather: WeatherEffect | null;
  season: Season;
  dayCount: number;              // 정원 시작 후 경과 일수

  // Actions
  addPlant: (plant: PlantInstance) => void;
  removePlant: (id: string) => void;
  updateWeather: (weather: WeatherEffect | null) => void;
  loadGarden: (userId: string) => Promise<void>;
  saveGarden: () => Promise<void>;
}

interface PlantInstance {
  id: string;                     // uuid
  speciesId: string;              // plant-catalog의 식물 ID
  position: { col: number; row: number };
  plantedAt: Date;
  emotion: PrimaryEmotion;
  colorVariant?: string;          // secondaryEmotion에 의한 변형
  growthStage: "seed" | "sprout" | "grow" | "bloom" | "full";
  diaryEntryId: string;           // 연결된 일기 ID
  ownerId: string;                // 식물을 심은 사용자 ID
  isPrivate: boolean;             // true면 식물은 보이되 일기 내용은 비공개
}
```

### 6. 공유 정원 시스템

**핵심 원칙:** 정원은 단 하나이며, 모든 사용자의 식물이 같은 공간에 공존한다.

**공유 정원 동작 방식:**
- 정원 데이터는 서버(Supabase)에 단일 정원으로 저장
- 모든 사용자가 접속하면 동일한 정원을 렌더링
- 새 식물이 심어지면 Supabase Realtime을 통해 모든 접속자에게 즉시 반영
- 정원 크기는 식물 수에 따라 동적 확장 (초기 40×30 → 식물 증가 시 확장)

**식물 배치 알고리즘:**
1. 새 식물이 추가되면 빈 셀 중 기존 식물과 적절한 간격을 유지하는 위치 자동 배정
2. 같은 감정 계열 식물은 자연스럽게 군집하도록 가중치 부여
3. 사용자가 원하면 본인 식물의 위치를 드래그로 미세 조정 가능

**실시간 동기화 (Supabase Realtime):**

```typescript
// src/lib/realtime.ts
import { supabase } from "./supabase";

/** 공유 정원의 식물 변경사항을 실시간 구독 */
export function subscribeToGarden(onPlantAdded: (plant: PlantInstance) => void) {
  return supabase
    .channel("garden")
    .on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "plants",
    }, (payload) => {
      onPlantAdded(payload.new as PlantInstance);
    })
    .subscribe();
}

/** 접속 중인 사용자의 캐릭터 위치를 브로드캐스트 */
export function subscribeToPresence(
  onSync: (users: PresenceUser[]) => void
) {
  const channel = supabase.channel("garden-presence");

  channel
    .on("presence", { event: "sync" }, () => {
      const state = channel.presenceState<PresenceUser>();
      const users = Object.values(state).flat();
      onSync(users);
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          userId: getCurrentUserId(),
          character: getMyCharacter(),
          position: getMyPosition(),
        });
      }
    });

  return channel;
}
```

### 7. 일기 공개/비공개 시스템

**비공개 설정 규칙:**
- 일기 작성 시 **기본값은 공개** (다른 사람이 읽을 수 있음)
- 작성 화면에 `PrivacyToggle` 컴포넌트로 공개/비공개 전환
- 비공개 일기: 식물은 정원에 정상적으로 표시되지만, 클릭해도 일기 내용 대신 "이 이야기는 비공개입니다 🔒" 메시지 표시
- 작성 후에도 히스토리 페이지에서 공개/비공개 전환 가능

**식물 클릭 시 동작 분기:**

```typescript
// 식물 클릭 핸들러 로직
async function onPlantClick(plant: PlantInstance) {
  // 1) 내 식물이면 항상 일기 전문 표시
  if (plant.ownerId === currentUserId) {
    showDiaryModal(plant.diaryEntryId, { editable: true });
    return;
  }

  // 2) 타인의 공개 식물이면 일기 전문 표시
  if (!plant.isPrivate) {
    showDiaryModal(plant.diaryEntryId, { editable: false });
    return;
  }

  // 3) 타인의 비공개 식물이면 제한된 정보만 표시
  showPlantInfoOnly({
    species: plant.speciesId,
    emotion: plant.emotion,
    plantedAt: plant.plantedAt,
    message: "이 이야기는 비공개입니다 🔒",
  });
}
```

**Supabase RLS 정책:**

```sql
-- 일기 테이블: 본인 일기는 항상 접근 가능, 타인 일기는 is_private = false인 경우만
CREATE POLICY "diary_read_policy" ON diary_entries
  FOR SELECT USING (
    auth.uid() = user_id
    OR is_private = false
  );

-- 일기 작성: 본인만
CREATE POLICY "diary_insert_policy" ON diary_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 일기 수정 (비공개 전환 포함): 본인만
CREATE POLICY "diary_update_policy" ON diary_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- 식물 테이블: 모든 사용자가 조회 가능 (식물 자체는 항상 공개)
CREATE POLICY "plants_read_policy" ON plants
  FOR SELECT USING (true);
```

### 8. 랜덤 캐릭터 시스템

**캐릭터 생성 규칙:**
- 사용자가 처음 접속하면 랜덤으로 캐릭터가 자동 생성
- 캐릭터는 **조합형**: 몸체 + 머리/헤어 + 색상 + 악세서리(선택)
- 생성된 캐릭터는 사용자 계정에 저장 (재접속 시 동일 캐릭터)
- 원하면 "캐릭터 다시 뽑기" 버튼으로 재생성 가능

**캐릭터 파츠 구성:**

```typescript
// src/lib/character-gen.ts

interface CharacterAppearance {
  bodyType: number;        // 0~7 (8종 몸체)
  headType: number;        // 0~9 (10종 머리/헤어)
  skinColor: string;       // 피부 팔레트에서 랜덤
  hairColor: string;       // 헤어 팔레트에서 랜덤
  outfitColor: string;     // 의상 팔레트에서 랜덤
  accessory: number | null; // 0~7 (8종) 또는 없음 (30% 확률로 장착)
}

/** 시드 기반 랜덤 캐릭터 생성 (userId를 시드로 사용하면 항상 동일한 결과) */
export function generateCharacter(seed: string): CharacterAppearance {
  const rng = seededRandom(seed);
  return {
    bodyType: Math.floor(rng() * 8),
    headType: Math.floor(rng() * 10),
    skinColor: SKIN_PALETTE[Math.floor(rng() * SKIN_PALETTE.length)],
    hairColor: HAIR_PALETTE[Math.floor(rng() * HAIR_PALETTE.length)],
    outfitColor: OUTFIT_PALETTE[Math.floor(rng() * OUTFIT_PALETTE.length)],
    accessory: rng() > 0.7 ? Math.floor(rng() * 8) : null,
  };
}
```

**캐릭터 스프라이트 크기:** 16×16 픽셀 (정원 셀 2개분 크기)

**캐릭터 애니메이션 프레임:**
- idle: 2프레임 (가만히 서있을 때 미세한 움직임)
- walk_down: 4프레임
- walk_up: 4프레임
- walk_left: 4프레임
- walk_right: 4프레임 (또는 walk_left 좌우반전)

**이동 방식:**
- 데스크톱: 방향키 또는 WASD
- 모바일: 가상 조이패드 (화면 좌하단) 또는 탭 이동 (탭한 지점으로 자동 경로 이동)
- 이동 속도: 초당 4셀 (픽셀아트 느낌에 맞는 적당한 속도)
- 다른 사용자의 캐릭터와 충돌 없음 (겹쳐서 지나갈 수 있음)
- 식물과도 충돌 없음 (식물 앞/뒤로 자연스럽게 지나감, Z-index로 깊이감 표현)

**캐릭터 위 닉네임 표시:**
- 캐릭터 머리 위에 작은 텍스트로 닉네임 렌더링
- 본인 캐릭터: 초록색 닉네임
- 타인 캐릭터: 흰색 닉네임
- 너무 많은 캐릭터가 밀집 시 먼 캐릭터의 닉네임은 숨김

**실시간 위치 동기화:**
- Supabase Realtime의 Presence 기능 사용
- 본인 위치 변경 시 100ms 디바운스로 브로드캐스트
- 다른 사용자의 위치 변경은 보간(interpolation)으로 부드럽게 표시
- 접속 종료 시 캐릭터 자동 제거 (Presence가 자동 처리)

### 9. 사용자 인증 (간편 방식)

**인증 흐름:**
1. 첫 접속 시 "닉네임 입력" 화면 표시 (2~12자)
2. Supabase Auth의 Anonymous Sign-in 또는 이메일 로그인 선택
3. 닉네임 + 랜덤 캐릭터 자동 생성
4. 이후 접속 시 자동 로그인 (세션 유지)

**사용자 데이터 구조:**

```typescript
interface UserProfile {
  id: string;                       // Supabase Auth UID
  nickname: string;                 // 표시 닉네임
  character: CharacterAppearance;   // 캐릭터 외형
  createdAt: Date;
  totalPlants: number;              // 심은 식물 총 수
  lastActiveAt: Date;
}
```

---

## Supabase 데이터베이스 스키마

```sql
-- 사용자 프로필
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  nickname TEXT NOT NULL UNIQUE CHECK (char_length(nickname) BETWEEN 2 AND 12),
  character JSONB NOT NULL,         -- CharacterAppearance
  created_at TIMESTAMPTZ DEFAULT now(),
  last_active_at TIMESTAMPTZ DEFAULT now()
);

-- 일기 엔트리
CREATE TABLE diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 20 AND 2000),
  is_private BOOLEAN NOT NULL DEFAULT false,
  analysis JSONB NOT NULL,          -- EmotionAnalysis
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 식물 인스턴스 (공유 정원)
CREATE TABLE plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id),
  diary_entry_id UUID NOT NULL REFERENCES diary_entries(id),
  species_id TEXT NOT NULL,
  position_col INTEGER NOT NULL,
  position_row INTEGER NOT NULL,
  emotion TEXT NOT NULL,
  color_variant TEXT,
  is_private BOOLEAN NOT NULL DEFAULT false,  -- diary_entries.is_private와 동기화
  growth_stage TEXT NOT NULL DEFAULT 'seed',
  planted_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스
CREATE INDEX idx_plants_position ON plants(position_col, position_row);
CREATE INDEX idx_diary_user ON diary_entries(user_id, created_at DESC);
CREATE INDEX idx_plants_owner ON plants(owner_id);
```

---

## UI/UX 디자인 가이드라인

### 전체 톤앤매너

- **감성적이고 따뜻한** 분위기
- 레트로 픽셀아트 느낌이지만 **현대적인 UI 레이아웃**
- 색상은 파스텔 톤 베이스 + 픽셀아트 팔레트
- 폰트: 본문에 "Pretendard" 또는 "Noto Sans KR", 제목/UI 요소에 픽셀 폰트 (예: "DungGeunMo")

### 색상 시스템 (CSS Variables)

```css
:root {
  /* 기본 테마 (낮) */
  --bg-primary: #F5F0E8;        /* 따뜻한 크림색 배경 */
  --bg-secondary: #E8E0D0;      /* 살짝 어두운 배경 */
  --text-primary: #3D3529;       /* 갈색 계열 텍스트 */
  --text-secondary: #8B7E6A;     /* 보조 텍스트 */
  --accent: #7FB069;             /* 초록 계열 강조색 */
  --accent-warm: #E8985E;        /* 따뜻한 강조색 */

  /* 정원 팔레트 */
  --garden-sky: #87CEEB;
  --garden-grass: #7EC850;
  --garden-dirt: #8B6914;
  --garden-water: #4A90D9;

  /* 밤 테마 */
  --night-bg: #1A1A2E;
  --night-sky: #16213E;
  --night-star: #E2E2E2;
}
```

### 페이지별 레이아웃

**메인 (공유 정원 뷰):**
```
┌──────────────────────────────────────────┐
│  🌱 Melancoland    [일기쓰기] [기록] [👤3명] │  ← 접속자 수 표시
├──────────────────────────────────────────┤
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  🌤                               │   │
│  │       🌻  🌷    🌸               │   │
│  │    🚶        🚶‍♀️   🌹  🌳         │   │  ← 캐릭터가 돌아다니는
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │   │     공유 정원 캔버스
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │   │
│  └──────────────────────────────────┘   │
│                                          │
│  방향키/WASD로 이동 | 식물 클릭으로 일기 읽기   │
│  정원의 식물: 47그루 | 참여자: 12명           │  ← 전체 통계
└──────────────────────────────────────────┘
```

**일기 작성 (오버레이 또는 별도 페이지):**
```
┌──────────────────────────────────┐
│  ← 정원으로    2026년 5월 4일        │
├──────────────────────────────────┤
│                                  │
│  오늘 하루를 들려주세요...           │  ← placeholder
│  ┌──────────────────────────┐   │
│  │                          │   │  ← textarea
│  │                          │   │
│  │                          │   │
│  └──────────────────────────┘   │
│                    127 / 2000자  │
│                                  │
│  [🔓 공개] [🔒 비공개]  ← 토글     │  ← 비공개 설정
│                                  │
│       [ 🌱 정원에 심기 ]          │  ← 제출 버튼
└──────────────────────────────────┘
```

**식물 클릭 모달 (공개 일기):**
```
┌──────────────────────────────┐
│  🌻 해바라기  ·  심은 사람: 별이   │
│  2026년 5월 3일               │
├──────────────────────────────┤
│                              │
│  오늘은 오랜만에 친구를 만나서    │
│  정말 즐거웠다. 같이 공원에서...  │
│                              │
├──────────────────────────────┤
│  감정: 기쁨(joy) · 강도: 8/10  │
│  "햇살처럼 환한 하루였군요!"     │  ← gardenMessage
│                     [닫기]    │
└──────────────────────────────┘
```

**식물 클릭 모달 (비공개 일기):**
```
┌──────────────────────────────┐
│  🌻 해바라기  ·  누군가의 식물    │
│  2026년 5월 3일               │
├──────────────────────────────┤
│                              │
│   🔒 이 이야기는 비공개입니다    │
│                              │
│   이 식물에는 기쁨의 감정이      │
│   담겨 있어요.                 │
│                              │
│                     [닫기]    │
└──────────────────────────────┘
```

### 반응형 디자인

- 모바일 (< 768px): 캔버스 풀너비, 세로 스크롤
- 태블릿 (768px ~ 1024px): 캔버스 중앙 배치
- 데스크톱 (> 1024px): 캔버스 + 사이드 패널 (통계/기록)

---

## 개발 순서 (권장 Phase)

### Phase 1: 기초 세팅 + 캔버스 엔진
1. Next.js 프로젝트 초기화 및 기본 구조 세팅
2. Supabase 프로젝트 생성, DB 스키마 및 RLS 정책 적용
3. 픽셀아트 Canvas 렌더링 엔진 구축 (`src/engine/`)
4. 기본 정원 배경 (하늘 + 초원) 렌더링
5. 3~5개 기본 식물 스프라이트 정의 + 성장 애니메이션

### Phase 2: 사용자 인증 + 캐릭터 시스템
1. 간편 인증 (닉네임 입력 → Supabase Auth)
2. 랜덤 캐릭터 생성기 구현 (조합형 스프라이트)
3. 캐릭터 이동 (키보드/터치 입력 → 캔버스 내 이동)
4. 카메라 시스템 (캐릭터 추적)

### Phase 3: 일기 작성 + AI 연동
1. 일기 작성 페이지 UI 구현 (공개/비공개 토글 포함)
2. Claude API 연동 (`/api/analyze`)
3. 감정 분석 결과 파싱 및 식물 매핑
4. 분석 결과 → 공유 정원에 식물 추가 플로우

### Phase 4: 멀티플레이어 + 실시간
1. Supabase Realtime으로 식물 추가 실시간 동기화
2. Presence 채널로 캐릭터 위치 실시간 공유
3. 식물 클릭 → 일기 보기 (공개/비공개 분기 처리)
4. 접속자 수 표시 및 다른 캐릭터 렌더링

### Phase 5: 정원 상호작용 + 폴리싱
1. 날씨 효과 시스템, idle 애니메이션, 파티클
2. 날/밤 전환 (실제 시간 기반)
3. 일기 히스토리 페이지 (내 일기 + 공개 일기 탐색)
4. 식물 종류 확장 (30종 이상)
5. 모바일 최적화 (가상 조이패드, 반응형)
6. SEO, 성능 최적화, PWA 지원

---

## 코드 컨벤션

### 파일 명명 규칙
- 컴포넌트: `PascalCase.tsx` (예: `GardenCanvas.tsx`)
- 유틸리티/라이브러리: `kebab-case.ts` (예: `plant-mapper.ts`)
- 엔진 모듈: `camelCase.ts` (예: `sprites.ts`)
- 타입 정의는 해당 모듈 파일 내에 배치, 공용 타입만 `types.ts`로 분리

### TypeScript 규칙
- `any` 사용 금지. Claude API 응답도 반드시 타입 정의
- 모든 함수에 JSDoc 주석 추가
- 에러 처리: try-catch + 사용자 친화적 fallback

### 컴포넌트 규칙
- Server Component 기본, 상호작용 필요 시에만 `"use client"`
- Canvas 관련 컴포넌트는 반드시 `"use client"` + `dynamic import (ssr: false)`
- Props는 인터페이스로 정의

### 커밋 메시지
- `feat:` 새 기능
- `fix:` 버그 수정
- `engine:` 픽셀 엔진 관련
- `style:` UI/스타일 변경
- `ai:` Claude API 관련

---

## 환경 변수 (.env.local)

```env
# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

---

## 에러 처리 전략

### Claude API 실패 시
1. 1회 자동 재시도 (3초 대기)
2. 재시도 실패 시 기본 분석 결과 반환:
   ```typescript
   const FALLBACK_ANALYSIS: EmotionAnalysis = {
     primaryEmotion: "peace",
     secondaryEmotion: null,
     intensity: 5,
     mood: "serene",
     season: getCurrentSeason(),
     keywords: [],
     plantRecommendation: {
       type: "flower",
       species: "wildflower",
       reason: "오늘의 이야기를 담아 작은 들꽃이 피어났어요."
     },
     weatherEffect: null,
     gardenMessage: "정원에 조용히 꽃 한 송이가 피어났어요.",
   };
   ```
3. 사용자에게 "분석에 어려움이 있어 작은 들꽃을 심었어요" 메시지 표시

### 캔버스 렌더링 오류 시
- Canvas 미지원 브라우저: 정적 이미지 fallback
- WebGL 불필요 (2D Canvas만 사용)

---

## 성능 고려사항

- 캔버스는 `requestAnimationFrame` 사용, 30fps 타겟
- 식물 100개 이상 시 뷰포트 밖 식물은 렌더링 스킵 (카메라 컬링)
- 스프라이트 데이터는 코드에 인라인 (네트워크 요청 없음)
- Claude API 응답은 클라이언트에 캐싱 (같은 일기 재분석 방지)
- 이미지 에셋 최소화: 모든 비주얼은 코드로 렌더링
- 캐릭터 위치 브로드캐스트: 100ms 디바운스, 위치 보간으로 네트워크 부하 최소화
- Presence 최대 동시 접속: 50명까지 원활 (초과 시 먼 캐릭터 숨김 처리)
- 공유 정원 초기 로딩: 식물 데이터 페이지네이션 (뷰포트 근처 우선 로드)

---

## 접근성

- Canvas에 `role="img"` + `aria-label`로 정원 상태 설명
- 일기 작성 폼: 적절한 label 연결
- 키보드 네비게이션 지원
- 색상 대비 WCAG AA 이상 준수
- 식물 클릭 시 텍스트 설명도 함께 제공

---

## 참고: 타입 정의 요약

```typescript
// src/engine/types.ts

type PrimaryEmotion =
  | "joy" | "sadness" | "anger" | "fear" | "surprise"
  | "love" | "peace" | "anxiety" | "hope" | "nostalgia"
  | "loneliness" | "gratitude" | "excitement" | "melancholy" | "determination";

type Mood = "bright" | "warm" | "cool" | "dark" | "dreamy" | "stormy" | "serene";
type Season = "spring" | "summer" | "autumn" | "winter";
type PlantType = "flower" | "tree" | "moss" | "special";
type GrowthStage = "seed" | "sprout" | "grow" | "bloom" | "full";
type WeatherEffect = "sunny" | "rainy" | "cloudy" | "snowy" | "foggy" | "starry" | "rainbow";

interface EmotionAnalysis {
  primaryEmotion: PrimaryEmotion;
  secondaryEmotion: PrimaryEmotion | null;
  intensity: number;              // 1-10
  mood: Mood;
  season: Season;
  keywords: string[];
  plantRecommendation: {
    type: PlantType;
    species: string;
    reason: string;
  };
  weatherEffect: WeatherEffect | null;
  gardenMessage: string;
}

interface PlantSprite {
  id: string;
  name: string;
  frames: Record<GrowthStage, SpriteFrame>;
  palette: string[];              // hex 색상 배열
  growthDuration: number;         // ms
}

interface SpriteFrame {
  width: number;
  height: number;
  data: number[][];               // 2D 배열, 값은 palette 인덱스
}

interface DiaryEntry {
  id: string;
  userId: string;
  content: string;
  isPrivate: boolean;               // 비공개 여부
  createdAt: Date;
  analysis: EmotionAnalysis;
  plantInstanceId: string;
}

// --- 캐릭터 관련 타입 ---

interface CharacterAppearance {
  bodyType: number;                 // 0~7
  headType: number;                 // 0~9
  skinColor: string;
  hairColor: string;
  outfitColor: string;
  accessory: number | null;         // 0~7 또는 없음
}

type CharacterDirection = "down" | "up" | "left" | "right";
type CharacterAnimState = "idle" | "walk";

interface CharacterState {
  userId: string;
  nickname: string;
  appearance: CharacterAppearance;
  position: { col: number; row: number };
  direction: CharacterDirection;
  animState: CharacterAnimState;
}

// --- 실시간 Presence 타입 ---

interface PresenceUser {
  userId: string;
  nickname: string;
  character: CharacterAppearance;
  position: { col: number; row: number };
  direction: CharacterDirection;
}

// --- 사용자 프로필 ---

interface UserProfile {
  id: string;
  nickname: string;
  character: CharacterAppearance;
  createdAt: Date;
  totalPlants: number;
  lastActiveAt: Date;
}
```
