declare namespace App {
  interface Locals {
    // Set by src/middleware.ts for on-demand requests.
    user: { role: 'admin' | 'user' } | null;
  }
}
