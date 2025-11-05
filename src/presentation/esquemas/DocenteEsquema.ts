import { FromSchema } from 'json-schema-to-ts';

export const DocenteSchema = {
  type: 'object',
  properties: {
    cedula: { type: 'string', minLength: 1 },
    nombre: { type: 'string', minLength: 1 },
    apellido: { type: 'string', minLength: 1 },
    especialidad: { type: 'string', minLength: 1 },
    vinculacion: {
      type: 'string',
      enum: ['Tiempo completo', 'Catedra', 'Medio tiempo'],
    },
  },
  required: ['cedula', 'nombre', 'apellido', 'especialidad', 'vinculacion'],
  additionalProperties: false,
} as const;

export type DocenteBodyType = FromSchema<typeof DocenteSchema>;
