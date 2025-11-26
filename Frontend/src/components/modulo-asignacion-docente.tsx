import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Search, Plus, Trash2, Edit } from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FileSpreadsheet } from "lucide-react";


export function ModuloAsignacionDocente() {
  const [docentes, setDocentes] = useState<any[]>([]);
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [asignaciones, setAsignaciones] = useState<any[]>([]);

  const [planes, setPlanes] = useState<any[]>([]);
  const [asignaturas, setAsignaturas] = useState<any[]>([]);
  const [programas, setProgramas] = useState<any[]>([]);
  const [periodos, setPeriodos] = useState<any[]>([]);

  const [cargando, setCargando] = useState(true);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);

  useEffect(() => {
    cargarTodo();
  }, []);

  async function safeFetchJson(url: string) {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} — ${txt}`);
    }
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  function normalizeArrayResponse(raw: any, candidateKeys: string[]) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    for (const k of candidateKeys) {
      if (Array.isArray(raw[k])) return raw[k];
    }
    const firstArray = Object.values(raw).find((v) => Array.isArray(v));
    if (firstArray) return (firstArray as any[]);
    console.warn("normalizeArrayResponse: respuesta inesperada:", raw);
    return [];
  }

  async function cargarTodo() {
    setCargando(true);
    setErrorGlobal(null);

    try {
      const [
        rawDocentes,
        rawOfertas,
        rawAsignaciones,
        rawPlanes,
        rawAsignaturas,
        rawProgramas,
        rawPeriodos
      ] = await Promise.all([
        safeFetchJson("https://app-gestionacademica-627042166405.europe-west1.run.app/api/docentes"),
        safeFetchJson("https://app-gestionacademica-627042166405.europe-west1.run.app/api/ofertas"),
        safeFetchJson("https://app-gestionacademica-627042166405.europe-west1.run.app/api/asignaciones"),
        safeFetchJson("https://app-gestionacademica-627042166405.europe-west1.run.app/api/planes-estudio"),
        safeFetchJson("https://app-gestionacademica-627042166405.europe-west1.run.app/api/asignaturas"),
        safeFetchJson("https://app-gestionacademica-627042166405.europe-west1.run.app/api/programas"),
        safeFetchJson("https://app-gestionacademica-627042166405.europe-west1.run.app/api/periodos"),
      ]);

      const normDocentes = normalizeArrayResponse(rawDocentes, ["docentes", "data", "items"]);
      const normOfertas = normalizeArrayResponse(rawOfertas, ["ofertas", "data", "items"]);
      const normAsign = normalizeArrayResponse(rawAsignaciones, ["asignaciones", "data", "items"]);
      const normPlanes = normalizeArrayResponse(rawPlanes, ["planes", "data", "items", "planes_estudio", "planesEstudio"]);
      const normAsig = normalizeArrayResponse(rawAsignaturas, ["asignaturas", "data", "items"]);
      const normProg = normalizeArrayResponse(rawProgramas, ["programas", "data", "items"]);
      const normPeriodos = normalizeArrayResponse(rawPeriodos, ["periodos", "data", "items"]);

      setDocentes(normDocentes);
      setOfertas(normOfertas);
      setAsignaciones(normAsign);
      setPlanes(normPlanes);
      setAsignaturas(normAsig);
      setProgramas(normProg);
      setPeriodos(normPeriodos);

      console.debug("docentes:", normDocentes);
      console.debug("ofertas:", normOfertas);
      console.debug("asignaciones:", normAsign);
      console.debug("planes:", normPlanes);
      console.debug("asignaturas:", normAsig);
      console.debug("programas:", normProg);
      console.debug("periodos:", normPeriodos);
    } catch (err: any) {
      console.error("Error al cargar datos:", err);
      setErrorGlobal(err.message || String(err));
      setDocentes([]);
      setOfertas([]);
      setAsignaciones([]);
      setPlanes([]);
      setAsignaturas([]);
      setProgramas([]);
      setPeriodos([]);
    } finally {
      setCargando(false);
    }
  }

  const asignaturaById = new Map<string, any>();
  asignaturas.forEach((a) => {
    const id = a.id || a.id_asignatura || a.codigo || a.codigo_asignatura;
    if (id) asignaturaById.set(String(id), a);
  });

  const asignaturaNameToId = new Map<string, string>();
  asignaturas.forEach((a) => {
    const nombre = (a.nombre || "").toString().trim().toLowerCase();
    const id = a.id || a.id_asignatura || a.codigo;
    if (nombre && id) asignaturaNameToId.set(nombre, String(id));
  });

  const programaById = new Map<string, any>();
  programas.forEach((p) => {
    const id = p.id_programa || p.id || p.codigo;
    if (id) programaById.set(String(id), p);
  });


  const programaNameToId = new Map<string, string>();
  programas.forEach((p) => {
    const nombre = (p.nombre || "").toString().trim().toLowerCase();
    const id = p.id_programa || p.id || p.codigo;
    if (nombre && id) programaNameToId.set(nombre, String(id));
  });

  const planesById = new Map<string, any>();
  planes.forEach((pl) => {
    const id = pl.id_plan || pl.id || pl.codigo;
    if (id) planesById.set(String(id), pl);
  });

  const periodosById = new Map<string, any>();
  periodos.forEach((p) => {
    const id = p.id_periodo || p.id || p.codigo;
    if (id) periodosById.set(String(id), p);
  });

  //----------------------------------------------

  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [editando, setEditando] = useState<any>(null);
  const [formulario, setFormulario] = useState({ id_docente: "", id_oferta: "" });

  const abrirNuevo = () => {
    setEditando(null);
    setFormulario({ id_docente: "", id_oferta: "" });
    setDialogoAbierto(true);
  };

  const abrirEditar = (row: any) => {
    setEditando(row);
    setFormulario({
      id_docente: row.id_docente ?? row.idDocente ?? row.idDoc ?? "",
      id_oferta: row.id_oferta ?? row.idOferta ?? row.id_oferta ?? "",
    });
    setDialogoAbierto(true);
  };

  const guardar = async () => {
    if (!formulario.id_docente || !formulario.id_oferta) {
      alert("Completa id_docente e id_oferta");
      return;
    }

    const docenteValido = docentes.some((d) => String(d.id_docente) === String(formulario.id_docente));
    const ofertaValida = ofertas.some((o) => String(o.id_oferta ?? o.idOferta) === String(formulario.id_oferta));

    if (!docenteValido || !ofertaValida) {
      alert("Docente o oferta inválidos");
      return;
    }

    const dup = asignaciones.some((a) => {
      const idAsign = a.id_asignacion ?? a.id ?? a.idAsignacion;
      return (
        (a.id_docente ?? a.idDocente) === formulario.id_docente &&
        (a.id_oferta ?? a.idOferta) === formulario.id_oferta &&
        idAsign !== (editando?.id_asignacion ?? editando?.id ?? editando?.idAsignacion)
      );
    });
    if (dup) {
      alert("La asignación (docente + oferta) ya existe");
      return;
    }

    try {
      if (editando) {
        const idAsign = editando.id_asignacion ?? editando.id ?? editando.idAsignacion;
        const res = await fetch(`https://app-gestionacademica-627042166405.europe-west1.run.app/api/asignaciones/${idAsign}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formulario),
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`PUT failed: ${res.status} ${txt}`);
        }
      } else {
        const res = await fetch(`https://app-gestionacademica-627042166405.europe-west1.run.app/api/asignaciones`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formulario),
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(` ${txt}`);
        }
      }

      await cargarTodo();
      setDialogoAbierto(false);
    } catch (err: any) {
      console.error("Error guardando asignación:", err);
      alert((err.message || String(err)));
    }
  };

  const eliminar = async (idRaw: any) => {
    const idToDelete = idRaw;
    if (!confirm("¿Eliminar esta asignación?")) return;

    try {
      const res = await fetch(`https://app-gestionacademica-627042166405.europe-west1.run.app/api/asignaciones/${idToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        let mensaje = "Error desconocido";
        try {
          mensaje = await res.text();
        } catch {}
        throw new Error(`DELETE ${res.status}: ${mensaje}`);
      }
      await cargarTodo();
    } catch (err: any) {
      console.error("Error eliminando:", err);
      alert("Error eliminando: " + (err.message || String(err)));
    }
  };

  const findDocente = (id_docente: string) => docentes.find((d) => d.id_docente === id_docente) || null;
  const findOferta = (id_oferta: string) =>
    ofertas.find((o) => o.id_oferta === id_oferta || o.idOferta === id_oferta) || null;


  const ofertasAsignadas = new Set(
    asignaciones.map(a => String(a.id_oferta ?? a.idOferta))
  );

  const ofertasSinAsignacion = ofertas.filter(o => {
    const id = String(o.id_oferta ?? o.idOferta ?? o.id);
    return !ofertasAsignadas.has(id);
  });

  const ofertasParaEditar = editando
    ? ofertas.filter(o => {
        const id = String(o.id_oferta ?? o.idOferta ?? o.id);
        const idActual = String(editando.id_oferta ?? editando.idOferta ?? editando.id_oferta);
        return !ofertasAsignadas.has(id) || id === idActual;
      })
    : ofertasSinAsignacion;

    const [busqueda, setBusqueda] = useState("");
    const datosFiltrados = asignaciones.filter((a) => {
      const idAsign = a.id_asignacion ?? a.id ?? a.idAsignacion ?? a.id_asignacion;
      const idDoc = a.id_docente ?? a.idDocente ?? a.id_docente;
      const idOf = a.id_oferta ?? a.idOferta ?? a.id_oferta;

      const d = findDocente(idDoc);
      const o = findOferta(idOf);

      const periodoText = (o?.id_periodo ?? o?.periodo ?? o?.idPeriodo ?? o?.periodo) || "";

      const texto = `${idAsign || ""} ${idDoc || ""} ${d?.nombre ?? ""} ${d?.apellido ?? ""} ${
        d?.cedula ?? ""
      } ${idOf || ""} ${periodoText} ${o?.id_plan ?? o?.idPlan ?? o?.id_plan ?? ""}`.toLowerCase();

      return texto.includes(busqueda.toLowerCase());
    });

    if (cargando) return       <div className="text-center py-10 text-gray-500 font-semibold">Cargando asignaciones...</div>;


  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Asignación Docente");

    sheet.mergeCells("A1:G1");
    const titulo = sheet.getCell("A1");
    titulo.value = "Reporte de Asignación de Docentes";
    titulo.font = { size: 16, bold: true };
    titulo.alignment = { horizontal: "center" };

    const headers = [
      "ID Asignación",
      "Docente",
      "ID Docente",
      "Oferta",
      "ID Oferta",
      "Asignatura",
      "Periodo"
    ];

    const headerRow = sheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    datosFiltrados.forEach((a) => {
      const idAsign = a.id_asignacion ?? a.id ?? a.idAsignacion;
      const idDoc = a.id_docente ?? a.idDocente;
      const idOf = a.id_oferta ?? a.idOferta;

      const docente = findDocente(idDoc);
      const oferta = findOferta(idOf);

      const nombreDocente = docente
        ? `${docente.nombre} ${docente.apellido}`
        : "Desconocido";

      const nombreAsignatura =
        oferta?.asignatura_nombre ||
        oferta?.nombre_asignatura ||
        oferta?.asignatura ||
        "Asignatura desconocida";

      const periodo =
        oferta?.id_periodo ||
        oferta?.periodo ||
        oferta?.idPeriodo ||
        "—";

      sheet.addRow([
        idAsign,
        nombreDocente,
        idDoc,
        nombreAsignatura,
        idOf,
        oferta?.grupo ?? "—",
        periodo,
      ]);
    });

    sheet.columns.forEach((col) => (col.width = 22));

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "AsignacionDocente.xlsx");
  };

//INTERFAZ

  return (
    <div className="space-y-6">
      {errorGlobal && (
        <Card>
          <CardHeader>
            <CardTitle>Error al cargar datos</CardTitle>
            <CardDescription>Revisa la consola y la API.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-red-600 break-words">{errorGlobal}</div>
          </CardContent>
        </Card>
      )}

      {/* TÍTULO Y DIALOG */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Asignación Docente</h1>
          <p className="text-muted-foreground">Asigna docentes a los grupos ofertados</p>
        </div>

        <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
          <DialogTrigger asChild>
            <Button onClick={abrirNuevo}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Asignación
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editando ? "Editar Asignación" : "Crear Asignación"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Docente *</Label>
                <Select value={formulario.id_docente} onValueChange={(v) => setFormulario({ ...formulario, id_docente: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar docente" />
                  </SelectTrigger>
                  <SelectContent>
                    {docentes.map((d) => (
                      <SelectItem key={d.id_docente} value={d.id_docente}>
                        {d.id_docente} — {d.nombre} {d.apellido} ({d.cedula})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Oferta *</Label>
                <Select value={formulario.id_oferta} onValueChange={(v) => setFormulario({ ...formulario, id_oferta: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar oferta" />
                  </SelectTrigger>
                <SelectContent>
                  {(editando ? ofertasParaEditar : ofertasSinAsignacion).map((o) => {
                    const idOf = o.id_oferta ?? o.idOferta ?? o.id;
                    const grupo = o.grupo ?? o.group ?? "—";
                    const nombreAsign = o.asignatura ?? o.asignatura_nombre ?? o.nombre_asignatura ?? "Asignatura desconocida";

                    return (
                      <SelectItem key={String(idOf)} value={String(idOf)}>
                        {idOf} — Grupo: {grupo} — {nombreAsign}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogoAbierto(false)}>
                Cancelar
              </Button>
              <Button onClick={guardar}>{editando ? "Guardar Cambios" : "Crear"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* CARDS RESUMEN */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Asignaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{asignaciones.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Docentes con asignaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              {[...new Set(asignaciones.map((a) => a.id_docente ?? a.idDocente))].length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ofertas con asignación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {[...new Set(asignaciones.map((a) => a.id_oferta ?? a.idOferta))].length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BUSCADOR */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
          <CardDescription>Encuentra asignaciones de docentes a grupos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar" className="pl-8" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* TABLA PRINCIPAL */}
      <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Lista de Asignaciones</CardTitle>
          <CardDescription>Total: {datosFiltrados.length}</CardDescription>
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
                <TableHead>ID Docente</TableHead>
                <TableHead>Docente</TableHead>
                <TableHead>Cédula</TableHead>
                <TableHead>ID Oferta</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Asignatura</TableHead>
                <TableHead>Programa</TableHead>
                <TableHead>Periodo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {datosFiltrados.map((a) => {
                // resolución flexible de campos
                const idAsign = a.id_asignacion ?? a.id ?? a.idAsignacion ?? a.id_asignacion;
                const idDoc = a.id_docente ?? a.idDocente ?? a.id_docente;
                const idOf = a.id_oferta ?? a.idOferta ?? a.id_oferta;

                const d = findDocente(idDoc);
                const o = findOferta(idOf);

                // 1) Intentar obtener id_plan a partir de oferta.asignatura + oferta.programa_academico
                // (oferta puede traer 'asignatura' como nombre y 'programa_academico' como nombre)
                const ofertaAsignaturaNombre = (o?.asignatura ?? o?.asignatura_nombre ?? o?.asignaturaNombre ?? "").toString().trim().toLowerCase();
                const ofertaProgramaNombre = (o?.programa_academico ?? o?.programa ?? o?.programaNombre ?? "").toString().trim().toLowerCase();

                const asignIdFromName = asignaturaNameToId.get(ofertaAsignaturaNombre) ?? null;
                const progIdFromName = programaNameToId.get(ofertaProgramaNombre) ?? null;

                // buscar plan que tenga id_asignatura === asignIdFromName && id_programa === progIdFromName
                let planFound = null;
                if (asignIdFromName && progIdFromName) {
                  planFound = planes.find((p) =>
                    (p.id_asignatura ?? p.idAsignatura ?? p.id_asig) === asignIdFromName &&
                    (p.id_programa ?? p.idPrograma ?? p.id_prog) === progIdFromName
                  );
                }

                // si la oferta trae directamente id_plan (raro en tu backend actual) lo usamos
                const idPlanFromOferta = o?.id_plan ?? o?.idPlan ?? o?.plan ?? null;
                const planIdToShow = (idPlanFromOferta ?? planFound?.id_plan ?? planFound?.id ?? "—");

                // resolver asignatura y programa nombrados
                const asignObj = asignIdFromName ? asignaturaById.get(String(asignIdFromName)) ?? null : null;
                const progObj = progIdFromName ? programaById.get(String(progIdFromName)) ?? null : null;

                // periodo: preferir oferta.id_periodo, si no intentar casar por nombre con periodos
                const idPeriodoFromOferta = o?.id_periodo ?? o?.idPeriodo ?? o?.periodoId ?? null;
                let periodoObj = idPeriodoFromOferta ? periodosById.get(String(idPeriodoFromOferta)) : null;
                // si no hay id y la oferta trae un texto 'Periodo 2025-2' intentar encontrar periodos por descripción o id textual
                if (!periodoObj && o?.periodo) {
                  const txt = (o.periodo || "").toString().trim().toLowerCase();
                  periodoObj = periodos.find((p) =>
                    (p.id_periodo ?? p.id ?? p.codigo ?? "").toString().trim().toLowerCase() === txt ||
                    (p.descripcion ?? p.descripcionPeriodo ?? "").toString().trim().toLowerCase() === txt
                  ) ?? null;
                }
                const periodoLabel = periodoObj?.descripcion ?? periodoObj?.nombre ?? periodoObj?.id_periodo ?? periodoObj?.id ?? o?.periodo ?? o?.id_periodo ?? "—";

                return (
                  <TableRow key={String(idAsign ?? Math.random())}>
                    <TableCell className="font-mono">{idAsign ?? "—"}</TableCell>
                    <TableCell className="font-mono">{idDoc ?? "—"}</TableCell>
                    <TableCell>
                      <div className="font-medium">{d ? `${d.nombre} ${d.apellido}` : "—"}</div>
                    </TableCell>
                    <TableCell className="font-mono">{d?.cedula || "—"}</TableCell>
                    <TableCell className="font-mono">{idOf ?? "—"}</TableCell>
                    <TableCell className="font-mono">
                      <Badge variant="outline">{o?.grupo ?? o?.group ?? "—"}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">{planIdToShow}</TableCell>
                    <TableCell className="font-mono">
                      <Badge variant="outline">{asignObj?.nombre ?? o?.asignatura ?? planFound?.id_asignatura ?? "—"}</Badge>
                    </TableCell>
                    <TableCell>{progObj?.nombre ?? o?.programa_academico ?? planFound?.id_programa ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{periodoLabel}</Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => abrirEditar(a)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const idToDelete = a.id_asignacion ?? a.id ?? a.idAsignacion;
                            eliminar(idToDelete);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
