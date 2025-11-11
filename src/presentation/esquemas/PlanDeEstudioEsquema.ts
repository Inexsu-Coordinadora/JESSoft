import { z } from "zod";

export const EsquemaPlanEstudio = z.object({
  id_programa: z
    .string()
    .nonempty("El ID del programa académico es obligatorio")
    .max(20, "El ID del programa no puede superar 20 caracteres"),

  id_asignatura: z
    .string()
    .nonempty("El ID de la asignatura es obligatorio")
    .max(20, "El ID de la asignatura no puede superar 20 caracteres"),

  semestre: z
    .number()
    .int("El semestre debe ser un número entero")
    .positive("El semestre debe ser mayor que 0"),
});

export type PlanEstudioDTO = z.infer<typeof EsquemaPlanEstudio>;
