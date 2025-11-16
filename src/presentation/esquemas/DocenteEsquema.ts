import { z } from "zod";

const capitalizar = (texto: string) =>
  texto
    .trim()
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());

export const EsquemaDocente = z.object({
  cedula: z
    .string()
    .nonempty("La cédula es obligatoria")
    .max(20, "La cédula no puede tener más de 20 caracteres"),

  nombre: z
    .string()
    .nonempty("El nombre es obligatorio")
    .max(50, "El nombre no puede tener más de 50 caracteres")
    .transform(capitalizar),

  apellido: z
    .string()
    .nonempty("El apellido es obligatorio")
    .max(50, "El apellido no puede tener más de 50 caracteres")
    .transform(capitalizar),

  especialidad: z
    .string()
    .nonempty("La especialidad es obligatoria")
    .max(100, "La especialidad no puede tener más de 100 caracteres")
    .transform(capitalizar),

  vinculacion: z.enum([
    "Tiempo completo",
    "Catedra",
    "Medio tiempo",
  ]),
});

export type DocenteDTO = z.infer<typeof EsquemaDocente>;
