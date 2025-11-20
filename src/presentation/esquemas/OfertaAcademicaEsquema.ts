import { z } from "zod";

const capitalizar = (texto: string) =>
  texto
    .trim()
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());

export const EsquemaOfertaAcademica = z.object({
  id_periodo: z
    .string()
    .nonempty("El ID del periodo académico es obligatorio")
    .max(20, "El ID del periodo no puede tener más de 20 caracteres")
    .transform((t) => t.trim()),

  id_plan: z
    .string()
    .nonempty("El ID del plan académico es obligatorio")
    .max(20, "El ID del plan no puede tener más de 20 caracteres")
    .transform((t) => t.trim()),

  grupo: z
    .string()
    .nonempty("El grupo es obligatorio")
    .max(10, "El grupo no puede tener más de 10 caracteres")
    .transform(capitalizar),

  cupo: z
    .number({
      message: "El cupo es obligatorio",
    })
    .int("El cupo debe ser un número entero")
    .positive("El cupo debe ser mayor que cero"),
});

export type OfertaAcademicaDTO = z.infer<typeof EsquemaOfertaAcademica>;
