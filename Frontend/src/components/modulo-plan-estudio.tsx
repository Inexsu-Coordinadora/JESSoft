import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Search, Plus, Edit, Trash2, FileSpreadsheet } from "lucide-react";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export function ModuloPlanEstudio() {

  const [planesEstudio, setPlanesEstudio] = useState<any[]>([]);
  const [programas, setProgramas] = useState<any[]>([]);
  const [asignaturas, setAsignaturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [planEditando, setPlanEditando] = useState<any>(null);
  const [formulario, setFormulario] = useState({ programa: "", asignatura: "", semestre: "" });

  const cargarCatalogos = async () => {
    try {
      const respProg = await fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/programas");
      const respAsig = await fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/asignaturas");

      if (!respProg.ok) alert("Error cargando programas");
      if (!respAsig.ok) alert("Error cargando asignaturas");


      const dataProg = respProg.ok ? await respProg.json() : { programas: [] };
      const dataAsig = respAsig.ok ? await respAsig.json() : { asignaturas: [] };

      if (Array.isArray(dataProg.programas)) {
        setProgramas(
          dataProg.programas.map((p) => ({
            codigo: p.id_programa,
            nombre: p.nombre
          }))
        );
      }

      const arregloAsig = Array.isArray(dataAsig.asignaturas)
        ? dataAsig.asignaturas
        : Array.isArray(dataAsig)
        ? dataAsig
        : [];

      setAsignaturas(
        arregloAsig.map((a) => ({
          codigo:
            a.codigo ||
            a.id_asignatura ||
            a.id ||
            a.cod_asig ||
            a.codigo_asignatura,
          nombre: a.nombre
        }))
      );
    } catch (err) {
      console.error("❌ Error cargando catálogos:", err);
    }
  };

  const cargarPlanesEstudio = async () => {
    try {
      const resp = await fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/planes-estudio");
      const data = await resp.json();

      if (!resp.ok) {
        alert(data.mensaje || "Error cargando planes de estudio");
        return;
      }


      if (!Array.isArray(data)) return;

      const mapeados = data.map((p: any) => {
        const prog = programas.find(pr => pr.codigo === p.id_programa);
        const asig = asignaturas.find(a => a.codigo === p.id_asignatura);

        return {
          id_plan: p.id_plan,
          programa: p.id_programa,
          programaNombre: prog?.nombre || p.id_programa,
          asignatura: p.id_asignatura,
          asignaturaNombre: asig?.nombre || p.id_asignatura,
          semestre: p.semestre
        };
      });

      setPlanesEstudio(mapeados);

    } catch (err) {
      console.error("❌ Error cargando planes:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await cargarCatalogos();
    };

    load();
  }, []);

  useEffect(() => {
    if (programas.length === 0 || asignaturas.length === 0) return;

    const loadPlanes = async () => {
      await cargarPlanesEstudio();
      setLoading(false);
    };

    loadPlanes();
  }, [programas, asignaturas]);

  const [busqueda, setBusqueda] = useState("");
  const [filtroPrograma, setFiltroPrograma] = useState("todos");
  const [filtroSemestre, setFiltroSemestre] = useState("todos");

  const planesFiltrados = planesEstudio.filter((p) => {
    const coincideBusqueda =
      p.programaNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.asignaturaNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.programa.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.asignatura.toLowerCase().includes(busqueda.toLowerCase()) ||
      String(p.semestre).includes(busqueda);

    const coincidePrograma = filtroPrograma === "todos" || p.programa === filtroPrograma;
    const coincideSemestre = filtroSemestre === "todos" || String(p.semestre) === filtroSemestre;

    return coincideBusqueda && coincidePrograma && coincideSemestre;
  });

  const abrirNuevo = () => {
    setPlanEditando(null);
    setFormulario({ programa: "", asignatura: "", semestre: "" });
    setDialogoAbierto(true);
  };

  const abrirEditar = (plan: any) => {
    const prog = programas.find(p => p.codigo === plan.programa);
    const asig = asignaturas.find(a => a.codigo === plan.asignatura);

    setPlanEditando(plan);

    setFormulario({
      programa: prog ? prog.codigo : plan.programa,
      asignatura: asig ? asig.codigo : plan.asignatura,
      semestre: plan.semestre.toString()
    });

    setDialogoAbierto(true);
  };

  const guardarPlan = async () => {
    if (!formulario.programa || !formulario.asignatura || !formulario.semestre) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    const semestre = parseInt(formulario.semestre);

    if (planEditando) {
      const res = await fetch(`https://app-gestionacademica-627042166405.europe-west1.run.app/api/planes-estudio/${planEditando.id_plan}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_programa: formulario.programa,
          id_asignatura: formulario.asignatura,
          semestre
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.mensaje || "Error actualizando plan de estudio");
        return;
      }}
      else {
        const res = await fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/planes-estudio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_programa: formulario.programa,
            id_asignatura: formulario.asignatura,
            semestre
          })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.mensaje || "Error creando plan de estudio");
          return;
        }
    }

    setDialogoAbierto(false);
    cargarPlanesEstudio();
  };

  const eliminarPlan = async (id_plan: string) => {
    if (confirm("¿Está seguro de eliminar este registro?")) {
      const res = await fetch(`https://app-gestionacademica-627042166405.europe-west1.run.app/api/planes-estudio/${id_plan}`, {
        method: "DELETE"
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.mensaje || "Error eliminando plan de estudio");
        return;
      }
      cargarPlanesEstudio();
    }
  };

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Planes de Estudio");

    sheet.mergeCells("A1:F1");
    const titulo = sheet.getCell("A1");
    titulo.value = "Reporte de Planes de Estudio";
    titulo.font = { size: 16, bold: true };
    titulo.alignment = { horizontal: "center" };

    const headers = [
      "ID Plan",
      "Programa",
      "Código Programa",
      "Asignatura",
      "Código Asignatura",
      "Semestre"
    ];

    const headerRow = sheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    planesFiltrados.forEach((p) => {
      sheet.addRow([
        p.id_plan,
        p.programaNombre,
        p.programa,
        p.asignaturaNombre,
        p.asignatura,
        p.semestre
      ]);
    });

    sheet.columns.forEach((col) => (col.width = 22));

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "PlanEstudio.xlsx");
  };

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500 font-semibold">
        Cargando planes de estudio...
      </div>
    );

