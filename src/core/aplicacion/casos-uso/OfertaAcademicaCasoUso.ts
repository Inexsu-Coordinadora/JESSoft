
import { CrearOfertaAcademicaDTO, OfertaAcademicaExtendidaDTO } from "../../dominio/dtos/OfertaAcademicaDTO";
import { IOfertaAcademicaRepositorio } from "../../dominio/repositorio/IOfertaAcademicaRepositorio";
import { OfertaAcademica } from "../../dominio/entidades/OfertaAcademica";

export class OfertaAcademicaCasoUso {
  private repo: IOfertaAcademicaRepositorio;

  constructor(repo: IOfertaAcademicaRepositorio) {
    this.repo = repo;
  }

  //Nueva oferta académica
  public async crearOferta(datos: CrearOfertaAcademicaDTO): Promise<CrearOfertaAcademicaDTO> {
    const periodo = await this.repo.buscarPeriodo(datos.id_periodo);
    if (!periodo.existe) {
      throw new Error("El periodo académico no existe.");
    }

    //Vr si el perido esta activo
    if (periodo.estado !== "activo") {
      throw new Error("No se puede realizar la oferta en un periodo inactivo.");
    }

    //Ver si el plan de estudio si existe 
    const existePlan = await this.repo.buscarPlan(datos.id_plan);
    if (!existePlan) {
      throw new Error("El plan de estudio no existe.");
    }

    //Ver si no existe ese grupo
    const duplicado = await this.repo.existeGrupoDuplicado(
      datos.id_periodo,
      datos.id_plan,
      datos.grupo || "G1" // por si viene vacío el se crea
    );
    if (duplicado) {
      throw new Error("Ya existe este grupo");
    }

    //Ver si el numero de cupos sirve 
    if (datos.cupo <= 0) {
      throw new Error("El cupo debe ser mayor que 0.");
    }

    //Crear la oferta
    const nuevaOferta = await this.repo.crearOferta(datos);

    const respuesta: CrearOfertaAcademicaDTO = {
      id_periodo: nuevaOferta.id_periodo,
      id_plan: nuevaOferta.id_plan,
      grupo: nuevaOferta.grupo,
      cupo: nuevaOferta.cupo,
    };

    return respuesta;
  }

  //Listar
  public async listarOfertas(): Promise<CrearOfertaAcademicaDTO[]> {
  const lista = await this.repo.listarOfertas();
  return lista; 
}
}


