import { AsignaturaCasosUso } from "../../src/core/aplicacion/casos-uso/AsignaturaCasosUso";
import { IAsignaturaRepositorio } from "../../src/core/dominio/repositorio/IAsignaturaRepositorio";
import { Asignatura } from "../../src/core/dominio/entidades/Asignatura";
import { AsignaturaDTO } from "../../src/presentation/esquemas/AsignaturaEsquema";


describe("AsignaturaCasosUso", () => {
  const mockRepo = {
    obtenerTodas: jest.fn(),
    obtenerPorId: jest.fn(),
    crear: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(),
  } as unknown as IAsignaturaRepositorio;

  const casosUso = new AsignaturaCasosUso(mockRepo);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("obtenerTodas debe retornar la lista proveniente del repositorio", async () => {
    const listaMock = [
      { id: "1", nombre: "Matemáticas", creditos: 4, carga_horaria: 60, tipo: "Teorico", descripcion: "Desc" },
      { id: "2", nombre: "Física", creditos: 3, carga_horaria: 45, tipo: "Teorico", descripcion: "Desc2" },
    ];
    mockRepo.obtenerTodas = jest.fn().mockResolvedValue(listaMock);

    const result = await casosUso.obtenerTodas();

    expect(mockRepo.obtenerTodas).toHaveBeenCalledTimes(1);
    expect(result).toEqual(listaMock);
  });

  it("obtenerPorId debe retornar la asignatura cuando existe", async () => {
    const id = "123";
    const asignaturaMock = { id, nombre: "Química", creditos: 3, carga_horaria: 50, tipo: "Lab", descripcion: "Desc" };
    mockRepo.obtenerPorId = jest.fn().mockResolvedValue(asignaturaMock);

    const result = await casosUso.obtenerPorId(id);

    expect(mockRepo.obtenerPorId).toHaveBeenCalledWith(id);
    expect(result).toEqual(asignaturaMock);
  });

  it("crear debe llamar al repositorio y retornar el DTO creado", async () => {
    const dto: AsignaturaDTO = {
      nombre: "Historia",
      creditos: 2,
      carga_horaria: 30,
      tipo: "Teorico",
      descripcion: "Historia mundial"
    };
    mockRepo.crear = jest.fn().mockResolvedValue(undefined);

    const result = await casosUso.crear(dto);

    expect(mockRepo.crear).toHaveBeenCalledTimes(1);
    // Verificamos que se llamó con una entidad que contiene los campos del DTO
    expect(mockRepo.crear).toHaveBeenCalledWith(expect.objectContaining({
      nombre: dto.nombre,
      creditos: dto.creditos,
      carga_horaria: dto.carga_horaria,
      tipo: dto.tipo,
      descripcion: dto.descripcion
    }));
    expect(result).toEqual({
      nombre: dto.nombre,
      creditos: dto.creditos,
      carga_horaria: dto.carga_horaria,
      tipo: dto.tipo,
      descripcion: dto.descripcion
    });
  });

  it("actualizar debe llamar al repositorio con la entidad y id y retornar el DTO actualizado", async () => {
    const id = "abc";
    const dto: AsignaturaDTO = {
      nombre: "Geografía",
      creditos: 3,
      carga_horaria: 40,
      tipo: "Teorico",
      descripcion: "Mapas y regiones"
    };
    mockRepo.actualizar = jest.fn().mockResolvedValue(undefined);

    const result = await casosUso.actualizar(dto, id);

    expect(mockRepo.actualizar).toHaveBeenCalledTimes(1);
    expect(mockRepo.actualizar).toHaveBeenCalledWith(expect.objectContaining({
      nombre: dto.nombre,
      creditos: dto.creditos,
      carga_horaria: dto.carga_horaria,
      tipo: dto.tipo,
      descripcion: dto.descripcion
    }), id);
    expect(result).toEqual({
      nombre: dto.nombre,
      creditos: dto.creditos,
      carga_horaria: dto.carga_horaria,
      tipo: dto.tipo,
      descripcion: dto.descripcion
    });
  });

  it("eliminar debe delegar al repositorio con el id", async () => {
    const id = "to-delete";
    mockRepo.eliminar = jest.fn().mockResolvedValue(undefined);

    await casosUso.eliminar(id);

    expect(mockRepo.eliminar).toHaveBeenCalledTimes(1);
    expect(mockRepo.eliminar).toHaveBeenCalledWith(id);
  });

  it("propaga errores del repositorio en crear", async () => {
    const dto: AsignaturaDTO = {
      nombre: "ErrorTest",
      creditos: 1,
      carga_horaria: 10,
      tipo: "Teorico",
      descripcion: "Desc"
    };
    mockRepo.crear = jest.fn().mockRejectedValue(new Error("DB error"));

    await expect(casosUso.crear(dto)).rejects.toThrow("DB error");
    expect(mockRepo.crear).toHaveBeenCalled();
  });
});
