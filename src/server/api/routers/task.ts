import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().nullish(),
        projectId: z.string().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.projectId === "inbox") {
        input = { ...input, projectId: null };
      }
      return await ctx.db.task.create({
        data: {
          name: input.name,
          description: input.description,
          projectId: input.projectId,
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
        projectId: z.string(),
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
          projectId: input.projectId,
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
  readInbox: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.task.findMany({
      where: { projectId: null },
      include: {
        comments: true,
      },
      orderBy: {
        createdAt: "asc",
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
