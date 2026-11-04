// The "-" prefix keeps this folder out of the route tree, so components can
// sit next to the routes that use them. Next.js and Astro use "_" for this;
// in TanStack Router, "_" makes a pathless layout instead.

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function Price({ value }: { value: number }) {
  return <span>{usd.format(value)}</span>;
}