//INTERFAZ
  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Plan de Estudio</h1>
          <p className="text-muted-foreground">Asignación de asignaturas por programa</p>
        </div>

        <div className="flex gap-3">

          <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
            <DialogTrigger asChild>
              <Button onClick={abrirNuevo}>
                <Plus className="mr-2 h-4 w-4" /> Nuevo Registro
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{planEditando ? "Editar Plan" : "Nuevo Plan"}</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">

                <div className="space-y-2">
                  <Label>ID</Label>
                  <Input
                    value={planEditando ? planEditando.id_plan : "Código autogenerado"}
                    readOnly
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label>Programa *</Label>
                  <Select
                    value={formulario.programa}
                    onValueChange={(v) => setFormulario({ ...formulario, programa: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="Seleccionar programa" /></SelectTrigger>
                    <SelectContent>
                      {programas.map((p) => (
                        <SelectItem key={p.codigo} value={p.codigo}>{p.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Asignatura *</Label>
                  <Select
                    value={formulario.asignatura}
                    onValueChange={(v) => setFormulario({ ...formulario, asignatura: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="Seleccionar asignatura" /></SelectTrigger>
                    <SelectContent>
                      {asignaturas.map((a) => (
                        <SelectItem key={a.codigo} value={a.codigo}>{a.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Semestre *</Label>
                  <Input
                    type="number"
                    value={formulario.semestre}
                    onChange={(e) => setFormulario({ ...formulario, semestre: e.target.value })}
                    placeholder="#"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogoAbierto(false)}>Cancelar</Button>
                <Button onClick={guardarPlan}>{planEditando ? "Guardar Cambios" : "Registrar"}</Button>
              </DialogFooter>

            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
          <CardDescription>Encuentra planes de estudio por programa, asignatura o semestre...</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">

            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="w-48">
              <Select value={filtroPrograma} onValueChange={setFiltroPrograma}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Programa" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {programas.map((p) => (
                    <SelectItem key={p.codigo} value={p.codigo}>{p.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-48">
              <Select value={filtroSemestre} onValueChange={setFiltroSemestre}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Semestre" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {[1,2,3,4,5,6,7,8,9,10].map(s => (
                    <SelectItem key={s} value={String(s)}>{s}</SelectItem>
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
          <CardTitle>Lista de Plan de Estudio</CardTitle>
          <CardDescription>Total: {planesFiltrados.length}</CardDescription>
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
                <TableHead>Asignatura</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {planesFiltrados.map((p) => (
                <TableRow key={p.id_plan}>

                  <TableCell className="font-mono">{p.id_plan}</TableCell>

                  <TableCell>
                    <div className="font-medium">{p.programaNombre}</div>
                    <div className="text-xs text-muted-foreground">{p.programa}</div>
                  </TableCell>

                  <TableCell>
                    <div className="font-medium">{p.asignaturaNombre}</div>
                    <div className="text-xs text-muted-foreground">{p.asignatura}</div>
                  </TableCell>

                  <TableCell>
                    <Badge>{p.semestre}</Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => abrirEditar(p)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => eliminarPlan(p.id_plan)}>
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
