import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  BookOpen,
  GraduationCap,
  Calendar,
  Users,
  FileText,
  ClipboardList,
  UserCheck,
  Menu,
  X
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { PanelPrincipal } from "./components/panel-principal";
import { ModuloProgramas } from "./components/modulo-programas";
import { ModuloAsignaturas } from "./components/modulo-asignaturas";
import { ModuloPeriodos } from "./components/modulo-periodos";
import { ModuloDocentes } from "./components/modulo-docentes";
import { ModuloPlanEstudio } from "./components/modulo-plan-estudio";
import { ModuloOfertaAcademica } from "./components/modulo-oferta-academica";
import { ModuloAsignacionDocente } from "./components/modulo-asignacion-docente";

type ModuloActivo =
  | "panel"
  | "programas"
  | "asignaturas"
  | "periodos"
  | "docentes"
  | "plan-estudio"
  | "oferta-academica"
  | "asignacion-docente";

export default function App() {
  const [moduloActivo, setModuloActivo] = useState<ModuloActivo>("panel");
  const [menuLateralAbierto, setMenuLateralAbierto] = useState(false);

  // RESUMEN LATERAL (Backend)
  const [resumen, setResumen] = useState({
    programas: 0,
    docentes: 0,
    periodo: "N/A"
  });
  const [loadingResumen, setLoadingResumen] = useState(true);

  // 🔥 RECARGA RESUMEN CADA VEZ QUE SE CAMBIA DE MÓDULO
  useEffect(() => {
    async function cargarResumen() {
      setLoadingResumen(true);
      try {
        const [progRes, docRes, perRes] = await Promise.all([
          fetch("http://localhost:3000/api/programas"),
          fetch("http://localhost:3000/api/docentes"),
          fetch("http://localhost:3000/api/periodos")
        ]);

        const programas = await progRes.json();
        const docentes = await docRes.json();
        const periodos = await perRes.json();

        setResumen({
          programas: programas?.programas?.length ?? programas?.length ?? 0,
          docentes: docentes?.docentes?.length ?? docentes?.length ?? 0,
          periodo:
            periodos?.periodos?.length > 0
              ? periodos.periodos[periodos.periodos.length - 1].descripcion.replace("Periodo ", "")
              : "N/A"


        });
      } catch (e) {
        console.error("Error cargando resumen:", e);
      } finally {
        setLoadingResumen(false);
      }
    }

    cargarResumen();
  }, [moduloActivo]); // 👈 cuando cambie el módulo se recarga

  const elementosMenu = [
    { id: "panel", nombre: "Dashboard", icono: LayoutDashboard },
    { id: "programas", nombre: "Programas", icono: GraduationCap },
    { id: "asignaturas", nombre: "Asignaturas", icono: BookOpen },
    { id: "periodos", nombre: "Periodos", icono: Calendar },
    { id: "docentes", nombre: "Docentes", icono: Users },
    { id: "plan-estudio", nombre: "Plan de Estudio", icono: FileText },
    { id: "oferta-academica", nombre: "Oferta Académica", icono: ClipboardList },
    { id: "asignacion-docente", nombre: "Asignación Docente", icono: UserCheck },
  ];

  const renderizarModulo = () => {
    switch (moduloActivo) {
      case "panel":
        return <PanelPrincipal />;
      case "programas":
        return <ModuloProgramas />;
      case "asignaturas":
        return <ModuloAsignaturas />;
      case "periodos":
        return <ModuloPeriodos />;
      case "docentes":
        return <ModuloDocentes />;
      case "plan-estudio":
        return <ModuloPlanEstudio />;
      case "oferta-academica":
        return <ModuloOfertaAcademica />;
      case "asignacion-docente":
        return <ModuloAsignacionDocente />;
      default:
        return <PanelPrincipal />;
    }
  };

  const obtenerTituloModulo = () => {
    const elemento = elementosMenu.find(item => item.id === moduloActivo);
    return elemento ? elemento.nombre : "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Menú Lateral */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          menuLateralAbierto
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">JESSoft</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMenuLateralAbierto(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Información del Sistema */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-medium">SA</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Sistema Académico
              </p>
              <p className="text-xs text-gray-500">Gestión Universitaria</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {elementosMenu.map((elemento) => {
              const Icono = elemento.icono;
              const estaActivo = moduloActivo === elemento.id;

              return (
                <li key={elemento.id}>
                  <button
                    onClick={() => {
                      setModuloActivo(elemento.id as ModuloActivo);
                      if (window.innerWidth < 1024) {
                        setMenuLateralAbierto(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      estaActivo
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icono
                        className={`h-5 w-5 ${
                          estaActivo ? "text-indigo-600" : "text-gray-400"
                        }`}
                      />
                      <span>{elemento.nombre}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Estadísticas Rápidas */}
        <div className="absolute bottom-4 left-4 right-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Resumen General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">

              {/* Loader */}
              {loadingResumen ? (
                <p className="text-xs text-gray-500 text-center py-2">
                  Cargando...
                </p>
              ) : (
                <>
                  <div className="flex justify-between text-xs">
                    <span>Programas:</span>
                    <span className="font-medium">{resumen.programas}</span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span>Docentes:</span>
                    <span className="font-medium">{resumen.docentes}</span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span>Periodo Activo:</span>
                    <span className="font-medium text-indigo-600">
                      {resumen.periodo}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="lg:ml-64 transition-all duration-300 ease-in-out">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMenuLateralAbierto(true)}
              className="lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-semibold text-gray-900">
              {obtenerTituloModulo()}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-xs">
              {resumen.periodo}
            </Badge>
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 text-sm font-medium">SA</span>
            </div>
          </div>
        </header>

        <main className="p-6">{renderizarModulo()}</main>
      </div>

      {menuLateralAbierto && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setMenuLateralAbierto(false)}
        />
      )}
    </div>
  );
}
