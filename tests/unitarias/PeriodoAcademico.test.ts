import { PeriodoAcademicoCasoUso } from "../../src/core/aplicacion/casos-uso/PeriodoAcademicoCasoUso";
import { IPeriodoAcademicoRepositorio } from "../../src/core/dominio/repositorio/IPeriodoAcademico";
import { IPeriodoAcademico } from "../../src/core/dominio/entidades/IPeriodoAcademico";

describe("Pruebas unitarias de PeriodoAcademicoCasoUso", () => {
    let periodoRepoMock: jest.Mocked<IPeriodoAcademicoRepositorio>;
    let periodoCasoUso: PeriodoAcademicoCasoUso;

    beforeEach(() => {
        periodoRepoMock = {
            crearPeriodo: jest.fn(),
            listarPeriodos: jest.fn(),
            obtenerPeriodoPorId: jest.fn(),
            actualizarPeriodo: jest.fn(),
            eliminarPeriodo: jest.fn(),
        };
        periodoCasoUso = new PeriodoAcademicoCasoUso(periodoRepoMock);
    });

    test("Crear Periodo Académico", async () => {
        const nuevoPeriodo: IPeriodoAcademico = {
            fecha_inicio: new Date("2024-01-01"),
            fecha_fin: new Date("2024-06-30"),
            estado: "activo",
            descripcion: "Primer semestre 2024",
        };
        periodoRepoMock.crearPeriodo.mockResolvedValue("123");

        const resultado = await periodoCasoUso.crearPeriodo(nuevoPeriodo);

        expect(periodoRepoMock.crearPeriodo).toHaveBeenCalledWith(nuevoPeriodo);
        expect(resultado).toBe("123");
    });

    test("Obtener lista de Periodos Académicos", async () => {
        const periodos: IPeriodoAcademico[] = [
            {
                id_periodo: "1",
                fecha_inicio: new Date("2024-01-01"),
                fecha_fin: new Date("2024-06-30"),
                estado: "activo",
                descripcion: "Primer semestre 2024",
            },
            {
                id_periodo: "2",
                fecha_inicio: new Date("2024-07-01"),
                fecha_fin: new Date("2024-12-31"),
                estado: "cerrado",
                descripcion: "Segundo semestre 2024",
            },
        ];
        periodoRepoMock.listarPeriodos.mockResolvedValue(periodos);

        const resultado = await periodoCasoUso.obtenerPeriodos();

        expect(periodoRepoMock.listarPeriodos).toHaveBeenCalled();
        expect(resultado).toEqual(periodos);
    });

    test("Obtener Periodo Académico por ID", async () => {
        const periodoEsperado: IPeriodoAcademico =
        {
            id_periodo: "1",
            fecha_inicio: new Date(),
            fecha_fin: new Date(),
            estado: "activo",
            descripcion: "Primer semestre 2024",
        };

        periodoRepoMock.obtenerPeriodoPorId.mockResolvedValue(periodoEsperado);

        const resultado = await periodoCasoUso.obtenerPeriodoPorId("1");

        expect(periodoRepoMock.obtenerPeriodoPorId).toHaveBeenCalledWith("1");
        expect(resultado).toEqual(periodoEsperado);
    });

    test("Actualizar Periodo Académico - error si intenta modificar el id", async () => {
        const datosActualizados: IPeriodoAcademico = {
            id_periodo: "3",
            fecha_inicio: new Date(),
            fecha_fin: new Date(),
            estado: "activo",
            descripcion: "Periodo actualizado",
        };
        await expect(
            periodoCasoUso.actualizarPeriodo("1", datosActualizados)
        ).rejects.toThrow("No se permite modificar el ID del periodo académico.");
    });
    test("Actualizar Periodo - devuelve null si el repositorio no encuentra el periodo", async () => {
        periodoRepoMock.actualizarPeriodo.mockResolvedValue(null);

        const resultado = await periodoCasoUso.actualizarPeriodo("1", {
            fecha_inicio: new Date(),
            fecha_fin: new Date(),
            estado: "activo",
            descripcion: "Periodo X",
        });

        expect(periodoRepoMock.actualizarPeriodo).toHaveBeenCalledWith(
            "1",
            expect.any(Object)
        );
        expect(resultado).toBeNull();
    });


    test("Actualizar Periodo acdémico correctamente", async () => {
        const datosActualizados: IPeriodoAcademico = {
            fecha_inicio: new Date(),
            fecha_fin: new Date(),
            estado: "activo",
            descripcion: "Periodo actualizado",
        };
        const periodoActualizado: IPeriodoAcademico = {
            id_periodo: "1",
            ...datosActualizados,
        };
        periodoRepoMock.actualizarPeriodo.mockResolvedValue(periodoActualizado);

        const resultado = await periodoCasoUso.actualizarPeriodo("1", datosActualizados);

        expect(periodoRepoMock.actualizarPeriodo).toHaveBeenCalledWith("1", datosActualizados);
        expect(resultado).toEqual(periodoActualizado);
    });

    test("Eliminar Periodo Académico", async () => {
        periodoRepoMock.eliminarPeriodo.mockResolvedValue();
        await periodoCasoUso.eliminarPeriodo("1");

        expect(periodoRepoMock.eliminarPeriodo).toHaveBeenCalledWith("1");
    });
});