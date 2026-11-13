# Project Gacha — 이소연 포트폴리오

캡슐 뽑기 기계로 프로젝트를 소개하는 포트폴리오 사이트예요. Vite + React 18 + React Router.

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 에 배포용 파일 생성
```

## 페이지

| 경로 | 화면 |
|---|---|
| `/` | 뽑기 기계 (홈) — 마우스로 집게 이동, 클릭해서 뽑기, 나온 캡슐을 눌러 열기 |
| `/projects/:id` | 프로젝트 자세히 보기 (`sign`, `cat`, `chick`, `card`, `cocktail`) |
| `/about` | 내 정보 |

## 내용 고치기

- **프로젝트 내용·색·캡슐 위치**: `src/data/capsules.js` 한 곳에 모여 있어요.
- **아이콘**: `src/assets/icons/*.svg`
- **스크린샷**: `src/assets/shots/`에 이미지를 넣고, `src/pages/ProjectDetail.jsx`의 `p-shots` 칸을 `<img>`로 바꿔주세요.
- **데모 링크**: `capsules.js`에서 각 프로젝트의 `links.demo`를 채우면 버튼이 생겨요.
- **유리창 투명/뿌옇게**: `src/pages/Gacha.jsx`의 `CLEAR_GLASS`.

## 구조

```
src/
  App.jsx                 라우팅 + 열어본 캡슐(Collection) 상태, localStorage에 저장
  data/capsules.js        캡슐 6개의 데이터
  pages/Gacha.jsx         뽑기 기계 (집게 애니메이션 타임라인)
  pages/ProjectDetail.jsx 자세히 보기
  pages/About.jsx         내 정보
  components/             Nav, Capsule, RevealNote(쪽지), CollectionSheet
  styles/                 global / gacha / project / about
```

## 배포 (Vercel)

저장소를 Vercel에 연결하면 바로 배포돼요. `vercel.json`에 SPA 경로 설정이 들어 있어서 `/about` 같은 주소로 새로고침해도 404가 나지 않아요.
