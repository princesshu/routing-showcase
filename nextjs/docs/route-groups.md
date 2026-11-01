# Route groups and private folders

Two folder prefixes change how a folder takes part in routing: `(name)` keeps the folder out of the URL, `_name` keeps it out of routing entirely.

## Route groups

A folder in parentheses organizes routes, and can have its own layout, without appearing in the URL.

**In this repo:** `app/(marketing)/home` → `/home`, `app/(marketing)/contact` → `/contact`, `app/(auth)/login` → `/login`, `app/(auth)/register` → `/register`.

```
app/
├─ (marketing)/
│  ├─ home/page.tsx       → /home
│  └─ contact/page.tsx    → /contact
└─ (auth)/
   ├─ login/page.tsx      → /login
   └─ register/page.tsx   → /register
```

A group can give its routes a shared layout without changing their URLs:

```
app/
├─ (marketing)/
│  ├─ layout.tsx          → header and footer for /home, /contact
│  └─ home/page.tsx
└─ (auth)/
   ├─ layout.tsx          → centered card for /login, /register
   └─ login/page.tsx
```

### Good to know

- **No two groups may resolve to the same URL.** `(marketing)/about/page.tsx` and `(shop)/about/page.tsx` both mean `/about`, which is a build error.
- **Multiple root layouts:** groups can each have their own root layout. Navigating between routes with different root layouts triggers a full page load.
- **Home route in a group:** with multiple root layouts and no top-level `app/layout.tsx`, the home route must live inside one of the groups, for example `app/(marketing)/page.tsx`.

## Private folders

A folder starting with an underscore is opted out of routing, including everything inside it.

**In this repo:** `app/_components/pending-hint.tsx`, `app/dashboard/_components/` (breadcrumb, status widget), `app/feed/_components/modal.tsx`.

Non-route files are already safe next to a page, because only `page` and `route` files are public; the CSS Modules in this repo rely on that. A private folder makes the intent explicit, and stays safe even if a file inside it is later named `page.tsx`.

Reference: [Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups), [Private folders](https://nextjs.org/docs/app/getting-started/project-structure#private-folders)
