# View transitions

Every Astro navigation loads a new document by default, so nothing on the page survives it. `<ClientRouter />` switches a page to client-side navigation, and `transition:persist` keeps chosen elements, island state included, across those navigations.

**In this repo:** `/transitions/1`, `/transitions/2` and `/transitions/3` include the router. Each step has two counters: one persisted, one not.

## Example

```astro
---
// src/layouts/Base.astro
import { ClientRouter } from 'astro:transitions';
---

<head>{clientRouter && <ClientRouter />}</head>
```

```astro
---
// src/pages/transitions/[step].astro
---

<Base title={`Step ${step}`} clientRouter>
  <Counter client:load transition:persist label="Persisted" />
  <Counter client:load label="Not persisted" />
</Base>
```

Count up on both buttons and move to the next step. The persisted counter keeps its number; the other one starts again from zero, because its island is rendered anew with the incoming page.

## Compared with Next.js layouts

In the Next.js App Router, a layout stays mounted while its child pages change, so its state survives navigation without asking. Astro starts from the opposite end: everything is replaced unless an element opts in with `transition:persist`. That is also why Astro has no parallel or intercepting routes. Both are built on a component tree that survives navigation, and an Astro page does not keep one.

## Good to know

- **Native view transitions need no router.** Browsers can animate between full page loads with the CSS `@view-transition` rule. `<ClientRouter />` adds client-side navigation, persisted state and lifecycle events on top. Astro's docs expect it to become less necessary as browser support grows.
- **Scripts:** bundled module scripts run once, not on every navigation. Code that has to run after each page swap listens for the `astro:page-load` event.
- **Opting out:** `data-astro-reload` on a link or form forces a full page load.

Reference: [View transitions](https://docs.astro.build/en/guides/view-transitions/)
