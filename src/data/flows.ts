/* 자세히 보기의 '직접 눌러보는' 프로토타입 흐름.
   hot: 다음 화면으로 넘어가는 탭 위치 [x, y] (화면 기준 0~1). null이면 마지막 화면. */
import type { PrototypeFlow, ProjectId } from '../types';

const files = import.meta.glob<string>('../assets/flows/*.webp', { eager: true, import: 'default' });

const img = (name: string): string => {
  const src = files[`../assets/flows/${name}`];
  if (!src) throw new Error(`프로토타입 이미지가 없어요: ${name}`);
  return src;
};

export const FLOWS: Partial<Record<ProjectId, PrototypeFlow>> = {
  card: {
    title: '멤버십 등록하기',
    landscape: false,
    screens: [
      { src: img('card-1.webp'), label: '홈', hot: [0.3, 0.6] },
      { src: img('card-2.webp'), label: '멤버십 상세', hot: [0.91, 0.48] },
      { src: img('card-3.webp'), label: '등록 방법 선택', hot: [0.45, 0.34] },
      { src: img('card-4.webp'), label: '번호 입력 선택', hot: [0.5, 0.9] },
      { src: img('card-5.webp'), label: '번호 입력', hot: [0.87, 0.88] },
      { src: img('card-6.webp'), label: '입력 완료', hot: [0.5, 0.9] },
      { src: img('card-7.webp'), label: '등록 성공', hot: [0.5, 0.9] },
    ],
  },
  sign: {
    title: '가입부터 첫 게시물까지',
    landscape: false,
    screens: [
      { src: img('sign-1.webp'), label: '소셜 로그인', hot: [0.5, 0.69] },
      { src: img('sign-2.webp'), label: '로딩', hot: [0.5, 0.5] },
      { src: img('sign-3.webp'), label: '프로필 설정', hot: [0.5, 0.93] },
      { src: img('sign-4.webp'), label: '동네 검색', hot: [0.5, 0.13] },
      { src: img('sign-5.webp'), label: '동네 선택', hot: [0.66, 0.94] },
      { src: img('sign-6.webp'), label: '선택 완료', hot: [0.5, 0.93] },
      { src: img('sign-7.webp'), label: '홈', hot: [0.84, 0.14] },
      { src: img('sign-8.webp'), label: '새 글 목록', hot: [0.5, 0.25] },
      { src: img('sign-9.webp'), label: '게시물 상세', hot: null },
    ],
  },
  chick: {
    title: '두디와 하루 시작하기',
    landscape: false,
    screens: [
      { src: img('chick-1.webp'), label: '온보딩 질문', hot: [0.5, 0.94] },
      { src: img('chick-2.webp'), label: '호흡 추천', hot: [0.5, 0.94] },
      { src: img('chick-3.webp'), label: '두디 탄생', hot: [0.31, 0.84] },
      { src: img('chick-4.webp'), label: '필드 홈', hot: [0.76, 0.83] },
      { src: img('chick-5.webp'), label: '아침 기분 체크', hot: [0.49, 0.85] },
      { src: img('chick-6.webp'), label: '응원 메시지', hot: [0.52, 0.61] },
      { src: img('chick-7.webp'), label: '미션 완료', hot: [0.49, 0.58] },
      { src: img('chick-8.webp'), label: '회복 리포트', hot: null },
    ],
  },
  cat: {
    title: '로그인부터 산책 기록까지',
    landscape: false,
    screens: [
      { src: img('cat-1.webp'), label: '스플래시', hot: [0.5, 0.5] },
      { src: img('cat-2.webp'), label: '로그인', hot: [0.5, 0.875] },
      { src: img('cat-3.webp'), label: '홈', hot: [0.5, 0.81] },
      { src: img('cat-4.webp'), label: '장소 지도', hot: [0.48, 0.14] },
      { src: img('cat-5.webp'), label: '산책 시작', hot: [0.76, 0.925] },
      { src: img('cat-6.webp'), label: '경로 기록', hot: [0.74, 0.925] },
      { src: img('cat-7.webp'), label: '커뮤니티', hot: [0.4, 0.32] },
      { src: img('cat-8.webp'), label: '게시글 상세', hot: null },
    ],
  },
  cocktail: {
    title: '감정 칵테일 만들기',
    landscape: true,
    screens: [
      { src: img('cocktail-1.webp'), label: '바 입장', hot: [0.62, 0.6] },
      { src: img('cocktail-2.webp'), label: '손님 맞이', hot: [0.95, 0.9] },
      { src: img('cocktail-3.webp'), label: '대화', hot: [0.95, 0.9] },
      { src: img('cocktail-4.webp'), label: '감정 해금', hot: [0.6, 0.6] },
      { src: img('cocktail-5.webp'), label: '리듬 게임', hot: [0.5, 0.55] },
      { src: img('cocktail-6.webp'), label: '재료 선택', hot: [0.27, 0.4] },
      { src: img('cocktail-7.webp'), label: '도구 선택', hot: [0.18, 0.37] },
      { src: img('cocktail-8.webp'), label: '칵테일 완성', hot: null },
    ],
  },
};
