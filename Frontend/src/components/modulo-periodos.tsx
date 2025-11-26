import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Calendar, Plus, Edit, Trash2 } from "lucide-react";

export function ModuloPeriodos() {
  const [periodos, setPeriodos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [periodoEditando, setPeriodoEditando] = useState<any>(null);

  const [formulario, setFormulario] = useState({
    codigo: "",
    nombre: "",
    fechaInicio: "",
    fechaFin: "",
    estado: "en preparacion",
  });

  const cargarPeriodos = async () => {
    setCargando(true);
    try {
      const res = await fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/periodos");
      const data = await res.json();

      const periodosMapeados = data.periodos.map((p: any) => ({
        id: p.id_periodo,
        codigo: p.id_periodo,
        nombre: p.descripcion,
        fechaInicio: p.fecha_inicio,
        fechaFin: p.fecha_fin,
        estado: p.estado,
      }));

      setPeriodos(periodosMapeados);
    } catch (e) {
      console.error("Error cargando periodos:", e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPeriodos();
  }, []);

  const abrirDialogoNuevo = () => {
    setPeriodoEditando(null);
    setFormulario({ codigo: "", nombre: "", fechaInicio: "", fechaFin: "", estado: "en preparacion" });
    setDialogoAbierto(true);
  };

  const abrirDialogoEditar = (periodo: any) => {
    setPeriodoEditando(periodo);

    const estadoNormalizado = periodo.estado === "preparacion" ? "en preparacion" : periodo.estado;
    const fechaInicio = periodo.fechaInicio.split("T")[0];
    const fechaFin = periodo.fechaFin.split("T")[0];

    setFormulario({
      codigo: periodo.codigo,
      nombre: periodo.nombre,
      fechaInicio,
      fechaFin,
      estado: estadoNormalizado,
    });

    setDialogoAbierto(true);
  };

  const guardarPeriodo = async () => {
    if (!formulario.nombre || !formulario.fechaInicio || !formulario.fechaFin) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (new Date(formulario.fechaFin) < new Date(formulario.fechaInicio)) {
      alert("La fecha de fin debe ser mayor o igual a la fecha de inicio");
      return;
    }

    const dataBackend = {
      descripcion: formulario.nombre,
      fecha_inicio: formulario.fechaInicio,
      fecha_fin: formulario.fechaFin,
      estado: formulario.estado,
    };

    if (periodoEditando) {
      await fetch(`https://app-gestionacademica-627042166405.europe-west1.run.app/api/periodos/${periodoEditando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataBackend),
      });
    } else {
      await fetch("https://app-gestionacademica-627042166405.europe-west1.run.app/api/periodos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataBackend),
      });
    }

    setDialogoAbierto(false);
    cargarPeriodos();
  };

  const cambiarEstado = async (id: any, nuevoEstado: string) => {
    const periodo = periodos.find((p) => p.id.toString() === id.toString());
    if (!periodo) return;

    if (nuevoEstado === "activo") {
      const activo = periodos.some((p) => p.estado === "activo" && p.id.toString() !== id.toString());
      if (activo) {
        alert("Ya existe un periodo activo.");
        return;
      }
    }

    if (periodo.estado === "cerrado" && nuevoEstado === "activo") {
      alert("Un periodo cerrado no puede reactivarse.");
      return;
    }

    try {
      await fetch(`https://app-gestionacademica-627042166405.europe-west1.run.app/api/periodos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      cargarPeriodos();
    } catch (e) {
      console.error("Error cambiando estado:", e);
    }
  };

  const eliminarPeriodo = async (id: any) => {
    const periodo = periodos.find((p) => p.id.toString() === id.toString());
    if (!periodo) return;

    if (periodo.estado === "activo") {
      alert("No se puede eliminar un periodo activo");
      return;
    }

    if (!confirm("¿Está seguro de eliminar este periodo?")) return;

    try {
      await fetch(`https://app-gestionacademica-627042166405.europe-west1.run.app/api/periodos/${id}`, { method: "DELETE" });
      cargarPeriodos();
    } catch (e) {
      console.error("Error eliminando periodo:", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Periodos Académicos</h1>
          <p className="text-muted-foreground">Gestiona los ciclos académicos</p>
        </div>

        <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
          <DialogTrigger asChild>
            <Button onClick={abrirDialogoNuevo}>
              <Plus className="mr-2 h-4 w-4" /> Nuevo Periodo
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{periodoEditando ? "Editar Periodo" : "Crear Nuevo Periodo"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Código *</Label>
                  <Input value={formulario.codigo} disabled placeholder="Código autogenerado" />
                </div>

                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select value={formulario.estado} onValueChange={(v) => setFormulario({ ...formulario, estado: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en preparacion">En Preparación</SelectItem>
                      <SelectItem value="activo">Activo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nombre *</Label>
                <Input value={formulario.nombre} onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha Inicio *</Label>
                  <Input type="date" value={formulario.fechaInicio} onChange={(e) => setFormulario({ ...formulario, fechaInicio: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label>Fecha Fin *</Label>
                  <Input type="date" value={formulario.fechaFin} onChange={(e) => setFormulario({ ...formulario, fechaFin: e.target.value })} />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogoAbierto(false)}>Cancelar</Button>
              <Button onClick={guardarPeriodo}>{periodoEditando ? "Guardar Cambios" : "Crear Periodo"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contenido */}
      {cargando ? (
        <div className="text-center py-10 text-gray-500 font-semibold">Cargando periodos...</div>
      ) : (
        <>
          {/* Tarjetas */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Activos</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{periodos.filter((p) => p.estado === "activo").length}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">En Preparación</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{periodos.filter((p) => p.estado === "en preparacion").length}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Cerrados</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{periodos.filter((p) => p.estado === "cerrado").length}</div></CardContent>
            </Card>
          </div>

          {/* Tabla */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Periodos</CardTitle>
              <CardDescription>Total: {periodos.length}</CardDescription>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Fecha Inicio</TableHead>
                    <TableHead>Fecha Fin</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {periodos.map((periodo) => (
                    <TableRow key={periodo.id}>
                      <TableCell className="font-mono">{periodo.codigo}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-indigo-600" /> {periodo.nombre}
                        </div>
                      </TableCell>
                      <TableCell>{periodo.fechaInicio.split("T")[0]}</TableCell>
                      <TableCell>{periodo.fechaFin.split("T")[0]}</TableCell>
                      <TableCell>
                        <Badge variant={periodo.estado === "activo" ? "default" : periodo.estado === "en preparacion" ? "secondary" : "outline"}>
                          {periodo.estado === "activo" ? "Activo" : periodo.estado === "en preparacion" ? "En Preparación" : "Cerrado"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => abrirDialogoEditar(periodo)}><Edit className="h-3 w-3" /></Button>
                          <Button variant="outline" size="sm" onClick={() => eliminarPeriodo(periodo.id)}><Trash2 className="h-3 w-3" /></Button>
                          {periodo.estado === "en preparacion" && <Button size="sm" onClick={() => cambiarEstado(periodo.id, "activo")}>Activar</Button>}
                          {periodo.estado === "activo" && <Button size="sm" variant="outline" onClick={() => cambiarEstado(periodo.id, "cerrado")}>Cerrar</Button>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
