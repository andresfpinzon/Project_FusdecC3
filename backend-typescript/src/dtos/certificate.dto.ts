

export interface CreateCertificateDTO {
    nameEmisor: string;
    fechaEmision: Date;
    codigoVerify: string;
    isActive: boolean;
    usuario: string;
    curso: string;
    estudiante: string;
}
export interface UpdateCertificateDTO {
    nameEmisor?: string;
    fechaEmision?: Date;
    codigoVerify?: string;
    isActive?: boolean;
    usuario?: string;
    curso?: string;
    estudiante?: string;
}