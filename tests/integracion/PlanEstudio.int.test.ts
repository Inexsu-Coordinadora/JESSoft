import request from "supertest";
import { app } from "../../src/presentation/app";

jest.mock("../../src/core/infraestructura/postgres/PlanEstudioRepositorio", () => {
    return {
        PlanEstudioRepositorio: jest.fn().mockImplementation(() => (
            {
                obtenerTodos: jest.fn().mockResolvedValue([
                    {
                        id_plan: "mock1",
                        id_asignatura: "A1",
                        id_programa: "P1",
                        semestre: 3,
                    },
                    {
                        id_plan: "mock2",
                        id_asignatura: "A2",
                        id_programa: "P1",
                        semestre: 5,
                    },

                ]),

                obtenerPorId: jest.fn().mockImplementation(async (id: string) =>
                    id === "mock1"
                        ? {
                            id_plan: "mock1",
                            id_asignatura: "A1",
                            id_programa: "P1",
                            semestre: 3,
                        }
                        : null
                ),

                crear: jest.fn().mockResolvedValue("mock-created-id"),

                actualizar: jest.fn().mockResolvedValue(undefined),

                eliminar: jest.fn().mockResolvedValue(undefined),

            })),
    };
});

describe("Pruebas de integración de PlanEstudio", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    test("GET /api/planes-estudio - Mostrar todos los planes", async () => {
        const res = await request(app.server).get("/api/planes-estudio");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            {
                id_plan: "mock1",
                id_asignatura: "A1",
                id_programa: "P1",
                semestre: 3,
            },
            {
                id_plan: "mock2",
                id_asignatura: "A2",
                id_programa: "P1",
                semestre: 5,
            },
        ]);
    });

    test("POST /api/planes-estudio - Crear un plan de estudio", async () => {
        const payload = {
            id_asignatura: "A1",
            id_programa: "P1",
            semestre: 4,
        };

        const res = await request(app.server)
            .post("/api/planes-estudio")
            .send(payload);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            mensaje: "Plan de estudio creado correctamente",
            id: "mock-created-id",
        });
    });

    test("PUT /api/planes-estudio/:id - Actualizar un plan", async () => {
        const payload = {
            id_asignatura: "A9",
            id_programa: "P2",
            semestre: 2,
        };

        const res = await request(app.server)
            .put("/api/planes-estudio/mock1")
            .send(payload);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            mensaje: "Plan de estudio actualizado correctamente",
            planEstudioActualizado: {
                id_asignatura: "A9",
                id_programa: "P2",
                semestre: 2,
            },
        });
    });

    test("DELETE /api/planes-estudio/:id -  Eliminar un plan", async () => {
        const res = await request(app.server)
            .delete("/api/planes-estudio/mock1");

        expect(res.status).toBe(204);
        expect(res.body).toEqual({});
    });
});


