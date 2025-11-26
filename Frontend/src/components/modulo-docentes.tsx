import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Search, Users, Plus, Edit, Trash2 } from "lucide-react";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FileSpreadsheet } from "lucide-react";

export function ModuloDocentes() {

  const [docentes, setDocentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [filtroVinculacion, setFiltroVinculacion] = useState("todos");
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [docenteEditando, setDocenteEditando] = useState<any>(null);

  const [formulario, setFormulario] = useState({
    id_docente: "",
    cedula: "",
    nombre: "",
    apellido: "",
    especialidad: "",
    vinculacion: ""
  });

  const vinculaciones = ["Tiempo completo", "Catedra", "Medio tiempo"];

  const cargarDocentes = async () => {
    try {
      const res = await fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/docentes");
      const data = await res.json();

      if (!res.ok) {
        alert(data.mensaje || "Error al cargar docentes");
        return;
      }
            
      setDocentes(
        (data.docentes || []).map((d: any) => ({
          id: d.id_docente,
          cedula: d.cedula,
          nombre: d.nombre,
          apellido: d.apellido,
          especialidad: d.especialidad,
          vinculacion: d.vinculacion,
        }))
      );
    } catch (e) {
      console.log("Error cargando docentes:", e);
      alert("No se pudo cargar los docentes");
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDocentes();
  }, []);


  const docentesFiltrados = docentes.filter((d) => {
    const texto =
      (d.id + " " + d.cedula + " " + d.nombre + " " + d.apellido).toLowerCase();

    const coincideBusqueda = texto.includes(terminoBusqueda.toLowerCase());
    const coincideVinc = filtroVinculacion === "todos" || d.vinculacion === filtroVinculacion;

    return coincideBusqueda && coincideVinc;
  });


  const abrirDialogoNuevo = () => {
    setDocenteEditando(null);

    setFormulario({
      id_docente: "",
      cedula: "",
      nombre: "",
      apellido: "",
      especialidad: "",
      vinculacion: ""
    });

    setDialogoAbierto(true);
  };

  const abrirDialogoEditar = (docente: any) => {
    setDocenteEditando(docente);

    setFormulario({
      id_docente: docente.id,
      cedula: docente.cedula,
      nombre: docente.nombre,
      apellido: docente.apellido,
      especialidad: docente.especialidad,
      vinculacion: docente.vinculacion
    });

    setDialogoAbierto(true);
  };

  const guardarDocente = async () => {
    if (!formulario.cedula || !formulario.nombre || !formulario.apellido || !formulario.vinculacion) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    const cedulaExiste = docentes.some(
      (d) => d.cedula === formulario.cedula && d.id !== formulario.id_docente
    );
    if (cedulaExiste) {
      alert("La cédula ya está registrada");
      return;
    }

    if (docenteEditando) {
      const res = await fetch(`https://app-gestionacademica-627042166405.europe-west1.run.app/api/docentes/${formulario.id_docente}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cedula: formulario.cedula,
          nombre: formulario.nombre,
          apellido: formulario.apellido,
          especialidad: formulario.especialidad,
          vinculacion: formulario.vinculacion
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.mensaje || "Error actualizando docente");
        return;
      }


      await cargarDocentes();
      setDialogoAbierto(false);
      return;
    }

  const res = await fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/docentes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cedula: formulario.cedula,
      nombre: formulario.nombre,
      apellido: formulario.apellido,
      especialidad: formulario.especialidad,
      vinculacion: formulario.vinculacion
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.mensaje || "Error creando docente");
    return;
  }

    await cargarDocentes();
    setDialogoAbierto(false);
  };

  const eliminarDocente = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este docente?")) return;

    const res = await fetch(`https://app-gestionacademica-627042166405.europe-west1.run.app/api/docentes/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      alert(data.mensaje || "Error eliminando docente");
      return;
    }

    await cargarDocentes();
  };

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Docentes");

    sheet.mergeCells("A1:F1");
    const titulo = sheet.getCell("A1");
    titulo.value = "Reporte de Docentes";
    titulo.font = { size: 16, bold: true };
    titulo.alignment = { horizontal: "center" };

    const headers = [
      "ID",
      "Cédula",
      "Nombre Completo",
      "Especialidad",
      "Vinculación"
    ];

    const headerRow = sheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    docentesFiltrados.forEach((d) => {
      sheet.addRow([
        d.id ?? "—",
        d.cedula ?? "—",
        `${d.nombre ?? ""} ${d.apellido ?? ""}`.trim() || "—",
        d.especialidad ?? "—",
        d.vinculacion ?? "—"
      ]);
    });

    sheet.columns.forEach((col) => (col.width = 22));

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Docentes.xlsx");
  };

  if (loading) return <div className="text-center py-10 text-gray-500 font-semibold">Cargando docentes...</div>;

  //INTERFAZ
  return (
    <div className="space-y-6">

      {/* Título */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Docentes</h1>
          <p className="text-muted-foreground">Gestión del personal académico</p>
        </div>

        <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
          <DialogTrigger asChild>
            <Button onClick={abrirDialogoNuevo}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Docente
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {docenteEditando ? "Editar Docente" : "Registrar Nuevo Docente"}
              </DialogTitle>
              <DialogDescription>
                Ingresa los datos del docente
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* ID */}
              <div className="space-y-2">
                <Label>ID</Label>
                <Input
                  readOnly
                  value={
                    docenteEditando
                      ? formulario.id_docente
                      : "Código Autogenerado"
                  }
                  disabled
                />
              </div>

              {/* Cedula + Vinculación */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cédula *</Label>
                  <Input
                    value={formulario.cedula}
                    onChange={(e) =>
                      setFormulario({ ...formulario, cedula: e.target.value })
                    }
                    placeholder="Cédula"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Vinculación *</Label>
                  <Select
                    value={formulario.vinculacion}
                    onValueChange={(v) =>
                      setFormulario({ ...formulario, vinculacion: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {vinculaciones.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Nombre + Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre *</Label>
                  <Input
                    value={formulario.nombre}
                    onChange={(e) =>
                      setFormulario({ ...formulario, nombre: e.target.value })
                    }
                    placeholder="Nombre"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Apellido *</Label>
                  <Input
                    value={formulario.apellido}
                    onChange={(e) =>
                      setFormulario({ ...formulario, apellido: e.target.value })
                    }
                    placeholder="Apellido"
                  />
                </div>
              </div>

              {/* Especialidad */}
              <div className="space-y-2">
                <Label>Especialidad</Label>
                <Input
                  value={formulario.especialidad}
                  onChange={(e) =>
                    setFormulario({ ...formulario, especialidad: e.target.value })
                  }
                  placeholder="Especialidad"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogoAbierto(false)}>
                Cancelar
              </Button>
              <Button onClick={guardarDocente}>
                {docenteEditando ? "Guardar Cambios" : "Registrar Docente"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Docentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{docentes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Tiempo Completo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {docentes.filter((d) => d.vinculacion === "Tiempo completo").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Medio Tiempo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {docentes.filter((d) => d.vinculacion === "Medio tiempo").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Cátedra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {docentes.filter((d) => d.vinculacion === "Catedra").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
          <CardDescription>Encuentra docentes específicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por id, nombre, apellido o cédula..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="w-48">
              <Select value={filtroVinculacion} onValueChange={setFiltroVinculacion}>
                <SelectTrigger><SelectValue placeholder="Vinculación" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  {vinculaciones.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Lista de Docentes</CardTitle>
          <CardDescription>Total: {docentesFiltrados.length}</CardDescription>
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
                <TableHead>ID</TableHead>
                <TableHead>Cédula</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Vinculación</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {docentesFiltrados.map((docente) => (
                <TableRow key={docente.id}>
                  <TableCell className="font-mono">{docente.id}</TableCell>
                  <TableCell className="font-mono">{docente.cedula}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-indigo-600" />
                      <div>
                        <div className="font-medium">
                          {docente.nombre} {docente.apellido}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{docente.especialidad}</TableCell>

                  <TableCell>
                    <Badge variant="outline">{docente.vinculacion}</Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => abrirDialogoEditar(docente)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => eliminarDocente(docente.id)}
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
