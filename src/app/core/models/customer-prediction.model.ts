export interface CustomerInput {
  id_cliente: string;
  genero: string;
  adulto_mayor: number;
  tiene_pareja: string;
  tiene_dependientes: string;
  antiguedad_meses: number;
  servicio_telefono: string;
  lineas_multiples: string;
  servicio_internet: string;
  seguridad_en_linea: string;
  respaldo_en_linea: string;
  proteccion_dispositivo: string;
  soporte_tecnico: string;
  streaming_tv: string;
  streaming_peliculas: string;
  tipo_contrato: string;
  facturacion_electronica: string;
  metodo_pago: string;
  cargo_mensual: number;
  cargos_totales: number;
}

export interface PredictionOutput {
  id_cliente: string;
  prevision: string;
  abandono_cliente: boolean;
  probabilidad: number;
}
