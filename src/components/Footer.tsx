/** 모든 페이지 맨 아래의 작은 푸터. */
const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {YEAR} 이소연</p>
    </footer>
  );
}
