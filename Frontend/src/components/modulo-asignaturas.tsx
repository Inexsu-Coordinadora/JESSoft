import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Search, BookOpen, Plus, Edit, Trash2 } from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FileSpreadsheet } from "lucide-react";

export function ModuloAsignaturas() {
  const [asignaturas, setAsignaturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarAsignaturas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/asignaturas");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setAsignaturas(
        (data.asignaturas || []).map((a: any) => ({
          codigo: a.id || a.id_asignatura || a.codigo, 
          nombre: a.nombre,
          creditos: a.creditos,
          carga_horaria: a.carga_horaria,
          tipo: a.tipo,
          descripcion: a.descripcion,
        }))
      );
    } catch (err: any) {
      console.error("Error cargando asignaturas:", err);
      setError("No se pudo cargar las asignaturas. Revisa el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAsignaturas();
  }, []);

  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState("todos");
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [asignaturaEditando, setAsignaturaEditando] = useState<any>(null);

  const [formulario, setFormulario] = useState({
    codigo: "",
    nombre: "",
    creditos: "",
    carga_horaria: "",
    tipo: "",
    descripcion: "",
  });

  const asignaturasFiltradas = asignaturas.filter((a) => {
    const nombre = (a.nombre || "").toString();
    const coincideBusqueda =
      nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      (a.codigo || "").toString().toLowerCase().includes(terminoBusqueda.toLowerCase());
    const coincideTipo =
      tipoSeleccionado === "todos" || a.tipo === tipoSeleccionado;
    return coincideBusqueda && coincideTipo;
  });

  const abrirDialogoNuevo = () => {
    setAsignaturaEditando(null);
    setFormulario({
      codigo: "",
      nombre: "",
      creditos: "",
      carga_horaria: "",
      tipo: "",
      descripcion: "",
    });
    setDialogoAbierto(true);
  };

  const abrirDialogoEditar = (asignatura: any) => {
    setAsignaturaEditando(asignatura);
    setFormulario({
      codigo: asignatura.codigo ?? "",
      nombre: asignatura.nombre ?? "",
      creditos: asignatura.creditos?.toString() ?? "",
      carga_horaria: asignatura.carga_horaria?.toString() ?? "",
      tipo: asignatura.tipo ?? "",
      descripcion: asignatura.descripcion ?? "",
    });
    setDialogoAbierto(true);
  };


  const guardarAsignatura = async () => {
    if (!formulario.nombre || !formulario.tipo) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

  const body = {
    nombre: formulario.nombre,
    creditos: Number(formulario.creditos),
    carga_horaria: Number(formulario.carga_horaria),
    tipo: formulario.tipo,
    descripcion: formulario.descripcion
  };

  const url = asignaturaEditando
    ? `https://app-gestionacademica-627042166405.europe-west1.run.app/api/asignaturas/${formulario.codigo}`
    : "https://app-gestionacademica-627042166405.europe-west1.run.app/api/asignaturas";

  const method = asignaturaEditando ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || data.mensaje || "Error al guardar asignatura");
      return;
    }

    await cargarAsignaturas();
    setDialogoAbierto(false);

    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Error inesperado");
    }
  };



  const eliminarAsignatura = async (id) => {
    if (!confirm("¿Está seguro de eliminar esta asignatura?")) return;

  const res = await fetch(`https://app-gestionacademica-627042166405.europe-west1.run.app/api/asignaturas/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    const data = await res.json();
    alert(data.error || data.mensaje || "Error al eliminar asignatura");
    return;
  }

    await cargarAsignaturas();
  };

 const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Asignaturas");

    sheet.mergeCells("A1:G1");
    const titulo = sheet.getCell("A1");
    titulo.value = "Reporte de Asignaturas";
    titulo.font = { size: 16, bold: true };
    titulo.alignment = { horizontal: "center" };

    const headers = [
      "Código",
      "Nombre",
      "Descripción",
      "Créditos",
      "Carga Horaria",
      "Tipo",
    ];

    const headerRow = sheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    asignaturasFiltradas.forEach((a) => {
      sheet.addRow([
        a.codigo ?? "—",
        a.nombre ?? "—",
        a.descripcion ?? "—",
        a.creditos ?? "—",
        a.carga_horaria ?? "—",
        a.tipo ?? "—",
      ]);
    });

    sheet.columns.forEach((col) => (col.width = 28));

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Asignaturas.xlsx");
  };

  if (loading) return <p className="text-center py-10 text-gray-500 font-semibold">Cargando Asignaturas...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

//INTERFAZ
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Asignaturas</h1>
          <p className="text-muted-foreground">
            Gestiona las materias del plan de estudios
          </p>
        </div>

        {/* Botón Crear */}
        <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
          <DialogTrigger asChild>
            <Button onClick={abrirDialogoNuevo}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Asignatura
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {asignaturaEditando ? "Editar Asignatura" : "Crear Nueva Asignatura"}
              </DialogTitle>
              <DialogDescription>
                Ingresa la información de la asignatura
              </DialogDescription>
            </DialogHeader>

            {/* FORMULARIO */}
            <div className="grid gap-4 py-4">
              {/* Mostrar código solo al editar (disabled) */}
              {asignaturaEditando && (
                <div className="space-y-2">
                  <Label>Código</Label>
                  <Input value={formulario.codigo} disabled />
                </div>
              )}

              <div className="space-y-2">
                <Label>Nombre *</Label>
                <Input
                  value={formulario.nombre}
                  onChange={(e) =>
                    setFormulario({ ...formulario, nombre: e.target.value })
                  }
                  placeholder="Programación I"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Créditos *</Label>
                  <Input
                    type="number"
                    value={formulario.creditos}
                    onChange={(e) =>
                      setFormulario({ ...formulario, creditos: e.target.value })
                    }
                    placeholder="4"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Carga Horaria *</Label>
                  <Input
                    type="number"
                    value={formulario.carga_horaria}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        carga_horaria: e.target.value,
                      })
                    }
                    placeholder="64"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo *</Label>
                <Select
                  value={formulario.tipo}
                  onValueChange={(v) =>
                    setFormulario({ ...formulario, tipo: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teorica">Teórica</SelectItem>
                    <SelectItem value="practica">Práctica</SelectItem>
                    <SelectItem value="mixta">Mixta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input
                  value={formulario.descripcion}
                  onChange={(e) =>
                    setFormulario({ ...formulario, descripcion: e.target.value })
                  }
                  placeholder="Breve descripción..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogoAbierto(false)}>
                Cancelar
              </Button>
              <Button onClick={guardarAsignatura}>
                {asignaturaEditando ? "Guardar Cambios" : "Crear Asignatura"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* TARJETAS */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Asignaturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{asignaturas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Teóricas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {asignaturas.filter((a) => a.tipo === "teorica").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Prácticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {asignaturas.filter((a) => a.tipo === "practica").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Mixtas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {asignaturas.filter((a) => a.tipo === "mixta").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BUSQUEDA Y FILTRO */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
          <CardDescription>Encuentra asignaturas específicas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={tipoSeleccionado} onValueChange={setTipoSeleccionado}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="teorica">Teórica</SelectItem>
                <SelectItem value="practica">Práctica</SelectItem>
                <SelectItem value="mixta">Mixta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* TABLA */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lista de Asignaturas</CardTitle>
            <CardDescription>Total: {asignaturasFiltradas.length}</CardDescription>
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
                <TableHead>Asignatura</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Créditos</TableHead>
                <TableHead>Carga Horaria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {asignaturasFiltradas.map((asignatura) => (
                <TableRow key={asignatura.codigo}>
                  <TableCell className="font-mono">
                    {asignatura.codigo}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-indigo-600" />
                      {asignatura.nombre}
                    </div>
                  </TableCell>
                  <TableCell>{asignatura.descripcion}</TableCell>
                  <TableCell>{asignatura.creditos}</TableCell>
                  <TableCell>{asignatura.carga_horaria} horas</TableCell>
                  <TableCell>
                    <Badge variant="outline">{asignatura.tipo}</Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => abrirDialogoEditar(asignatura)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          eliminarAsignatura(asignatura.codigo)
                        }
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
