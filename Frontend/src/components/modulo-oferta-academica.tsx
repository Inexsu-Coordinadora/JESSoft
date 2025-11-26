import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Plus, Edit, Trash2, Search } from "lucide-react";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FileSpreadsheet } from "lucide-react";


export function ModuloOfertaAcademica() {
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [periodos, setPeriodos] = useState<any[]>([]);
  const [planes, setPlanes] = useState<any[]>([]);
  const [programasData, setProgramasData] = useState<any[]>([]);
  const [asignaturasData, setAsignaturasData] = useState<any[]>([]);

  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [ofertaEditando, setOfertaEditando] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [formulario, setFormulario] = useState({
    id_periodo: "",
    id_plan: "",
    cupo: "",
    grupo: ""
  });

  const [busqueda, setBusqueda] = useState("");
  const [filtroPrograma, setFiltroPrograma] = useState("todos");
  const [filtroPeriodo, setFiltroPeriodo] = useState("todos");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resOfertas, resPeriodos, resProgramas, resAsignaturas, resPlanes] = await Promise.all([
          fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/ofertas"),
          fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/periodos"),
          fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/programas"),
          fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/asignaturas"),
          fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/planes-estudio")
        ]);

        const dataOfertas = await resOfertas.json();
        setOfertas(dataOfertas.ofertas || []);

        const dataPeriodos = await resPeriodos.json();
        setPeriodos(dataPeriodos.periodos || []);

        const dataProgramas = await resProgramas.json();
        setProgramasData(dataProgramas.programas || []);

        const dataAsignaturas = await resAsignaturas.json();
        setAsignaturasData(dataAsignaturas.asignaturas || []);

        const dataPlanes = await resPlanes.json();
        setPlanes(Array.isArray(dataPlanes) ? dataPlanes : []);
      } catch (e) {
        console.error("Error cargando datos:", e);
      }

      setLoading(false);
    };

    cargarDatos();
  }, []);


  const abrirDialogoNuevo = () => {
    setOfertaEditando(null);
    setFormulario({ id_periodo: "", id_plan: "", cupo: "", grupo: "" });
    setDialogoAbierto(true);
  };

  const abrirDialogoEditar = (oferta: any) => {
    setOfertaEditando(oferta);
    setDialogoAbierto(true);
  };

  useEffect(() => {
    if (!ofertaEditando || planes.length === 0 || periodos.length === 0) return;

    // Buscar periodo por la descripción exacta
    const periodo = periodos.find((p) => p.descripcion === ofertaEditando.periodo);

    // Buscar el programa usando el nombre que viene del backend
    const programa = programasData.find(
      (pg) => pg.nombre === ofertaEditando.programa_academico
    );

    // Buscar la asignatura usando el nombre que viene del backend
    const asignatura = asignaturasData.find(
      (a) => a.nombre === ofertaEditando.asignatura
    );

    // Reconstruir el id_plan correcto
    const plan = planes.find(
      (p) =>
        p.id_programa === programa?.id_programa &&
        p.id_asignatura === asignatura?.id_asignatura
    );

    setFormulario({
      id_periodo: periodo?.id_periodo || "",
      id_plan: plan?.id_plan || "",
      cupo: String(ofertaEditando.cupo),
      grupo: String(ofertaEditando.grupo)
    });
  }, [ofertaEditando, planes, periodos, programasData, asignaturasData]);

  const guardarOferta = async () => {
    if (!formulario.id_periodo.trim() || !formulario.id_plan.trim() || !formulario.cupo.trim()) {
      alert("Completa todos los campos");
      return;
    }

    const cupo = Number(formulario.cupo);
    if (isNaN(cupo) || cupo <= 0) {
      alert("Cupo inválido");
      return;
    }

    const body: any = {
      id_periodo: formulario.id_periodo.trim(),
      id_plan: formulario.id_plan.trim(),
      cupo
    };

    if (ofertaEditando) {
      body.grupo = ofertaEditando.grupo;
    } else {
      if (formulario.grupo.trim()) body.grupo = formulario.grupo.trim();
    }

    try {
      const url = ofertaEditando
        ? `https://app-gestionacademica-627042166405.europe-west1.run.app/api/ofertas/${ofertaEditando.id_oferta}`
        : "https://app-gestionacademica-627042166405.europe-west1.run.app/api/ofertas";

      const metodo = ofertaEditando ? "PUT" : "POST";

      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      console.error("Error del servidor:", errorData);
      alert(errorData?.mensaje || "Error al guardar la oferta");
      return;
    }

      const resOfertas = await fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/ofertas");
      const dataOfertas = await resOfertas.json();
      setOfertas(dataOfertas.ofertas || []);
      setDialogoAbierto(false);
    } catch (e) {
      console.error("Error guardando oferta:", e);
      alert("Error al guardar la oferta");
    }
  };

  const eliminarOferta = async (id_oferta: string) => {
    if (!confirm("¿Eliminar oferta académica?")) return;

    try {
      const res = await fetch(`https://app-gestionacademica-627042166405.europe-west1.run.app/api/ofertas/${id_oferta}`, { method: "DELETE" });
      setOfertas(ofertas.filter((o) => o.id_oferta !== id_oferta));
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        alert(data?.mensaje || "No se pudo eliminar la oferta");
        return;
      }     
    } catch (e) {
      console.error("Error eliminando oferta:", e);
    }
  };

  const ofertasFiltradas = ofertas.filter((o) => {
    const matchBusqueda =
      o.programa_academico.toLowerCase().includes(busqueda.toLowerCase()) ||
      o.asignatura.toLowerCase().includes(busqueda.toLowerCase()) ||
      String(o.grupo).toLowerCase().includes(busqueda.toLowerCase());

    const matchPrograma = filtroPrograma !== "todos" ? o.programa_academico === filtroPrograma : true;
    const matchPeriodo = filtroPeriodo !== "todos" ? o.periodo === filtroPeriodo : true;

    return matchBusqueda && matchPrograma && matchPeriodo;
  });

  const programas = Array.from(new Set(ofertas.map((o) => o.programa_academico))).map((p) => ({
    nombre: p
  }));

    if (loading) {
    return (
      <div className="w-full flex justify-center py-20">
        <p className="text-center py-10 text-gray-500 font-semibold">Cargando Ofertas</p>
      </div>
    );
  }

    const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Ofertas");

    sheet.mergeCells("A1:F1");
    const titulo = sheet.getCell("A1");
    titulo.value = "Reporte de Ofertas Académicas";
    titulo.font = { size: 16, bold: true };
    titulo.alignment = { horizontal: "center" };


    const headers = [
      "ID Oferta",
      "Periodo",
      "Programa",
      "Asignatura",
      "Grupo",
      "Cupo"
    ];
    const headerRow = sheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    ofertasFiltradas.forEach((o) => {
      sheet.addRow([
        o.id_oferta ?? o.id ?? "",
        o.periodo ?? o.id_periodo ?? "",
        o.programa_academico ?? "",
        o.asignatura ?? "",
        o.grupo ?? "",
        o.cupo ?? ""
      ]);
    });

    sheet.columns.forEach((col) => (col.width = 22));

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Ofertas_Academicas.xlsx");
  };

  // INTERFAZ
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Oferta Académica</h1>
          <p className="text-muted-foreground">Grupos ofertados por periodo</p>
        </div>

        <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
          <DialogTrigger asChild>
            <Button onClick={abrirDialogoNuevo}>
              <Plus className="mr-2 h-4 w-4" /> Nueva Oferta
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{ofertaEditando ? "Editar Cupo" : "Crear Oferta Académica"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* PERIODO */}
              <Select
                value={formulario.id_periodo}
                onValueChange={(v) => setFormulario({ ...formulario, id_periodo: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar periodo" />
                </SelectTrigger>
                <SelectContent>
                  {(ofertaEditando
                    ? periodos
                    : periodos.filter((p: any) => (p.estado || "").toLowerCase() !== "cerrado")
                  ).map((p) => (
                    <SelectItem key={p.id_periodo} value={p.id_periodo}>
                      {p.descripcion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* PLAN */}
              <Select
                value={formulario.id_plan}
                onValueChange={(v) => setFormulario({ ...formulario, id_plan: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar plan" />
                </SelectTrigger>
                <SelectContent>
                  {planes.map((p) => {
                    const asignatura = asignaturasData.find((a) => a.id_asignatura === p.id_asignatura);
                    const programa = programasData.find((pg) => pg.id_programa === p.id_programa);
                    return (
                      <SelectItem key={p.id_plan} value={p.id_plan}>
                        {programa?.nombre} — {asignatura?.nombre} (Semestres {p.semestre})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {/* CUPO */}
              <div className="space-y-2">
                <Label>Cupo *</Label>
                <Input
                  type="number"
                  value={formulario.cupo}
                  onChange={(e) => setFormulario({ ...formulario, cupo: e.target.value })}
                  placeholder="30"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogoAbierto(false)}>
                Cancelar
              </Button>
              <Button onClick={guardarOferta}>
                {ofertaEditando ? "Guardar cambios" : "Crear Oferta"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* CARDS */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Grupos Ofertados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ofertasFiltradas.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Cupos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {ofertasFiltradas.reduce((s, o) => s + o.cupo, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FILTROS */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
          <CardDescription>Encuentra ofertas por programa, periodo o grupo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>

            <div className="w-48">
              <Select value={filtroPrograma} onValueChange={setFiltroPrograma}>
                <SelectTrigger>
                  <SelectValue placeholder="Programa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los programas</SelectItem>
                  {programas.map((p) => (
                    <SelectItem key={p.nombre} value={p.nombre}>
                      {p.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-48">
              <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Periodo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {periodos.map((p) => (
                    <SelectItem key={p.id_periodo} value={p.descripcion}>
                      {p.descripcion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABLA */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="bold">Lista de Ofertas</CardTitle>
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
                <TableHead>ID Oferta</TableHead>
                <TableHead>Periodo</TableHead>
                <TableHead>Programa</TableHead>
                <TableHead>Asignatura</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead>Cupo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {ofertasFiltradas.map((o) => (
                <TableRow key={o.id_oferta}>
                  <TableCell>{o.id_oferta}</TableCell>
                  <TableCell><Badge>{o.periodo}</Badge></TableCell>
                  <TableCell>{o.programa_academico}</TableCell>
                  <TableCell>{o.asignatura}</TableCell>
                  <TableCell><Badge>Grupo {o.grupo}</Badge></TableCell>
                  <TableCell>{o.cupo}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => abrirDialogoEditar(o)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => eliminarOferta(o.id_oferta)}>
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
