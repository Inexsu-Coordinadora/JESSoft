import { IAsignacionDocente } from "./IAsignacionDocente";

export class AsignacionDocente implements IAsignacionDocente{
    id_docente : string;
    id_oferta : string;

    constructor(datosAsignacionDocente : IAsignacionDocente){
        this.id_docente = datosAsignacionDocente.id_docente;
        this.id_oferta = datosAsignacionDocente.id_oferta;
    }
}