'use server';

import { redirect } from 'next/navigation';

// A Server Action: runs only on the server, callable directly from a <form>.
// No API route or client fetch needed.
export async function submitContact(formData: FormData) {
  const email = formData.get('email');

  // In a real app you would validate and persist here.
  console.log('New contact request from:', email);

  // redirect() throws a special signal that Next.js turns into a navigation.
  redirect('/contact?sent=1');
}
