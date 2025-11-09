import { z } from "zod";

export const esquemaCrearOferta = z.object({
  id_periodo: z
    .string()
    .min(2, { message: "El ID del periodo es obligatorio." }),

  id_plan: z
    .string()
    .min(2, { message: "El ID del plan de estudio es obligatorio." }),

  grupo: z
    .string()
    .optional(), 

  cupo: z
    .number({ required_error: "El cupo es obligatorio." })
    .int({ message: "El cupo debe ser un número entero." })
    .positive({ message: "El cupo debe ser mayor que cero." }),
});
