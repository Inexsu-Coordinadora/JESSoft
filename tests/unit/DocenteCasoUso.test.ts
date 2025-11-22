import { DocenteCasoUso } from "../../src/core/aplicacion/casos-uso/DocenteCasoUso";
import { IDocenteRepositorio } from "../../src/core/dominio/repositorio/IDocenteRepositorio";
import { IDocente } from "../../src/core/dominio/entidades/IDocente";

describe("Pruebas unitarias DocenteCasoUso", () => {
    let docenteRepoMock: jest.Mocked<IDocenteRepositorio>;
    let docenteCasoUso: DocenteCasoUso;
    
    beforeEach(() => {
       docenteRepoMock = {
        crearDocente: jest.fn(),
        listarDocentes: jest.fn(),
        obtenerDocentePorId: jest.fn(),
        actualizarDocente: jest.fn(),
        eliminarDocente: jest.fn(),
       };

  docenteCasoUso = new DocenteCasoUso(docenteRepoMock);
});


test("Obtener docente por ID -  funciona", async () => {
  const docenteEsperado : IDocente = {
    id_docente: "D1",
    cedula: "10235462",
    nombre: "Edwin",
    apellido: "Rivera",
    especialidad: "Matemáticas",
    vinculacion: "Tiempo completo",
  };

  docenteRepoMock.obtenerDocentePorId.mockResolvedValue(docenteEsperado); 
  const resultado = await docenteCasoUso.obtenerDocentePorId("D1");

  expect(docenteRepoMock.obtenerDocentePorId).toHaveBeenCalled();
  expect(docenteRepoMock.obtenerDocentePorId).toHaveBeenCalledWith("D1");
  expect(resultado).toEqual(docenteEsperado); 
});

test("Obtener docente por ID - no existe", async () => {
  docenteRepoMock.obtenerDocentePorId.mockResolvedValue(null);

  const resultado = await docenteCasoUso.obtenerDocentePorId("D999");

  expect(docenteRepoMock.obtenerDocentePorId).toHaveBeenCalled();
  expect(docenteRepoMock.obtenerDocentePorId).toHaveBeenCalledWith("D999");
  expect(resultado).toBeNull();
});

test("Listar todos los docentes - Caso exitoso", async () => {
  const docentesEsperados: IDocente[] = [
    {
      id_docente: "D1",
      cedula: "10235462",
      nombre: "Edwin",
      apellido: "Rivera",
      especialidad: "Matemáticas",
      vinculacion: "Tiempo completo",
    },
    {
      id_docente: "D2",
      cedula: "102354",
      nombre: "Ana",
      apellido: "Gómez",
      especialidad: "Biología",
      vinculacion: "Catedra",
    },
  ];

  docenteRepoMock.listarDocentes.mockResolvedValue(docentesEsperados);
  const resultado = await docenteCasoUso.obtenerDocentes();

  expect(docenteRepoMock.listarDocentes).toHaveBeenCalled();
  expect(resultado).toEqual(docentesEsperados);
});

test("Crear docente - funciona", async () => {
  const nuevoDocente: IDocente = {
    cedula: "987654",
    nombre: "Carlos",
    apellido: "Lopez",
    especialidad: "Física",
    vinculacion: "Catedra",
  };

  docenteRepoMock.crearDocente.mockResolvedValue("D3");

  const resultado = await docenteCasoUso.crearDocente(nuevoDocente);

  expect(docenteRepoMock.crearDocente).toHaveBeenCalled();
  expect(docenteRepoMock.crearDocente).toHaveBeenCalledWith(nuevoDocente);
  expect(resultado).toBe("D3");
});

test("Crear docente - no funciona", async () => {
  const nuevoDocente: IDocente = {
    cedula: "987654",
    nombre: "Carlos",
    apellido: "Lopez",
    especialidad: "Física",
    vinculacion: "Catedra",
  };

  docenteRepoMock.crearDocente.mockRejectedValue(new Error("Error al crear docente"));

  await expect(docenteCasoUso.crearDocente(nuevoDocente))
    .rejects
    .toThrow("Error al crear docente");

  expect(docenteRepoMock.crearDocente).toHaveBeenCalled();
  expect(docenteRepoMock.crearDocente).toHaveBeenCalledWith(nuevoDocente);
});

test("Actualizar docente - funciona", async () => {
  const docenteActualizado: IDocente = {
    id_docente: "D1",
    cedula: "123456",
    nombre: "Edwin",
    apellido: "Rivera",
    especialidad: "Matemáticas",
    vinculacion: "Tiempo completo",
  };

  docenteRepoMock.actualizarDocente.mockResolvedValue(docenteActualizado);

  const resultado = await docenteCasoUso.actualizarDocente("D1", docenteActualizado);

  expect(docenteRepoMock.actualizarDocente).toHaveBeenCalled();
  expect(docenteRepoMock.actualizarDocente).toHaveBeenCalledWith("D1", docenteActualizado);
  expect(resultado).toEqual(docenteActualizado);
});

test("Actualizar docente - no funciona", async () => {
  docenteRepoMock.actualizarDocente.mockResolvedValue(null);

  const resultado = await docenteCasoUso.actualizarDocente("D999", {
    id_docente: "D999",
    cedula: "000000",
    nombre: "Sara",
    apellido: "Jimena",
    especialidad: "Sebas",
    vinculacion: "Catedra",
  });

  expect(docenteRepoMock.actualizarDocente).toHaveBeenCalled();
  expect(docenteRepoMock.actualizarDocente).toHaveBeenCalledWith("D999", {
    id_docente: "D999",
    cedula: "000000",
    nombre: "Sara",
    apellido: "Jimena",
    especialidad: "Sebas",
    vinculacion: "Catedra",
  });

  expect(resultado).toBeNull();
});

test("Eliminar docente - funciona", async () => {
  docenteRepoMock.eliminarDocente.mockResolvedValue();

  await docenteCasoUso.eliminarDocente("D1");

  expect(docenteRepoMock.eliminarDocente).toHaveBeenCalled();
  expect(docenteRepoMock.eliminarDocente).toHaveBeenCalledWith("D1");
});

test("Eliminar docente - no funciona", async () => {
  docenteRepoMock.eliminarDocente.mockRejectedValue(new Error("Error al eliminar docente"));

  await expect(docenteCasoUso.eliminarDocente("D1"))
    .rejects
    .toThrow("Error al eliminar docente");

  expect(docenteRepoMock.eliminarDocente).toHaveBeenCalled();
  expect(docenteRepoMock.eliminarDocente).toHaveBeenCalledWith("D1");
});


});
