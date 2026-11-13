# Project Gacha — 이소연 포트폴리오

캡슐 뽑기 기계로 프로젝트를 소개하는 포트폴리오 사이트예요. Vite + React 18 + TypeScript + React Router.

## 실행

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # 타입 검사만
npm run build      # 타입 검사 후 dist/ 에 배포용 파일 생성
```

`npm run build`는 타입 검사(`tsc`)를 먼저 해요. 타입 오류가 있으면 빌드와 Vercel 배포가 실패해서, 잘못된 코드가 올라가지 않아요.

## 페이지

| 경로 | 화면 |
|---|---|
| `/` | 뽑기 기계 (홈) — 마우스로 집게 이동, 클릭해서 뽑기, 나온 캡슐을 눌러 열기 |
| `/projects/:id` | 프로젝트 자세히 보기 (`chick`, `sign`, `cat`, `card`, `cocktail`) |
| `/about` | 내 정보 |

## 내용 고치기

- **프로젝트 내용·색·순서**: `src/data/capsules.ts` 한 곳에 모여 있어요. 데이터 모양은 `src/types.ts`의 `ProjectCapsule`을 따라야 해서, 항목을 빠뜨리면 에디터가 바로 알려줘요.
- **프로토타입 화면**: `src/data/flows.ts`, 이미지는 `src/assets/flows/`
- **아이콘**: `src/assets/icons/*.svg`
- **데모 링크**: `capsules.ts`에서 각 프로젝트의 `links.demo`를 채우면 버튼이 생겨요.
- **배경 / 유리창**: `src/pages/Gacha.tsx`의 `BACKGROUND`, `CLEAR_GLASS`

## 구조

```
src/
  types.ts                캡슐·프로토타입 등 공통 타입
  App.tsx                 라우팅 + 열어본 캡슐(Collection) 상태, localStorage에 저장
  data/capsules.ts        캡슐 6개의 데이터
  data/flows.ts           프로젝트별 클릭 프로토타입
  lib/physics.ts          캡슐 물리 엔진 (중력·충돌·굴러감)
  pages/Gacha.tsx         뽑기 기계 (집게 애니메이션 타임라인)
  pages/ProjectDetail.tsx 자세히 보기
  pages/About.tsx         내 정보
  components/             Nav, Capsule, RevealNote(쪽지), CollectionSheet, PhoneFlow, ProjectFigures
  styles/                 global / gacha / project / about
```

## 배포 (Vercel)

저장소를 Vercel에 연결하면 바로 배포돼요. `vercel.json`에 SPA 경로 설정이 들어 있어서 `/about` 같은 주소로 새로고침해도 404가 나지 않아요.
