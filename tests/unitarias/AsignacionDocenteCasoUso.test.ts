import { AsignacionDocenteCasoUso } from "../../src/core/aplicacion/casos-uso/AsignacionDocenteCasoUso";
import { IAsignacionDocenteRepositorio } from "../../src/core/dominio/repositorio/IAsignacionDocenteRepositorio";
import { IAsignacionDocente } from "../../src/core/dominio/entidades/IAsignacionDocente";

describe("Pruebas unitarias AsignacionDocenteCasoUso", () => {
  let asignacionRepoMock: jest.Mocked<IAsignacionDocenteRepositorio>;
  let asignacionCasoUso: AsignacionDocenteCasoUso;

  beforeEach(() => {
    asignacionRepoMock = {
      crearAsignacion: jest.fn(),
      listarAsignaciones: jest.fn(),
      obtenerAsignacionPorId: jest.fn(),
      actualizarAsignacion: jest.fn(),
      eliminarAsignacion: jest.fn(),
      verificarExistenciaDocente: jest.fn(),
      verificarExistenciaGrupo: jest.fn(),
      verificarAsignacionExistente: jest.fn(),
      contarAsignacionesPorDocente: jest.fn(),
      verificarGrupoTieneDocente: jest.fn()
    };

    asignacionCasoUso = new AsignacionDocenteCasoUso(asignacionRepoMock);
  });

  test("Crear una asignación correctamente", async () => {
    const nuevaAsignacion: IAsignacionDocente = {
      id_docente: "D1",
      id_oferta: "OF1"
    };

    asignacionRepoMock.verificarExistenciaDocente.mockResolvedValue(true);
    asignacionRepoMock.verificarExistenciaGrupo.mockResolvedValue(true);
    asignacionRepoMock.verificarAsignacionExistente.mockResolvedValue(false);
    asignacionRepoMock.contarAsignacionesPorDocente.mockResolvedValue(2);
    asignacionRepoMock.verificarGrupoTieneDocente.mockResolvedValue(false);
    asignacionRepoMock.crearAsignacion.mockResolvedValue("AS1");

    const result = await asignacionCasoUso.crearAsignacion(nuevaAsignacion);

    expect(asignacionRepoMock.crearAsignacion).toHaveBeenCalledWith(nuevaAsignacion);
    expect(result).toBe("AS1");
  });

  test("Error si el docente no existe", async () => {
    const asignacion: IAsignacionDocente = { id_docente: "NO_EXISTE", id_oferta: "OF1" };

    asignacionRepoMock.verificarExistenciaDocente.mockResolvedValue(false);

    await expect(asignacionCasoUso.crearAsignacion(asignacion))
      .rejects.toThrow("El docente especificado no existe.");
  });

  test("Error si el grupo no existe", async () => {
    const asignacion: IAsignacionDocente = { id_docente: "D1", id_oferta: "NO_EXISTE" };

    asignacionRepoMock.verificarExistenciaDocente.mockResolvedValue(true);
    asignacionRepoMock.verificarExistenciaGrupo.mockResolvedValue(false);

    await expect(asignacionCasoUso.crearAsignacion(asignacion))
      .rejects.toThrow("El grupo (oferta académica) especificado no existe.");
  });

  test("Error si la asignación ya existe", async () => {
    const asignacion: IAsignacionDocente = { id_docente: "D1", id_oferta: "OF1" };

    asignacionRepoMock.verificarExistenciaDocente.mockResolvedValue(true);
    asignacionRepoMock.verificarExistenciaGrupo.mockResolvedValue(true);
    asignacionRepoMock.verificarAsignacionExistente.mockResolvedValue(true);

    await expect(asignacionCasoUso.crearAsignacion(asignacion))
      .rejects.toThrow("Ya existe una asignación para este docente y este grupo.");
  });

  test("Error si el docente supera el límite de grupos", async () => {
    const asignacion: IAsignacionDocente = { id_docente: "D1", id_oferta: "OF1" };

    asignacionRepoMock.verificarExistenciaDocente.mockResolvedValue(true);
    asignacionRepoMock.verificarExistenciaGrupo.mockResolvedValue(true);
    asignacionRepoMock.verificarAsignacionExistente.mockResolvedValue(false);
    asignacionRepoMock.contarAsignacionesPorDocente.mockResolvedValue(5);

    await expect(asignacionCasoUso.crearAsignacion(asignacion))
      .rejects.toThrow("El docente ya tiene el límite máximo (5) de grupos asignados.");
  });

  test("Error si el grupo ya tiene un docente", async () => {
    const asignacion: IAsignacionDocente = { id_docente: "D1", id_oferta: "OF1" };

    asignacionRepoMock.verificarExistenciaDocente.mockResolvedValue(true);
    asignacionRepoMock.verificarExistenciaGrupo.mockResolvedValue(true);
    asignacionRepoMock.verificarAsignacionExistente.mockResolvedValue(false);
    asignacionRepoMock.contarAsignacionesPorDocente.mockResolvedValue(2);
    asignacionRepoMock.verificarGrupoTieneDocente.mockResolvedValue(true);

    await expect(asignacionCasoUso.crearAsignacion(asignacion))
      .rejects.toThrow("Este grupo ya tiene un docente asignado.");
  });

  test("Listar todas las asignaciones sin límite", async () => {
    const asignaciones: IAsignacionDocente[] = [
      { id_asignacion: "AS1", id_docente: "D1", id_oferta: "OF1" },
      { id_asignacion: "AS2", id_docente: "D2", id_oferta: "OF2" }
    ];

    asignacionRepoMock.listarAsignaciones.mockResolvedValue(asignaciones);

    const result = await asignacionCasoUso.obtenerAsignaciones();

    expect(asignacionRepoMock.listarAsignaciones).toHaveBeenCalled();
    expect(result).toEqual(asignaciones);
  });

  test("Listar asignaciones con límite", async () => {
    const asignaciones: IAsignacionDocente[] = [
      { id_asignacion: "AS1", id_docente: "D1", id_oferta: "OF1" },
      { id_asignacion: "AS2", id_docente: "D2", id_oferta: "OF2" }
    ];

    const limite = 1;

    asignacionRepoMock.listarAsignaciones.mockResolvedValue(asignaciones.slice(0, limite));

    const result = await asignacionCasoUso.obtenerAsignaciones(limite);

    expect(asignacionRepoMock.listarAsignaciones).toHaveBeenCalledWith(limite);
    expect(result).toEqual(asignaciones.slice(0, limite));
  });


  test("Obtener asignación por ID", async () => {
    const asignacion: IAsignacionDocente = {
      id_asignacion: "AS1",
      id_docente: "D1",
      id_oferta: "OF1"
    };

    asignacionRepoMock.obtenerAsignacionPorId.mockResolvedValue(asignacion);

    const result = await asignacionCasoUso.obtenerAsignacionPorId("AS1");

    expect(asignacionRepoMock.obtenerAsignacionPorId).toHaveBeenCalledWith("AS1");
    expect(result).toEqual(asignacion);
  });


  test("Actualizar asignación inexistente retorna null", async () => {
    asignacionRepoMock.actualizarAsignacion.mockResolvedValue(null);

    const datos: IAsignacionDocente = {
      id_docente: "D1",
      id_oferta: "OF1"
    };

    const result = await asignacionCasoUso.actualizarAsignacion("AS999", datos);

    expect(result).toBeNull();
  });

  test("Error al intentar cambiar el ID de la asignación", async () => {
    const datosInvalidos: IAsignacionDocente = {
      id_asignacion: "AS9",
      id_docente: "D1",
      id_oferta: "OF1"
    };

    await expect(
      asignacionCasoUso.actualizarAsignacion("AS10", datosInvalidos)
    ).rejects.toThrow("No se permite modificar el ID de la asignación.");
  });

  test("Actualizar correctamente una asignación", async () => {

    asignacionRepoMock.obtenerAsignacionPorId.mockResolvedValue({
      id_asignacion: "AS10",
      id_docente: "D1",
      id_oferta: "OF1"
    });

    const respuestaActualizada = {
      id_asignacion: "AS10",
      id_docente: "D2",
      id_oferta: "OF3"
    };

    const datosActualizados = {
      id_docente: "D2",
      id_oferta: "OF3"
    };

    asignacionRepoMock.actualizarAsignacion.mockResolvedValue(respuestaActualizada);

    const result = await asignacionCasoUso.actualizarAsignacion("AS10", datosActualizados);

    expect(asignacionRepoMock.actualizarAsignacion)
      .toHaveBeenCalledWith("AS10", datosActualizados);

    expect(result).toEqual(respuestaActualizada);
  });


  test("Eliminar asignación", async () => {
    asignacionRepoMock.eliminarAsignacion.mockResolvedValue();

    await asignacionCasoUso.eliminarAsignacion("AS50");

    expect(asignacionRepoMock.eliminarAsignacion).toHaveBeenCalledWith("AS50");
  });
});
