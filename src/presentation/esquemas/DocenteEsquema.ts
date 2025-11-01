import { z } from 'zod';

export const DocenteEsquema = z.object({
  documento_identidad: z.string().min(5),
  nombre: z.string(),
  primer_apellido: z.string(),
  segundo_apellido: z.string().optional(),
  especialidad: z.string(),
  vinculacion: z.string(),
  correo_institucional: z.string().email().optional(),
});
