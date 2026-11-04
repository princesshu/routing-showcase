import { createFileRoute } from '@tanstack/react-router';

// "[.]" escapes the dot, so this server route answers /robots.txt instead
// of nesting a "txt" route under "robots".
export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response('User-agent: *\nAllow: /\n', {
          headers: { 'content-type': 'text/plain; charset=utf-8' },
        }),
    },
  },
});
