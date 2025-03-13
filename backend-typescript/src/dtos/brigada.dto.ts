export interface CreateBrigadaDto {
    nombreBrigada: string;
    ubicacionBrigada: string;
    estadoBrigada?: boolean; // Opcional, ya que tiene un valor por defecto
    comandoId: string;
    unidades?: string[]; // Opcional, puede ser inicializado vacío
}
export interface UpdateBrigadaDto {
    nombreBrigada?: string;
    ubicacionBrigada?: string;
    estadoBrigada?: boolean;
    comandoId?: string;
    unidades?: string[];
}