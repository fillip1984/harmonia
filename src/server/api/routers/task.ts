import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string(), description: z.string().nullish() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.task.create({
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),
  readAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.task.findMany({
      include: {
        comments: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }),
  read: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.task.findFirst({
        where: {
          id: input.id,
        },
        include: {
          comments: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.task.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.task.delete({
        where: {
          id: input.id,
        },
      });
    }),
  addComment: publicProcedure
    .input(z.object({ text: z.string(), taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.comment.create({
        data: { text: input.text, taskId: input.taskId },
      });
    }),
});
