import { CrearOfertaAcademicaDTO } from "../../dominio/dtos/OfertaAcademicaDTO";
import { IOfertaAcademicaRepositorio } from "../../dominio/repositorio/IOfertaAcademicaRepositorio";

export class OfertaAcademicaCasoUso {
  constructor(private repo: IOfertaAcademicaRepositorio) {}

  async crearOferta(datos: CrearOfertaAcademicaDTO) {
    // Verificar si ya existe una oferta igual
    const duplicado = await this.repo.existeGrupoDuplicado(
      datos.id_periodo,
      datos.id_plan,
    );

    if (duplicado) {
      throw new Error("Ya existe una oferta con esa información");
    }

    // Crear la oferta
    const nuevaOferta = await this.repo.crearOferta(datos);
    return {
      mensaje: "Oferta académica creada correctamente",
      data: nuevaOferta,
    };
  }

  async listarOfertas() {
    return await this.repo.listarOfertas();
  }

  async eliminarOferta(id_oferta: string) {
  // Primero verifica si la oferta existe
  const ofertas = await this.repo.listarOfertas();
  const existe = ofertas.some((o) => o.id_oferta === id_oferta);

  if (!existe) {
    throw new Error("La oferta académica no existe");
  }

  // Si existe, elimínala
  await this.repo.eliminarOferta(id_oferta);
  return { mensaje: `Oferta académica ${id_oferta} eliminada correctamente` };
}

async actualizarOferta(
  id_oferta: string,
  datos: { id_periodo?: string | null; id_plan?: string | null; cupo?: number | null }
) {
  const ofertas = await this.repo.listarOfertas();
  const existe = ofertas.some((o) => o.id_oferta === id_oferta);
  if (!existe) throw new Error("La oferta académica no existe");

  if (datos.id_periodo && datos.id_plan) {
    const duplicado = await this.repo.existeGrupoDuplicado(
      datos.id_periodo,
      datos.id_plan,
    );
    if (duplicado) throw new Error("Ya existe una oferta con ese período y plan");
  }

  await this.repo.actualizarOferta(id_oferta, datos);
  return { mensaje: `Oferta académica ${id_oferta} actualizada correctamente` };
}

async buscarOfertaPorId(id_oferta: string) {
  const oferta = await this.repo.buscarPorId(id_oferta);
  if (!oferta) {
    throw new Error("La oferta académica no existe");
  }
  return oferta;
}



}


