import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { addTrainingSignup, getSignupsForDate, hasConfirmationEmailBeenSent, recordConfirmationEmail } from "./db";
import { sendTrainingConfirmationEmail } from "./email";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  training: router({
    signup: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        trainingDate: z.string(),
        acceptsContact: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await addTrainingSignup({
            name: input.name,
            email: input.email,
            trainingDate: input.trainingDate,
            acceptsContact: input.acceptsContact ? 1 : 0,
          });

          // Check if we should send confirmation emails
          if (result) {
            const signups = await getSignupsForDate(input.trainingDate);
            const emailAlreadySent = await hasConfirmationEmailBeenSent(input.trainingDate);

            // Send confirmation email if 4+ people signed up and email hasn't been sent yet
            if (signups.length >= 4 && !emailAlreadySent) {
              const recipients = signups
                .filter((s) => s.acceptsContact === 1)
                .map((s) => ({ name: s.name, email: s.email }));

              if (recipients.length > 0) {
                const emailSent = await sendTrainingConfirmationEmail(input.trainingDate, recipients);
                if (emailSent) {
                  await recordConfirmationEmail(input.trainingDate, recipients.length);
                }
              }
            }
          }

          return { success: !!result, signup: result };
        } catch (error) {
          console.error("Failed to add training signup:", error);
          throw error;
        }
      }),
    getSignups: publicProcedure
      .input(z.object({
        trainingDate: z.string(),
      }))
      .query(async ({ input }) => {
        return await getSignupsForDate(input.trainingDate);
      }),
  }),
});

export type AppRouter = typeof appRouter;
