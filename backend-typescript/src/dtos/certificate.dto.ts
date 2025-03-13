

export interface CreateCertificateDTO {
    nombreEmisorCertificado: string;
    codigoVerificacion: string;
    usuarioId?: string;
    cursoId?: string;
    estudianteId?: string;
}
export interface UpdateCertificateDTO {
    nombreEmisorCertificado?: string;
    fechaEmision?: Date;
    codigoVerificacion?: string;
    estadoCertificado?: boolean;
    usuarioId?: string;
    cursoId?: string;
    estudianteId?: string;
}