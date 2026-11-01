// Wraps this segment's page in <Suspense>: shown while getReview() resolves.
// It lives here rather than in app/ on purpose — a root loading.tsx would make
// every page stream, and a streamed response can no longer change its 200
// status for notFound(), forbidden() or unauthorized().
export default function Loading() {
  return (
    <main>
      <p>Loading review…</p>
    </main>
  );
}
