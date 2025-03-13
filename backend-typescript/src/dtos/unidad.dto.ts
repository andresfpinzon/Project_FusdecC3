export interface CreateUnidadDto {
    nombreUnidad: string;
    estadoUnidad?: boolean; // Opcional, ya que tiene un valor por defecto
    brigadaId: string;
    usuarioId: string;
    estudiantes?: string[]; // Opcional, puede ser inicializado vacío
}
export interface UpdateUnidadDto {
    nombreUnidad?: string;
    estadoUnidad?: boolean;
    brigadaId?: string;
    usuarioId?: string;
    estudiantes?: string[];
}