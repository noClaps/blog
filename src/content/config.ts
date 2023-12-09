import { z, defineCollection, reference } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    lastmod: z.date().optional(),
    author: reference("authors"),
    series: z.number().optional()
  }),
});

const authors = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    link: z.string().url(),
  }),
});

const notes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    lastmod: z.date().optional(),
    author: reference("authors")
  })
});

export const collections = {
  posts: posts,
  authors: authors,
  notes: notes
};
