import signIcon from '../assets/icons/icon-sign.svg';
import catIcon from '../assets/icons/icon-cat.svg';
import chickIcon from '../assets/icons/icon-chick.svg';
import cardIcon from '../assets/icons/icon-card.svg';
import cocktailIcon from '../assets/icons/icon-cocktail.svg';
import aboutIcon from '../assets/icons/icon-about.svg';
import barkitWallet from '../assets/shots/barkit-1-wallet.webp';
import barkitStore from '../assets/shots/barkit-2-store.webp';
import barkitMap from '../assets/shots/barkit-3-map.webp';
import dongneHome from '../assets/shots/dongne-1-home.webp';
import dongnePost from '../assets/shots/dongne-2-post.webp';
import dongneMap from '../assets/shots/dongne-3-map.webp';
import archSign from '../assets/arch/arch-sign.svg';
import archChick from '../assets/arch/arch-chick.svg';
import type { Capsule, CapsuleId, ProjectCapsule } from '../types';

/**
 * 뽑기 기계 안의 캡슐 6개.
 * - colors: [하이라이트, 메인, 그림자] — 캡슐 그라데이션과 배경 빛 번짐에 사용
 * - pos: [x(%), bottom(px), 회전(deg)] — 유리창 안 위치
 * - type: 'project'면 자세히 보기 페이지가 있고, 'about'이면 About으로 연결
 */
