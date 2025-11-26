import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { GraduationCap, BookOpen, Users, Calendar } from "lucide-react";

export function PanelPrincipal() {
  const [loading, setLoading] = useState(true); 

  const [estadisticas, setEstadisticas] = useState([
    { titulo: "Programas Activos", valor: "0", icono: GraduationCap },
    { titulo: "Asignaturas Registradas", valor: "0", icono: BookOpen },
    { titulo: "Docentes", valor: "0", icono: Users },
    { titulo: "Periodos Académicos", valor: "0", icono: Calendar },
  ]);

  const [asignaturasDestacadas, setAsignaturasDestacadas] = useState([]);
  const [programasRecientes, setProgramasRecientes] = useState([]);

  useEffect(() => {
    async function cargar() {
      try {
        const [docRes, perRes, progRes, asiRes] = await Promise.all([
          fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/docentes"),
          fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/periodos"),
          fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/programas"),
          fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/asignaturas"),
        ]);

        const docentes = await docRes.json();
        const periodos = await perRes.json();
        const programas = await progRes.json();
        const asignaturas = await asiRes.json();

        setEstadisticas([
          {
            titulo: "Programas Activos",
            valor: String(programas?.length ?? programas?.programas?.length ?? 0),
            icono: GraduationCap,
          },
          {
            titulo: "Asignaturas Registradas",
            valor: String(asignaturas?.length ?? asignaturas?.asignaturas?.length ?? 0),
            icono: BookOpen,
          },
          {
            titulo: "Docentes",
            valor: String(docentes?.length ?? docentes?.docentes?.length ?? 0),
            icono: Users,
          },
          {
            titulo: "Periodos Académicos",
            valor: String(periodos?.length ?? periodos?.periodos?.length ?? 0),
            icono: Calendar,
          },
        ]);

        // Últimos programas 
        const listaProgramas = programas?.programas ?? programas;
        setProgramasRecientes(listaProgramas.slice(-4).reverse());

        // Últimas asignaturas
        const listaAsignaturas = asignaturas?.asignaturas ?? asignaturas;
        setAsignaturasDestacadas(listaAsignaturas.slice(-4).reverse());


      } catch (error) {
        console.error("Error cargando datos", error);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 font-semibold">Cargando...</div>
    );
  }
//INTERFAZ
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {estadisticas.map((estadistica) => (
          <Card key={estadistica.titulo}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{estadistica.titulo}</CardTitle>
              <estadistica.icono className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadistica.valor}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">

        {/* PROGRAMAS DESDE BACKEND */}
        <Card>
          <CardHeader>
            <CardTitle>Programas Académicos</CardTitle>
            <CardDescription>Últimos Programas Académicos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {programasRecientes.map((programa) => (
                <div key={programa.id_programa ?? programa.id} className="flex items-center justify-between space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{programa.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {(programa.codigo ?? programa.id_programa)} - {programa.nivel_educativo ?? "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ASIGNATURAS DESDE BACKEND */}
        <Card>
          <CardHeader>
            <CardTitle>Asignaturas</CardTitle>
            <CardDescription>Últimas Asignaturas Registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {asignaturasDestacadas.map((asignatura) => (
                <div key={asignatura.id_asignatura ?? asignatura.id} className="flex items-center justify-between space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{asignatura.nombre}</p>
                    <p className="text-xs text-muted-foreground">{asignatura.id_asignatura ?? asignatura.id}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{asignatura.tipo ?? "N/A"}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">{asignatura.creditos ?? "?"} créditos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
