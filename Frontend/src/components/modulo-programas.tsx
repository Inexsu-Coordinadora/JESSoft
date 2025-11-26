import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Search, GraduationCap, Plus, Edit, Trash2 } from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FileSpreadsheet } from "lucide-react";

export function ModuloProgramas() {
  const [programas, setProgramas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarProgramas = async () => {
    try {
      const res = await fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/programas");
      const data = await res.json();

      setProgramas(
        data.programas.map((p: any) => ({
          codigo: p.id_programa,
          nombre: p.nombre,
          informacion: p.informacion,
          nivel_educativo: p.nivel_educativo,
          duracion: p.duracion,
          modalidad: p.modalidad,
        }))
      );
    } catch (error) {
      console.error("Error cargando programas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProgramas();
  }, []);

  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [nivelSeleccionado, setNivelSeleccionado] = useState("todos");
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [programaEditando, setProgramaEditando] = useState<any>(null);

  const [formulario, setFormulario] = useState({
    codigo: "",
    nombre: "",
    nivel_educativo: "",
    duracion: "",
    modalidad: "",
    informacion: "",
  });

  const programasFiltrados = programas.filter((programa) => {
    const coincideBusqueda =
      programa.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      programa.codigo.toLowerCase().includes(terminoBusqueda.toLowerCase());

    const coincideNivel =
      nivelSeleccionado === "todos" ||
      programa.nivel_educativo === nivelSeleccionado;

    return coincideBusqueda && coincideNivel;
  });

  const abrirDialogoNuevo = () => {
    setProgramaEditando(null);

    setFormulario({
      codigo: "",
      nombre: "",
      nivel_educativo: "",
      duracion: "",
      modalidad: "",
      informacion: "",
    });

    setDialogoAbierto(true);
  };

  const abrirDialogoEditar = (programa: any) => {
    setProgramaEditando(programa);

    setFormulario({
      codigo: programa.codigo, 
      nombre: programa.nombre,
      informacion: programa.informacion,
      nivel_educativo: programa.nivel_educativo,
      duracion: programa.duracion.toString(),
      modalidad: programa.modalidad,
    });

    setDialogoAbierto(true);
  };

  const guardarPrograma = async () => {
    if (!formulario.nombre || !formulario.nivel_educativo || !formulario.duracion || !formulario.informacion || !formulario.modalidad) {
      alert("Completa los campos obligatorios");
      return;
    }

    if (programaEditando) {
      try {
        const res = await fetch(
          `https://app-gestionacademica-627042166405.europe-west1.run.app/api/programas/${formulario.codigo}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: formulario.nombre,
              informacion: formulario.informacion,
              nivel_educativo: formulario.nivel_educativo,
              duracion: formulario.duracion,
              modalidad: formulario.modalidad,
            }),
          }
        );

        if (!res.ok) {
          const data = await res.json();
          alert(data.error || data.mensaje || "Error al actualizar programa");
          return;
        }


        await cargarProgramas();
        setDialogoAbierto(false);
      } catch (err) {
        console.error(err);
      }

      return;
    }

    try {
      const res = await fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/programas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formulario.nombre,
          informacion: formulario.informacion,
          nivel_educativo: formulario.nivel_educativo,
          duracion: formulario.duracion,
          modalidad: formulario.modalidad,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || data.mensaje || "Error al crear programa");
        return;
      }


      await cargarProgramas();
      setDialogoAbierto(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const eliminarPrograma = async (codigo: string) => {
    if (!confirm("¿Seguro que desea eliminar?")) return;

    try {
      const res = await fetch(`https://app-gestionacademica-627042166405.europe-west1.run.app/api/programas/${codigo}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || data.mensaje || "Error al eliminar");
        return;
      }


      await cargarProgramas();

    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };
  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Programas");


    sheet.mergeCells("A1:F1");
    const titulo = sheet.getCell("A1");
    titulo.value = "Reporte de Programas Académicos";
    titulo.font = { size: 16, bold: true };
    titulo.alignment = { horizontal: "center" };

    const headers = [
      "Código",
      "Nombre",
      "Nivel Educativo",
      "Duración",
      "Modalidad",
      "Información"
    ];

    const headerRow = sheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    programasFiltrados.forEach((p) => {
      sheet.addRow([
        p.codigo,
        p.nombre,
        p.nivel_educativo,
        p.duracion,
        p.modalidad,
        p.informacion
      ]);
    });

    sheet.columns.forEach((col) => (col.width = 25));

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Programas.xlsx");
  };


  if (loading) return <p className="text-center py-10 text-gray-500 font-semibold">Cargando Programas...</p>;

  //INTERFAZ

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Programas Académicos</h1>
          <p className="text-muted-foreground">
            Gestiona los programas registrados en la base de datos
          </p>
        </div>

        <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
          <DialogTrigger asChild>
            <Button onClick={abrirDialogoNuevo}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Programa
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {programaEditando ? "Editar Programa" : "Crear Nuevo Programa"}
              </DialogTitle>
              <DialogDescription>
                Ingresa la información del programa académico
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">

              {/* ========== CAMPO CÓDIGO SOLO AL EDITAR ========== */}
              {programaEditando && (
                <div className="space-y-2">
                  <Label>Código</Label>
                  <Input value={formulario.codigo} disabled />
                </div>
              )}

              {/* Nivel Educativo */}
              <div className="space-y-2">
                <Label htmlFor="nivel">Nivel Educativo *</Label>
                <Select
                  value={formulario.nivel_educativo}
                  onValueChange={(v) =>
                    setFormulario({ ...formulario, nivel_educativo: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tecnico">Tecnico</SelectItem>
                    <SelectItem value="Tecnologico">Tecnologico</SelectItem>
                    <SelectItem value="Profesional">Profesional</SelectItem>
                    <SelectItem value="Posgrado">Posgrado</SelectItem>
                    <SelectItem value="Maestria">Maestria</SelectItem>
                    <SelectItem value="Doctorado">Doctorado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formulario.nombre}
                  onChange={(e) =>
                    setFormulario({ ...formulario, nombre: e.target.value })
                  }
                  placeholder="Nombre"
                />
              </div>

              {/* Duración y Modalidad */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duración</Label>
                  <Input
                    value={formulario.duracion}
                    onChange={(e) =>
                      setFormulario({ ...formulario, duracion: e.target.value })
                    }
                    placeholder="# semestres"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Modalidad</Label>
                  <Select
                    value={formulario.modalidad}
                    onValueChange={(v) =>
                      setFormulario({ ...formulario, modalidad: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar modalidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Presencial">Presencial</SelectItem>
                      <SelectItem value="Virtual">Virtual</SelectItem>
                      <SelectItem value="Distancia">Distancia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Información */}
              <div className="space-y-2">
                <Label>Información</Label>
                <Textarea
                  value={formulario.informacion}
                  onChange={(e) =>
                    setFormulario({ ...formulario, informacion: e.target.value })
                  }
                  placeholder="Breve descripción..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogoAbierto(false)}>
                Cancelar
              </Button>
              <Button onClick={guardarPrograma}>
                {programaEditando ? "Guardar Cambios" : "Crear Programa"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ================================
          TARJETAS
      ================================ */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Programas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programas.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Presencial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {programas.filter((x) => x.modalidad === "Presencial").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Virtual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {programas.filter((x) => x.modalidad === "Virtual").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Distancia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {programas.filter((x) => x.modalidad === "Distancia").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
          <CardDescription>Encuentra programas específicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código o nombre..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={nivelSeleccionado} onValueChange={setNivelSeleccionado}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Tecnico">Tecnico</SelectItem>
                <SelectItem value="Tecnologico">Tecnologico</SelectItem>
                <SelectItem value="Profesional">Profesional</SelectItem>
                <SelectItem value="Posgrado">Posgrado</SelectItem>
                <SelectItem value="Maestria">Maestria</SelectItem>
                <SelectItem value="Doctorado">Doctorado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lista de Programas</CardTitle>
            <CardDescription>Total: {programasFiltrados.length}</CardDescription>
          </div> 
          <Button variant="outline" onClick={exportarExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> 
            Exportar Excel
          </Button>  
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Programa</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Modalidad</TableHead>
                <TableHead>Información</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {programasFiltrados.map((programa) => (
                <TableRow key={programa.codigo}>
                  <TableCell className="font-mono text-sm">
                    {programa.codigo}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-indigo-600" />
                      <span className="font-medium">{programa.nombre}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">{programa.nivel_educativo}</Badge>
                  </TableCell>

                  <TableCell>{programa.duracion}</TableCell>

                  <TableCell>{programa.modalidad}</TableCell>

                  <TableCell className="max-w-[200px] truncate">
                    {programa.informacion}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => abrirDialogoEditar(programa)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => eliminarPrograma(programa.codigo)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
