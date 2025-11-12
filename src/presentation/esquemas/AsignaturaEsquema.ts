import { z } from "zod";

const capitalizar = (texto: string) =>
  texto
    .trim()
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());

export const EsquemaAsignatura = z.object({
  nombre: z
    .string()
    .nonempty("El nombre de la asignatura es obligatorio")
    .max(100, "El nombre no puede tener más de 100 caracteres")
    .transform(capitalizar),

  creditos: z
    .number({
      message: "El número de créditos es obligatorio",

    })
    .int("Los créditos deben ser un número entero")
    .positive("Los créditos deben ser mayores que cero"),

  carga_horaria: z
    .number({
      message: "La carga horaria es obligatoria",
    })
    .int("La carga horaria debe ser un número entero")
    .positive("La carga horaria debe ser mayor que cero"),

  tipo: z
    .string()
    .nonempty("El tipo de asignatura es obligatorio")
    .regex(/^(teorica|practica|mixta)$/i, {
      message: "El tipo debe ser 'teorica', 'practica' o 'mixta'",
    })
    .transform((t) => t.toLowerCase()),

  descripcion: z
    .string()
    .nonempty("La descripción es obligatoria")
    .max(200, "La descripción no puede tener más de 200 caracteres")
    .transform(capitalizar),
});

export type AsignaturaDTO = z.infer<typeof EsquemaAsignatura>;

