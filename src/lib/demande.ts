import { z } from "zod";

export const demandeSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(150),
    phone: z.string().trim().max(40).optional().default(""),
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    adults: z.coerce.number().int().min(1).max(30),
    children: z.coerce.number().int().min(0).max(30).default(0),
    breakfast: z.boolean().default(false),
    message: z.string().trim().max(2000).optional().default(""),
    locale: z.enum(["fr", "en"]).default("fr"),
    website: z.string().max(0).optional().default(""), // honeypot: must stay empty
  })
  .refine((v) => v.checkOut > v.checkIn, { path: ["checkOut"], message: "invalidDates" });

export type Demande = z.infer<typeof demandeSchema>;
