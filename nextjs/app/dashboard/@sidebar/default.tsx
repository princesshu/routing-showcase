// default.tsx renders when the slot has no page for the URL on a full page
// load (here: a reload of /dashboard/settings). On client navigation the slot
// keeps its last active page instead. Reusing the page means the sidebar looks
// the same either way; return null or call notFound() for other behavior.
export { default } from './page';
