import { z } from "zod";

const capitalizar = (texto: string) =>
  texto
    .trim() 
    .toLowerCase() 
    .replace(/^\w/, (c) => c.toUpperCase()); 

export const EsquemaProgramaAcademico = z.object({
  nombre: z
    .string()
    .nonempty("El nombre del programa académico es obligatorio")
    .max(50, "El nombre no puede tener más de 50 caracteres")
    .transform(capitalizar),

  informacion: z
    .string()
    .nonempty("La información del programa académico es obligatoria")
    .max(50, "La información no puede tener más de 50 caracteres")
    .transform(capitalizar),

  nivel_educativo: z
    .string()
    .nonempty("El nivel educativo es obligatorio")
    .max(20, "El nivel educativo no puede tener más de 20 caracteres")
    .regex(/^(Tecnico|Tecnologico|Profesional|Posgrado|Maestria|Doctorado)$/i, {
      message:
        "El nivel educativo debe ser uno de: Tecnico, Tecnologico, Profesional, Posgrado, Maestria o Doctorado",
    })
    .transform(capitalizar),

  duracion: z
    .string()
    .nonempty("La duración es obligatoria")
    .max(20, "La duración no puede tener más de 20 caracteres")
    .regex(/^[0-9]+ (semestres|años|meses)$/i, {
      message:
        "La duración debe tener un formato válido, por ejemplo: '8 semestres' o '2 años'",
    })
    .transform((t) => t.trim()), 

  modalidad: z
    .string()
    .nonempty("La modalidad es obligatoria")
    .max(20, "La modalidad no puede tener más de 20 caracteres")
    .regex(/^(Presencial|Virtual|Distancia)$/i, {
      message: "La modalidad debe ser 'Presencial', 'Virtual' o 'Distancia'",
    })
    .transform(capitalizar),
});
export type ProgramaAcademicoDTO = z.infer<typeof EsquemaProgramaAcademico>;
