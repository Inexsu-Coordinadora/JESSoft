import { z } from "zod";

const capitalizar = (texto: string) =>
    texto
        .trim()
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase());

export const EsquemaPlanEstudio = z.object({
    id_programa: z
        .string()
        .nonempty("El id del programa es obligatorio"),

    id_asignatura: z
        .string()
        .nonempty("El id de la asignatura es obligatorio"),

    semestre: z
        .number({ message: "El semestre es obligatorio." })
        .int("El semestre debe ser un número entero")
        .positive("El semestre debe ser mayor a 0"),
/*
    creditos: z
          .number()
          .int("Los créditos deben ser un número entero")
          .positive("Los créditos deben ser mayores a 0")
          .optional(),
  
      carga_horaria: z
          .number()
          .int("La carga horaria debe ser un número entero")
          .positive("La carga horaria debe ser mayor a 0")
          .optional(),
  */
});
export type planEstudioDTO = z.infer<typeof EsquemaPlanEstudio>;