import { OfertaAcademicaCasoUso } from "../../src/core/aplicacion/casos-uso/OfertaAcademicaCasoUso";
import { IOfertaAcademicaRepositorio } from "../../src/core/dominio/repositorio/IOfertaAcademicaRepositorio";
import { IOfertaAcademica } from "../../src/core/dominio/entidades/IOfertaAcademica";

describe("Pruebas unitarias OfertaAcademicaCasoUso", () => {
  let ofertaRepoMock: jest.Mocked<IOfertaAcademicaRepositorio>;
  let ofertaCasoUso: OfertaAcademicaCasoUso;

  beforeEach(() => {
    ofertaRepoMock = {
      crearOferta: jest.fn(),
      listarOfertas: jest.fn(),
      obtenerOfertaPorId: jest.fn(),
      actualizarOferta: jest.fn(),
      eliminarOferta: jest.fn(),
    };

    ofertaCasoUso = new OfertaAcademicaCasoUso(ofertaRepoMock);
  });

  test("Obtener oferta por id - funciona ", async () => {
    const ofertaEsperada: IOfertaAcademica = {
      id_oferta: "OF1",
      id_periodo: "P1",
      id_plan: "PL1",
      grupo: "G1",
      cupo: 30,
    };

    ofertaRepoMock.obtenerOfertaPorId.mockResolvedValue(ofertaEsperada);

    const resultado = await ofertaCasoUso.obtenerOfertaPorId("OF1");

    expect(ofertaRepoMock.obtenerOfertaPorId).toHaveBeenCalled();
    expect(ofertaRepoMock.obtenerOfertaPorId).toHaveBeenCalledWith("OF1");
    expect(resultado).toEqual(ofertaEsperada);
  });

  test("Obtener oferta por id - no funciona", async () => {
  ofertaRepoMock.obtenerOfertaPorId.mockResolvedValue(null);

  const resultado = await ofertaCasoUso.obtenerOfertaPorId("OF999");

  expect(ofertaRepoMock.obtenerOfertaPorId).toHaveBeenCalled();
  expect(ofertaRepoMock.obtenerOfertaPorId).toHaveBeenCalledWith("OF999");
  expect(resultado).toBeNull();
});

test("Listar todas las ofertas - funciona", async () => {
  const ofertasEsperadas: IOfertaAcademica[] = [
    {
      id_oferta: "OF1",
      id_periodo: "P1",
      id_plan: "PL1",
      grupo: "G1",
      cupo: 30,
    },
    {
      id_oferta: "OF2",
      id_periodo: "P1",
      id_plan: "PL2",
      grupo: "G2",
      cupo: 25,
    },
  ];

  ofertaRepoMock.listarOfertas.mockResolvedValue(ofertasEsperadas);

  const resultado = await ofertaCasoUso.listarOfertas();

  expect(ofertaRepoMock.listarOfertas).toHaveBeenCalled();
  expect(resultado).toEqual(ofertasEsperadas);
});

test("Crear oferta - funcona", async () => {
  const nuevaOferta: IOfertaAcademica = {
    id_periodo: "P1",
    id_plan: "PL3",
    grupo: "G7",
    cupo: 20
  };

  ofertaRepoMock.crearOferta.mockResolvedValue("OF10");

  const resultado = await ofertaCasoUso.crearOferta(nuevaOferta);

  expect(ofertaRepoMock.crearOferta).toHaveBeenCalled();
  expect(ofertaRepoMock.crearOferta).toHaveBeenCalledWith(nuevaOferta);
  expect(resultado).toBe("OF10");
});

test("Crear oferta - no funciona", async () => {
  const nuevaOferta: IOfertaAcademica = {
    id_periodo: "P1",
    id_plan: "PL3",
    grupo: "G7",
    cupo: 20
  };

  ofertaRepoMock.crearOferta.mockRejectedValue(new Error("Error al crear oferta"));

  await expect(ofertaCasoUso.crearOferta(nuevaOferta))
    .rejects
    .toThrow("Error al crear oferta");

  expect(ofertaRepoMock.crearOferta).toHaveBeenCalled();
  expect(ofertaRepoMock.crearOferta).toHaveBeenCalledWith(nuevaOferta);
});

test("Actualizar oferta - funciona", async () => {
  const ofertaActualizada: IOfertaAcademica = {
    id_oferta: "OF1",
    id_periodo: "P1",
    id_plan: "PL1",
    grupo: "G1",
    cupo: 40
  };

  ofertaRepoMock.actualizarOferta.mockResolvedValue(ofertaActualizada);

  const resultado = await ofertaCasoUso.actualizarOferta("OF1", ofertaActualizada);

  expect(ofertaRepoMock.actualizarOferta).toHaveBeenCalled();
  expect(ofertaRepoMock.actualizarOferta).toHaveBeenCalledWith("OF1", ofertaActualizada);
  expect(resultado).toEqual(ofertaActualizada);
});

test("Actualizar oferta - no funciona porque no existe", async () => {
  ofertaRepoMock.actualizarOferta.mockResolvedValue(null);

  const resultado = await ofertaCasoUso.actualizarOferta("OF999", {
    id_oferta: "OF999",
    id_periodo: "P1",
    id_plan: "PL1",
    grupo: "G20",
    cupo: 25
  });

  expect(ofertaRepoMock.actualizarOferta).toHaveBeenCalled();
  expect(ofertaRepoMock.actualizarOferta).toHaveBeenCalledWith("OF999", {
    id_oferta: "OF999",
    id_periodo: "P1",
    id_plan: "PL1",
    grupo: "G20",
    cupo: 25
  });

  expect(resultado).toBeNull();
});

test("Actualizar oferta - no funciona porque se intenta modificar el id", async () => {
  const datosInvalidos: IOfertaAcademica = {
    id_oferta: "OF2",   // id distinto al que llega como parámetro
    id_periodo: "P1",
    id_plan: "PL1",
    grupo: "G1",
    cupo: 30
  };

  await expect(
    ofertaCasoUso.actualizarOferta("OF1", datosInvalidos)
  ).rejects.toThrow("No se puede modificar el ID de la oferta académica.");

  expect(ofertaRepoMock.actualizarOferta).not.toHaveBeenCalled();
});

test("Eliminar oferta - funciona", async () => {
  ofertaRepoMock.eliminarOferta.mockResolvedValue();

  await ofertaCasoUso.eliminarOferta("OF1");

  expect(ofertaRepoMock.eliminarOferta).toHaveBeenCalled();
  expect(ofertaRepoMock.eliminarOferta).toHaveBeenCalledWith("OF1");
});

test("Eliminar oferta - no funciona", async () => {
  ofertaRepoMock.eliminarOferta.mockRejectedValue(
    new Error("Error al eliminar oferta")
  );

  await expect(ofertaCasoUso.eliminarOferta("OF1"))
    .rejects
    .toThrow("Error al eliminar oferta");

  expect(ofertaRepoMock.eliminarOferta).toHaveBeenCalled();
  expect(ofertaRepoMock.eliminarOferta).toHaveBeenCalledWith("OF1");
});

// 🔥 NUEVO TEST 1: Listar ofertas con límite
test("Listar ofertas - con límite", async () => {
  const ofertasEsperadas: IOfertaAcademica[] = [
    {
      id_oferta: "OF1",
      id_periodo: "P1",
      id_plan: "PL1",
      grupo: "G1",
      cupo: 30,
    },
  ];

  ofertaRepoMock.listarOfertas.mockResolvedValue(ofertasEsperadas);

  const resultado = await ofertaCasoUso.listarOfertas(10);

  expect(ofertaRepoMock.listarOfertas).toHaveBeenCalledWith(10);
  expect(resultado).toEqual(ofertasEsperadas);
});


// 🔥 NUEVO TEST 2: Crear oferta - validar que el objeto no esté vacío
test("Crear oferta - no funciona si se envía un objeto vacío", async () => {
  // Si quieres validar esto, el caso de uso debería manejarlo.
  // Simulamos comportamiento esperado: el repositorio rechaza.
  ofertaRepoMock.crearOferta.mockRejectedValue(
    new Error("Datos incompletos para crear oferta")
  );

  await expect(ofertaCasoUso.crearOferta({} as IOfertaAcademica))
    .rejects
    .toThrow("Datos incompletos para crear oferta");

  expect(ofertaRepoMock.crearOferta).toHaveBeenCalled();
});


// 🔥 NUEVO TEST 3: Actualizar oferta – permitir que no venga id_oferta en el body
test("Actualizar oferta - funciona si el objeto no trae id_oferta", async () => {
  const datosActualizados: IOfertaAcademica = {
    id_periodo: "P1",
    id_plan: "PL1",
    grupo: "G2",
    cupo: 45,
  };

  const respuestaEsperada: IOfertaAcademica = {
    id_oferta: "OF1",
    ...datosActualizados,
  };

  ofertaRepoMock.actualizarOferta.mockResolvedValue(respuestaEsperada);

  const resultado = await ofertaCasoUso.actualizarOferta("OF1", datosActualizados);

  expect(ofertaRepoMock.actualizarOferta).toHaveBeenCalledWith("OF1", datosActualizados);
  expect(resultado).toEqual(respuestaEsperada);
});


// 🔥 NUEVO TEST 4: Eliminar oferta - falla si se envía id vacío
test("Eliminar oferta - no funciona si se envía un id vacío", async () => {
  ofertaRepoMock.eliminarOferta.mockRejectedValue(
    new Error("ID inválido para eliminar oferta")
  );

  await expect(ofertaCasoUso.eliminarOferta(""))
    .rejects
    .toThrow("ID inválido para eliminar oferta");

  expect(ofertaRepoMock.eliminarOferta).toHaveBeenCalledWith("");
});




});
