import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';

export const server = {
  contact: defineAction({
    // Accepts a <form> POST, so the page works without client JavaScript.
    accept: 'form',
    input: z.object({
      // An empty form field arrives as null, so the type error is the
      // "missing" message.
      name: z.string({ error: 'Enter your name.' }),
      message: z
        .string({ error: 'Write a message.' })
        .min(10, 'Write at least 10 characters.'),
    }),
    handler: async ({ name }) => ({ name }),
  }),
};
