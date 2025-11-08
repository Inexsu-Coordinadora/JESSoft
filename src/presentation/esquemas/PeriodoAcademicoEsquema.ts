import { z } from "zod";

const capitalizar = (texto: string) =>
  texto
    .trim() 
    .toLowerCase() 
    .replace(/^\w/, (c) => c.toUpperCase()); 

const lowerCase = (texto: string) =>
  texto
    .trim() 
    .toLowerCase()    

export const EsquemaPeriodoAcademico = z.object({

  fecha_inicio: z
    .coerce.date("La fecha debe ser de tipo yyyy-mm-dd"),

  fecha_fin: z
    .coerce.date("la fecha debe ser de tipo yyyy-mm-dd"),

  estado: z
    .string()
    .nonempty("El estado del periodo academico es obligatorio")
    .max(20, "El estado del periodo academico no puede tener más de 15 caracteres")
    .regex(/^(activo|cerrado|en preparacion)$/i, {
      message:
        "El estado del periodo debe ser: activo, cerrado o en preparacion",
    })
    .transform(lowerCase),

  descripcion: z
    .string()
    .nonempty("La descripción del periodo académico es obligatoria")
    .max(50, "La descripción no puede tener más de 50 caracteres")
    .transform(capitalizar),
});
export type PeriodoAcademicoDTO = z.infer<typeof EsquemaPeriodoAcademico>;
