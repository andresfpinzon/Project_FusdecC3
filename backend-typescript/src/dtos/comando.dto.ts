export interface CreateComandoDto {
    nombreComando: string;
    estadoComando?: boolean; // Opcional, ya que tiene un valor por defecto
    ubicacionComando: string;
    fundacionId: string; // Usamos string para los IDs de MongoDB
    brigadas?: string[]; // Opcional, puede ser inicializado vacío
}
export interface UpdateComandoDto {
    nombreComando?: string;
    estadoComando?: boolean;
    ubicacionComando?: string;
    fundacionId?: string;
    brigadas?: string[];
}