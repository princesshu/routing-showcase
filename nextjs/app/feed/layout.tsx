export default function FeedLayout({ children, modal }: LayoutProps<'/feed'>) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
