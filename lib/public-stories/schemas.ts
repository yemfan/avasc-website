import { z } from "zod";

export const createPublicStorySchema = z.object({
  title: z.string().min(3).max(200),
  body: z.string().min(20).max(20_000),
  isAnonymous: z.boolean().optional(),
});

export type CreatePublicStoryInput = z.infer<typeof createPublicStorySchema>;
