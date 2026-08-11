import { IPlanEstudioRepositorio } from "../../src/core/dominio/repositorio/IPlanEstudioRepositorio";
import { PlanEstudioCasosUso } from "../../src/core/aplicacion/casos-uso/PlanEstudioCasoUso";
import { PlanEstudioDTO } from "../../src/presentation/esquemas/PlanDeEstudioEsquema";
import { PlanEstudio } from "../../src/core/dominio/entidades/PlanEstudio";

describe("Pruebas unitarias de PlanEstudioCasoUso", () => {
    let planEstudioRepoMock: jest.Mocked<IPlanEstudioRepositorio>;
    let planEstudioCasosUso: PlanEstudioCasosUso;

    beforeEach(() => {
        planEstudioRepoMock = {
            obtenerTodos: jest.fn(),
            obtenerPorId: jest.fn(),
            crear: jest.fn(),
            eliminar: jest.fn(),
            actualizar: jest.fn(),
        };
        planEstudioCasosUso = new PlanEstudioCasosUso(planEstudioRepoMock);
    });

    test("Obtener todos los planes de estudio", async () => {
        const planes: PlanEstudio[] = [
            new PlanEstudio("1", "A1", "PA1", 1),
            new PlanEstudio("2", "A2", "PA1", 2),
        ];
        planEstudioRepoMock.obtenerTodos.mockResolvedValue(planes);

        const resultado = await planEstudioCasosUso.obtenerTodos();

        expect(planEstudioRepoMock.obtenerTodos).toHaveBeenCalled();
        expect(resultado).toEqual(planes);
    });

    test("obtener plan de estudio por ID", async () => {
        const planBuscado = new PlanEstudio("1", "A1", "PA1", 1);
        planEstudioRepoMock.obtenerPorId.mockResolvedValue(planBuscado);

        const resultado = await planEstudioCasosUso.obtenerPorId("1");

        expect(planEstudioRepoMock.obtenerPorId).toHaveBeenCalledWith("1");
        expect(resultado).toEqual(planBuscado);
    });

    test("Crear un nuevo plan de estudio", async () => {
        const nuevoPlanDTO: PlanEstudioDTO = {
            id_programa: "P1",
            id_asignatura: "A1",
            semestre: 3,
        };

        planEstudioRepoMock.crear.mockResolvedValue("123");

        const resultado = await planEstudioCasosUso.crear(nuevoPlanDTO);

        expect(planEstudioRepoMock.crear).toHaveBeenCalled();
        expect(planEstudioRepoMock.crear.mock.calls[0]![0]).toBeInstanceOf(PlanEstudio);
        expect(resultado).toBe("123");
    });

    test("Actualizar un plan de estudio", async () => {
        const planActualizado: PlanEstudioDTO = {
            id_programa: "PA2",
            id_asignatura: "A2",
            semestre: 4,
        };
        planEstudioRepoMock.actualizar.mockResolvedValue();

        const resultado = await planEstudioCasosUso.actualizar(planActualizado, "1");

        expect(planEstudioRepoMock.actualizar).toHaveBeenCalled();
        const PlanConstruido = planEstudioRepoMock.actualizar.mock.calls[0]![0];

        expect(PlanConstruido).toBeInstanceOf(PlanEstudio);
        expect(PlanConstruido.id_plan).toBe("1");
        expect(PlanConstruido.id_programa).toBe("PA2");
        expect(PlanConstruido.id_asignatura).toBe("A2");
        expect(PlanConstruido.semestre).toBe(4);

        expect(resultado).toEqual(planActualizado)
    });

    test("Eliminar un plan de estudio", async () => {
        planEstudioRepoMock.eliminar.mockResolvedValue();

        await planEstudioCasosUso.eliminar("1");

        expect(planEstudioRepoMock.eliminar).toHaveBeenCalledWith("1");
    });

});




