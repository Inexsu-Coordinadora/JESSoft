import { ProgramaAcademicoCasoUso } from "../../src/core/aplicacion/casos-uso/ProgramaAcademicoCasoUso";
import { IProgramaAcademicoRepositorio } from "../../src/core/dominio/repositorio/IProgramaAcademico";
import { IProgramaAcademico } from "../../src/core/dominio/entidades/IProgramaAcademico";

describe("Pruebas unitarias ProgramaAcademicoCasoUso", () => {
  let programaRepoMock: jest.Mocked<IProgramaAcademicoRepositorio>;
  let casoUso: ProgramaAcademicoCasoUso;

  beforeEach(() => {
    programaRepoMock = {
      crearPrograma: jest.fn(),
      listarProgramas: jest.fn(),
      obtenerProgramaPorId: jest.fn(),
      actualizarPrograma: jest.fn(),
      eliminarPrograma: jest.fn()
    };

    casoUso = new ProgramaAcademicoCasoUso(programaRepoMock);
  });

  test("Crear un programa académico correctamente", async () => {
    const datos: IProgramaAcademico = {
      nombre: "Ingeniería de Sistemas",
      informacion: "Formación en desarrollo de software, redes y gestión de TI.",
      nivel_educativo: "Profesional",
      duracion: "10 semestres",
      modalidad: "Presencial"
    };

    programaRepoMock.crearPrograma.mockResolvedValue("PA1");

    const result = await casoUso.crearPrograma(datos);

    expect(programaRepoMock.crearPrograma).toHaveBeenCalledWith(datos);
    expect(result).toBe("PA1");
  });

  test("Listar programas sin límite", async () => {
    const lista: IProgramaAcademico[] = [
      {
        id_programa: "PA1",
        nombre: "Administración de Empresas",
        informacion: "Gestión organizacional, finanzas y procesos administrativos.",
        nivel_educativo: "Profesional",
        duracion: "9 semestres",
        modalidad: "Presencial"
      }
    ];

    programaRepoMock.listarProgramas.mockResolvedValue(lista);

    const result = await casoUso.obtenerProgramas();

    expect(result).toEqual(lista);
  });

  test("Listar programas con límite", async () => {
    const lista: IProgramaAcademico[] = [
      {
        id_programa: "PA2",
        nombre: "Contaduría Pública",
        informacion: "Formación en contabilidad, costos, auditoría y normativas NIF.",
        nivel_educativo: "Profesional",
        duracion: "9 semestres",
        modalidad: "Presencial"
      }
    ];

    programaRepoMock.listarProgramas.mockResolvedValue(lista);

    const result = await casoUso.obtenerProgramas(1);

    expect(programaRepoMock.listarProgramas).toHaveBeenCalledWith(1);
    expect(result).toEqual(lista);
  });

  test("Obtener programa por ID correctamente", async () => {
    const programa: IProgramaAcademico = {
      id_programa: "PA10",
      nombre: "Psicología",
      informacion: "Formación en procesos mentales, comportamiento humano y clínica.",
      nivel_educativo: "Profesional",
      duracion: "10 semestres",
      modalidad: "Presencial"
    };

    programaRepoMock.obtenerProgramaPorId.mockResolvedValue(programa);

    const result = await casoUso.obtenerProgramaPorId("PA10");

    expect(result).toEqual(programa);
  });

  test("Obtener programa por ID inexistente retorna null", async () => {
    programaRepoMock.obtenerProgramaPorId.mockResolvedValue(null);

    const result = await casoUso.obtenerProgramaPorId("PA999");

    expect(result).toBeNull();
  });

test("Actualizar programa correctamente", async () => {
  const datos: IProgramaAcademico = {
    nombre: "Ingeniería Industrial",
    informacion: "Optimización de procesos, logística y gestión de operaciones.",
    nivel_educativo: "Profesional",
    duracion: "10 semestres",
    modalidad: "Presencial"
  };

  const existente: IProgramaAcademico = {
    id_programa: "PA50",
    nombre: "Antiguo",
    informacion: "Antiguo",
    nivel_educativo: "Profesional",
    duracion: "10 semestres",
    modalidad: "Presencial"
  };

  const actualizado: IProgramaAcademico = {
    id_programa: "PA50",
    ...datos
  };

  programaRepoMock.obtenerProgramaPorId.mockResolvedValue(existente);

  programaRepoMock.actualizarPrograma.mockResolvedValue(actualizado);

  const result = await casoUso.actualizarPrograma("PA50", datos);

  expect(programaRepoMock.actualizarPrograma).toHaveBeenCalledWith("PA50", datos);
  expect(result).toEqual(actualizado);
});


  test("Error al intentar modificar el ID del programa", async () => {
    const datosInvalidos: IProgramaAcademico = {
      id_programa: "OTRO_ID",
      nombre: "Artes Plásticas",
      informacion: "Formación en pintura, escultura y expresión artística.",
      nivel_educativo: "Profesional",
      duracion: "8 semestres",
      modalidad: "Presencial"
    };

    await expect(casoUso.actualizarPrograma("PA10", datosInvalidos))
      .rejects.toThrow("No se permite modificar el ID del programa académico.");
  });

  test("Actualizar programa inexistente retorna null", async () => {
    programaRepoMock.actualizarPrograma.mockResolvedValue(null);

    const datos: IProgramaAcademico = {
      nombre: "Mercadeo",
      informacion: "Marketing digital, investigación de mercados y estrategias comerciales.",
      nivel_educativo: "Profesional",
      duracion: "8 semestres",
      modalidad: "Presencial"
    };

    const result = await casoUso.actualizarPrograma("PA999", datos);

    expect(result).toBeNull();
  });

  test("Eliminar correctamente", async () => {
    programaRepoMock.eliminarPrograma.mockResolvedValue();

    await casoUso.eliminarPrograma("PA20");

    expect(programaRepoMock.eliminarPrograma).toHaveBeenCalledWith("PA20");
  });

  test("Eliminar lanza error cuando el repositorio falla", async () => {
    programaRepoMock.eliminarPrograma.mockRejectedValue(new Error("DB error"));

    await expect(casoUso.eliminarPrograma("PA77")).rejects.toThrow("DB error");
  });
});
