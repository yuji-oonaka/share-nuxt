export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // このレイアウトは単純に子要素を表示するだけ
  return <>{children}</>;
}