export const CAPSULES: Capsule[] = [
  {
    id: 'chick',
    type: 'project',
    icon: chickIcon,
    colors: ['#FFFBE0', '#FFDF6E', '#F2B320'],
    tint: '#FFF8DC',
    pos: [70, 4, -6],
    tag: '노랑 캡슐',
    name: 'Doody',
    summary: '공백청년의 생활 리듬과 경제적 자립을 돕는 금융 AI 서비스',
    role: '백엔드 단독 개발',
    from: '청년 금융인재 양성 프로젝트',
    period: '2026.05 – 2026.07',
    stackShort: 'Spring Boot · JPA · PostgreSQL · AWS EC2',
    stack: 'Java · Spring Boot · JPA · PostgreSQL · AWS EC2 · GitHub Actions',
    story: [
      ['개요', '미션과 회고 같은 작은 일상 행동을 금융 보상과 연결해, 공백청년의 생활 리듬과 자립을 돕는 서비스예요. 5인 팀에서 백엔드를 혼자 맡았어요.'],
      ['문제와 해결', '백엔드와 AI 서버 사이의 연동 요청이 실패했어요. 오류 로그와 양쪽 입력 정의를 대조해 userId와 user_id 필드명 불일치를 찾고, 담당자와 요청 규격을 합의해 직렬화 형식을 맞췄어요. AI 서버가 응답하지 않아도 회원가입이 멈추지 않도록 온보딩 단계별 기본값도 처리했어요.'],
      ['내가 맡은 일', '사용자, 미션, 회고, 금융교육, 보상, 인증 내역까지 6개 데이터 영역을 18개 엔티티로 설계하고 API 20개를 구현했어요. AI 온보딩 질문이 바뀔 때마다 DB 구조와 API 흐름을 다시 설계했고, GitHub Actions로 EC2에 배포하면서 DB 접속 정보 같은 비밀값은 Secrets로 분리했어요.'],
      ['결과와 배운 점', '테스트·API 문서화 에이전트를 만들어 보상 테스트 20개와 API 테스트 4개를 생성했어요. 결함 5종을 일부러 넣었을 때 모두 잡아냈고, 기존 테스트를 포함해 35개가 통과했어요.'],
    ],
    stats: [
      ['18', '엔티티 설계', '6개 데이터 영역'],
      ['20', 'REST API 구현', '단독 개발'],
      ['35', 'Java 테스트 통과', '실패 0, 건너뜀 0'],
      ['5/5', '주입한 결함 탐지', '원본과 분리한 복사본에서 검증'],
    ],
    pivot: {
      title: '대상과 방향을 다시 정했어요',
      before: ['은둔청년', '금융상품을 연결하는 서비스'],
      after: ['공백청년', '금융교육 · 작은 미션 · 소액 보상'],
      reason: '아이들과미래재단 인터뷰에서 "대상자를 찾기 어렵고, 금융상품처럼 보이면 신뢰를 얻기 힘들다"는 의견을 들었어요.',
      applied: '달라진 서비스 흐름을 사용자 · 미션 · 금융교육 등 6개 데이터 영역과 API에 반영하고, Swagger 응답과 DB 저장값을 대조해 기획 의도대로 구현됐는지 확인했어요.',
    },
    cases: [
      {
        title: '온보딩 진단 전달 형식 맞추기',
        problem: 'AI 서버 계약은 진단을 질문 · 선택지 목록(문항 수 비고정)으로, DB는 리듬 · 자립 · 연결 선택번호를 정수 컬럼 3개에 저장하는 고정 구조로 정의해 서로 달랐어요.',
        choice: 'AI 담당자와 MVP 범위를 영역별 1문항 · 4지선다로 확인하고, 기존 정수 컬럼을 유지한 채 원시 선택번호를 보내기로 했어요. 여러 문항이 필요해지면 그때 목록 구조로 바꾸도록 범위를 나눴어요.',
        steps: [
          'OnboardingResponse의 rhythmChoice · autonomyChoice · connectionChoice 정수 필드 유지',
          'AiOnboardingClient가 세 선택번호를 Diagnosis(rhythm, autonomy, connection)로 매핑해 전송',
          'AI가 계산해 돌려준 초기 상태 · 추천 기간을 저장 흐름에 연결',
        ],
        scope: 'AI 서버가 응답하지 않을 때를 대비한 백엔드 기본값 계산은 남겨 뒀어요.',
      },
      {
        title: '추천 기간을 하나의 기준으로',
        problem: '처음엔 사용자가 고른 기간을 온보딩 기록과 목표에 저장했는데, 기획 피드백으로 기간 선택 화면을 없애고 추천 기간을 보여 주기로 바뀌었어요.',
        choice: '목표 선택값(goal_choice)으로 카탈로그에서 기간을 정하는 AI 계약을 따라, 저장과 응답이 모두 같은 추천 기간을 쓰게 했어요.',
        steps: ['요청 기간 필수 검사 제거', '회원가입 시 AI 온보딩 호출 추가', 'AI가 돌려준 기간을 온보딩 기록 · 목표 저장과 회원가입 응답에 사용'],
        evidence: '커밋 513425a · 2026.06.28',
      },
      {
        title: '새 미션이 와도 기록이 남도록',
        problem: 'AI 엔진에 새 미션이 생겼는데 DB 미션 목록에 없으면 미션 기록 저장이 외래키 위반으로 실패할 수 있다는 지적이 있었어요. 외래키를 없애자는 대안도 나왔어요.',
        choice: '미션 기록과 미션 템플릿 사이의 외래키는 유지하고, 없는 미션을 먼저 저장하는 쪽으로 보완했어요.',
        steps: ['미션 ID로 먼저 조회', '없으면 AI 응답의 미션 정보로 템플릿을 만들어 저장', '그다음 추천 기록 생성'],
        scope: '처음 보는 미션을 먼저 저장하는 범위까지예요. 기존 미션 내용이 바뀌는 것까지 자동으로 맞추지는 않아요.',
        evidence: '커밋 aeadf5a · 2026.07.04',
      },
    ],
    archImg: archChick,
    arch: {
      ci: ['GitHub · main', 'GitHub Actions', 'Gradle · Java 21'],
      server: { title: 'AWS EC2', items: ['Spring Boot', 'Java 21'], foot: 'Spring Data JPA · REST API' },
      deps: [['SQL', 'PostgreSQL'], ['이미지 저장', 'Amazon S3'], ['HTTP API', 'AI 서버']],
    },
    flows: [
      {
        title: '테스트 생성부터 문서화까지',
        steps: [['입력', '서비스 코드와 보상 규칙 확인'], ['실행', '테스트 작성 후 Gradle 실행'], ['결과 수집', '종료 코드와 JUnit XML 분석'], ['문서화', '통과 결과와 소스를 확인한 뒤 명세 생성']],
        loop: '실행 결과를 모델에 돌려주고 다음 행동을 선택',
        checks: [
          ['상태 관리', '이전 XML을 지우고 테스트를 고치면 결과를 무효화. 0개 실행이나 전체 건너뜀은 성공으로 치지 않음'],
          ['작성 범위', '테스트와 API 문서만 자동으로 작성하고, 실제 서비스 코드는 자동 수정하지 않음'],
        ],
      },
    ],
    defects: {
      title: '선택한 결함 5종으로 탐지 조건 검증',
      rows: [['0 또는 음수 포인트 거절 조건 제거', 3], ['중복 수집 방지 조건 제거', 1], ['템플릿 기본 등급 오류', 1], ['포인트 출처 ID 누락', 1], ['연락처 축 변경', 1]],
      note: 'Mock의 null 반환으로 생긴 우연한 예외를 없애고 엔티티를 반환하도록 고쳤어요. XML 파서와 실패 집계도 회귀 사례로 확인했어요.',
    },
    links: { repo: 'https://github.com/HanaDoody/doody-backend', demo: null },
  },
  {
    id: 'sign',
    type: 'project',
    icon: signIcon,
    colors: ['#E9FFF6', '#8FE0C2', '#3FAE86'],
    tint: '#EAF8F2',
    pos: [33, 4, -12],
    tag: '민트 캡슐',
    name: '동네방네',
    summary: '관심 지역의 게시물과 큐레이션을 제공하는 지역 커뮤니티 서비스',
    role: '백엔드 개발',
    shotFrame: true,
    shots: [
      [dongneHome, '새 글과 맞춤 큐레이션이 보이는 홈 화면'],
      [dongnePost, '게시물 상세와 장소 지도 화면'],
      [dongneMap, '동네 지도에서 장소를 찾는 화면'],
    ],
    from: 'UMC 8기',
    period: '2025.06 – 2025.08',
    stackShort: 'Spring Boot · Spring Security · JWT · JPA · MySQL · AWS',
    stack: 'Java · Spring Boot · Spring Security · JWT · JPA · MySQL · AWS EC2 · RDS · S3 · GitHub Actions',
    story: [
      ['개요', '회원의 관심 지역에 맞춰 게시물을 보여주고, 여러 장소를 묶은 큐레이션을 제공하는 서비스예요. 여러 백엔드 개발자가 기능을 나눠 맡았고, 저는 API와 초기 인증 기반, 배포 환경을 담당했어요.'],
      ['문제와 해결', '빌드와 배포를 매번 손으로 반복해야 했어요. GitHub Actions로 dev 브랜치에 반영되면 Gradle 빌드, EC2로 JAR 전달, 앱 재실행까지 자동으로 이어지게 만들었어요. 테스트 자동 실행은 다음 개선 과제로 남겨뒀어요.'],
      ['내가 맡은 일', 'Spring Security와 JWT로 초기 인증을 만들었어요. 토큰 발급과 서명 검증, 인증 필터에서 확인한 사용자 정보를 SecurityContext에 등록하는 부분이에요. 인증 정보에서 회원 ID를 꺼내 관심 지역 조회 조건으로 연결해 큐레이션·홈 조회 API를 구현했고, 매주 정해진 시각에 큐레이션을 만드는 스케줄러와 RDS 접속, S3 업로드 기반도 구성했어요.'],
      ['결과와 배운 점', '실제 배포 성공 기록과 EC2 재실행, 주요 API의 정상 응답을 확인했어요. 정상·만료·변조 토큰 처리와 권한별 API 접근도 직접 점검했어요.'],
    ],
    archImg: archSign,
    arch: {
      ci: ['GitHub · dev', 'GitHub Actions', 'Gradle · Java 17'],
      server: { title: 'AWS EC2', items: ['Spring Boot', 'Java 17'], foot: 'Spring Security · JWT · JPA · REST API' },
      deps: [['SQL', 'AWS RDS · MySQL'], ['파일 저장', 'Amazon S3'], ['OAuth2', '소셜 로그인']],
    },
    flows: [
      {
        title: 'GitHub Actions 배포 자동화',
        steps: [['GitHub', 'dev 반영'], ['Actions', '워크플로 실행'], ['Build', 'Gradle 빌드'], ['EC2', '실행 JAR 전달'], ['Restart', '앱 재실행']],
        checks: [
          ['확인한 구현', 'dev 트리거, build 성공 후 deploy 실행, SCP 전송과 SSH 재실행'],
          ['검증 결과', 'GitHub Actions 실행 성공, EC2 애플리케이션 재실행 및 주요 API 정상 응답 확인'],
        ],
      },
      {
        title: 'Spring Security · JWT 인증',
        steps: [['요청', '클라이언트가 토큰을 요청에 담아 전달'], ['토큰 검사', '인증 필터에서 추출하고 서명과 유효성 확인'], ['인증 정보 등록', '확인한 사용자 정보를 SecurityContext에 등록'], ['API 처리', '인증 정보로 회원 ID와 데이터 조회']],
        checks: [
          ['확인한 구현', '토큰 추출과 서명·만료·유형 검사, 인증 정보 등록, 보호 경로 설정'],
          ['검증 결과', '정상 토큰의 사용자 식별, 만료·변조 토큰 처리 및 권한별 API 접근 확인'],
        ],
      },
    ],
    links: { repo: 'https://github.com/dongnae-bangnae/BE', demo: null },
  },
  {
    id: 'cat',
    type: 'project',
    icon: catIcon,
    colors: ['#FFF1E4', '#FFB27A', '#F07E3C'],
    tint: '#FFF2E8',
    pos: [52, 4, 18],
    tag: '오렌지 캡슐',
    name: '댕냥스퀘어',
    summary: '반려동물 동반 장소와 산책로 정보를 제공하는 지도 · 커뮤니티 Android 앱',
    role: 'Android 개발',
    from: 'UMC 7기',
    period: '2024.12 – 2025.02',
    stackShort: 'Kotlin · Android',
    stack: 'Kotlin · Android · Git',
    story: [
      ['개요', '반려동물과 함께 갈 수 있는 장소와 산책로를 지도에서 찾고, 커뮤니티에서 이야기를 나누는 앱이에요.'],
      ['문제와 해결', '데모데이 2주 전, 산책 경로 기능을 전부 만들기엔 시간이 부족했어요. 구현 범위와 소요 기간을 정리해 기획 담당자와 범위를 합의했고, 핵심 기능을 우선해 지도 표시까지 완성했어요.'],
      ['내가 맡은 일', '시작 화면, 로그인·회원가입, 홈, 커뮤니티 게시판, 마이페이지를 구현하고 API와 연동했어요. 기능별 완료 여부를 점검하며 일정도 관리했어요.'],
      ['결과와 배운 점', '데모데이 이후에도 출시 작업을 이어가 Google Play 심사를 진행하고 있어요 (2026.10 기준).'],
    ],
    links: { repo: 'https://github.com/DogCatSquare/FE', demo: null },
  },
  {
    id: 'card',
    type: 'project',
    icon: cardIcon,
    colors: ['#EEF3FF', '#9DBBFF', '#4F7FE6'],
    tint: '#EEF2FF',
    pos: [87, 4, 24],
    tag: '파랑 캡슐',
    name: 'Barkit',
    summary: "여러 멤버십·포인트 바코드를 한곳에 모으고, 지도에서 매장별로 쓸 수 있는 멤버십을 보여 주는 지도형 멤버십 지갑",
    role: "React 프론트엔드 개발",
    shots: [
      [barkitWallet, '대표 멤버십 바코드와 멤버십 리스트 화면'],
      [barkitStore, '매장 상세에서 보유 멤버십을 바로 꺼내는 화면'],
      [barkitMap, '지도에서 매장을 고르는 화면'],
    ],
    from: "UMC 9기 · 11인 팀 (프론트엔드 4명)",
    period: '2025.12 – 2026.02',
    stackShort: "React · TypeScript · TanStack Query · Google Maps · Vercel",
    stack: "React · TypeScript · Vite · TanStack Query · Axios · Zustand · TailwindCSS · Google Maps · Vercel",
    story: [
      ["개요", "여러 멤버십과 포인트 바코드를 한곳에 모으고, 지도에서 매장을 고르면 그 매장에서 쓸 수 있는 멤버십을 바로 꺼내 주는 서비스예요. 11명 팀(PM 1, 디자인 1, 프론트엔드 4, 백엔드 5)에서 지도·매장 검색 화면 전체와 멤버십 카드·상세 화면, 배포 설정을 맡았어요."],
      ["문제와 해결", "위치나 지도 중심이 바뀌어도 검색이 다시 일어나지 않는 구조였어요. 사용자 좌표를 useRef에 담아 값이 바뀌어도 다시 렌더링되지 않았고, 좌표가 queryKey에 없어 같은 캐시를 계속 썼기 때문이에요. 좌표를 useState로 바꾸고 지도 중심과 내 위치의 위도·경도를 queryKey에 넣었고, 좌표가 준비된 뒤에만 조회하도록 enabled 조건을 걸었어요. 거리순은 내 위치, 인기순은 지도 중심을 기준으로 보내도록 나눴어요."],
      ["내가 맡은 일", "Google 지도 연동과 매장 마커, watchPosition 위치 추적과 현재 위치 버튼, 지도가 멈추면(idle) 중심 좌표로 검색하는 흐름을 만들었어요. 검색바·카테고리 칩·정렬 모달·드래그형 바텀시트와 useInfiniteQuery 커서 기반 무한 스크롤, 매장 상세(영업 여부·사진·보유 멤버십·전화번호 복사·길찾기)도 구현했어요. 서버 명세와 어긋난 파라미터명(userlat → userLat)과 카테고리·정렬 코드 매핑, isOpen 응답 타입을 맞췄고, Vercel rewrites로 /api/* 요청을 백엔드로 프록시해 배포 환경 통신을 연결했어요. README와 이슈·PR 템플릿을 만들고 AI 코드 리뷰(CodeRabbit)를 적용했어요."],
      ["결과와 배운 점", "좌표·검색어·카테고리·정렬 중 하나만 바뀌어도 자동으로 다시 조회하는 구조로 정리했고, 검색·필터·정렬·상세 조회 API 연결을 마쳤어요. 머지를 뺀 커밋 132개, 6,493줄 추가 · 4,457줄 삭제로 기여했어요."],
    ],
    stats: [
      ["132", "커밋", "머지 제외"],
      ["6,493", "줄 추가", "삭제 4,457줄"],
      ["41", "MapHomePage 수정", "가장 많이 고친 파일"],
      ["11", "명 팀", "프론트엔드 4명 중 지도 담당"],
    ],
    flows: [
      {
        title: "지도를 움직이면 다시 검색되는 흐름",
        steps: [["지도 이동", "idle 이벤트로 멈춤 감지"], ["좌표 갱신", "지도 중심·내 위치를 useState로"], ["queryKey 변경", "위도·경도·검색어·카테고리·정렬"], ["무한 스크롤 조회", "useInfiniteQuery · 커서 기반"], ["바텀시트 목록", "거리순 / 인기순 결과 표시"]],
        checks: [
          ["원인", "좌표를 useRef에 담아 리렌더가 없고, queryKey에 좌표가 빠져 같은 캐시를 씀"],
          ["조회 조건", "좌표가 준비된 뒤에만 조회(enabled). 거리순은 내 위치, 인기순은 지도 중심 기준"],
        ],
      },
      {
        title: "배포 환경 통신 연결",
        steps: [["브라우저", "Axios baseURL 상대 경로"], ["Vercel", "/api/* rewrites 프록시"], ["api.barkit.site", "http → https → 도메인 순으로 전환"], ["EC2 백엔드", "매장 검색·멤버십 API"]],
        checks: [
          ["SPA 라우팅", "/(.*) → /index.html fallback으로 새로고침 404 방지"],
          ["API 명세", "파라미터명 통일, CATEGORY_MAP 코드 매핑, isOpen boolean 타입 정리"],
        ],
      },
    ],
    links: { repo: 'https://github.com/Barkit-UMC/Barkit-web', demo: null },
  },
  {
    id: 'cocktail',
    type: 'project',
    icon: cocktailIcon,
    colors: ['#FFEEF5', '#FF9EC4', '#F2558D'],
    tint: '#FFEFF5',
    pos: [43, 74, 8],
    tag: '핑크 캡슐',
    name: 'SHAKING!',
    summary: '감정을 해금하고 손님에게 감정 칵테일을 만들어 주는 캐주얼 게임',
    role: '게임 개발',
    from: '게임 개발 동아리 NPC 7기',
    period: '2023.01 – 2023.05',
    stackShort: 'Lua · Corona SDK',
    stack: 'Lua · Corona SDK · Android Studio',
    story: [
      ['개요', '손님의 감정을 해금하고, 그 감정에 맞는 칵테일을 만들어 건네는 캐주얼 게임이에요.'],
      ['문제와 해결', '처음 다뤄보는 Lua와 Corona SDK를 새로 익히면서 만들어야 했어요. 출시 경험도 없었지만, Android Studio로 키 발급과 빌드 과정을 하나씩 익혔어요.'],
      ['내가 맡은 일', '칵테일 제조와 상점 기능을 구현했어요.'],
      ['결과와 배운 점', 'Google Play 스토어에 출시했어요.'],
    ],
    links: { repo: null, demo: 'https://play.google.com/store/apps/details?id=ddwu.npc.shaking', demoLabel: 'Google Play에서 보기' },
  },
  {
    id: 'about',
    type: 'about',
    icon: aboutIcon,
    colors: ['#F3EEFF', '#C3AEFF', '#8A68F2'],
    pos: [78, 74, -20],
    tag: '보라 캡슐',
    name: '이소연',
    summary: '서비스 기획 의도를 데이터 구조와 API로 옮기는 백엔드 · 안드로이드 개발자예요.',
    role: 'About',
  },
];

export const PROJECTS: ProjectCapsule[] = CAPSULES.filter((c): c is ProjectCapsule => c.type === 'project');

/** 주소창의 id처럼 아무 문자열이나 받을 수 있어서, 없으면 undefined를 돌려줘요. */
export const byId = (id: string | undefined): Capsule | undefined => CAPSULES.find((c) => c.id === id);

/** 데이터에 반드시 있는 id로 캡슐을 꺼내요. (뽑기 기계 안처럼 id가 확실할 때) */
export const getCapsule = (id: CapsuleId): Capsule => {
  const c = byId(id);
  if (!c) throw new Error(`캡슐 데이터가 없어요: ${id}`);
  return c;
};

export const capsuleFill = (c: Pick<Capsule, 'colors'>): string =>
  `radial-gradient(circle at 34% 28%, ${c.colors[0]} 0%, ${c.colors[1]} 42%, ${c.colors[2]} 100%)`;
export const capsuleTopFill = (c: Pick<Capsule, 'colors'>): string =>
  `radial-gradient(120% 140% at 35% 20%, ${c.colors[0]} 0%, ${c.colors[1]} 45%, ${c.colors[2]} 100%)`;
