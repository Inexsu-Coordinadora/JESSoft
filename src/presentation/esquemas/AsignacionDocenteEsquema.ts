import { z } from "zod";

const mayusculas = (texto: string) =>
  texto
    .trim() 
    .toUpperCase()

export const EsquemaAsignacionDocente = z.object({
  id_docente: z
    .string()
    .nonempty("El id del docente es obligatorio")
    .transform(mayusculas),

  id_oferta: z
    .string()
    .nonempty("El id de la oferta academica es obligatorio")
    .transform(mayusculas),

});
export type AsignacionDocenteDTO = z.infer<typeof EsquemaAsignacionDocente>;
