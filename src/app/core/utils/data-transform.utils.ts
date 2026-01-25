/**
 * Utilidades para transformación de datos entre frontend y backend
 * Centraliza las conversiones para evitar redundancias y inconsistencias
 */

export class DataTransformUtils {

  /**
   * Transforma género del formato del backend al formato del frontend
   * @param genero - Género desde backend ("Male", "Female", "MASCULINO", "FEMENINO")
   * @returns Género en formato frontend ("Male", "Female")
   */
  static transformarGeneroBackendToFrontend(genero: string | null | undefined): string {
    if (!genero) return '';
    
    const generoLower = genero.toLowerCase().trim();
    
    // Si ya está en el formato correcto (inglés), devolverlo con capitalización correcta
    if (generoLower === 'male' || generoLower === 'female') {
      return genero.charAt(0).toUpperCase() + genero.slice(1).toLowerCase();
    }
    
    // Mapear de español a inglés
    if (generoLower === 'masculino' || generoLower === 'm') {
      return 'Male';
    }
    if (generoLower === 'femenino' || generoLower === 'f') {
      return 'Female';
    }
    
    // Valor por defecto
    return '';
  }

  /**
   * Transforma género del formato del frontend al formato del backend (para datos personalizados)
   * @param genero - Género desde frontend ("Male", "Female")
   * @returns Género en formato backend ("Male", "Female")
   */
  static transformarGeneroFrontendToBackend(genero: string): string {
    if (!genero) return '';
    
    const generoLower = genero.toLowerCase().trim();
    
    if (generoLower === 'male' || generoLower === 'female') {
      return genero.charAt(0).toUpperCase() + genero.slice(1).toLowerCase();
    }
    
    return '';
  }

  /**
   * Transforma valor Yes/No a booleano
   * @param valor - String "Yes" o "No"
   * @returns Boolean true/false
   */
  static yesNoToBoolean(valor: string | null | undefined): boolean {
    if (!valor) return false;
    return valor.toLowerCase().trim() === 'yes';
  }

  /**
   * Transforma booleano a Yes/No
   * @param valor - Boolean true/false
   * @returns String "Yes"/"No"
   */
  static booleanToYesNo(valor: boolean | null | undefined): string {
    if (valor === null || valor === undefined) return 'No';
    return valor ? 'Yes' : 'No';
  }

  /**
   * Transforma valor Yes/No a número (0/1)
   * @param valor - String "Yes" o "No"
   * @returns Número 1/0
   */
  static yesNoToNumber(valor: string | null | undefined): number {
    if (!valor) return 0;
    return valor.toLowerCase().trim() === 'yes' ? 1 : 0;
  }

  /**
   * Valida si un género está en formato correcto
   * @param genero - Género a validar
   * @returns true si es válido
   */
  static esGeneroValido(genero: string): boolean {
    if (!genero) return false;
    const generoLower = genero.toLowerCase().trim();
    return generoLower === 'male' || generoLower === 'female';
  }

  /**
   * Valida si un valor Yes/No es correcto
   * @param valor - Valor a validar
   * @returns true si es válido
   */
  static esYesNoValido(valor: string): boolean {
    if (!valor) return false;
    const valorLower = valor.toLowerCase().trim();
    return valorLower === 'yes' || valorLower === 'no';
  }

  /**
   * Mapea método de pago del formato español al inglés
   * @param metodoPago - Método en español
   * @returns Método en inglés
   */
  static mapearMetodoPagoEspanolToIngles(metodoPago: string): string {
    if (!metodoPago) return '';
    
    const mapeo: { [key: string]: string } = {
      'E-wallet': 'Electronic check',
      'Pagos QR': 'Mailed check',
      'Débito': 'Bank transfer (automatic)',
      'Crédito': 'Credit card (automatic)',
      'Tarjeta Prepago': 'Electronic check'
    };
    
    return mapeo[metodoPago] || metodoPago;
  }

  /**
   * Mapea servicio de internet del formato español al inglés
   * @param servicio - Servicio en español
   * @returns Servicio en inglés
   */
  static mapearServicioInternetEspanolToIngles(servicio: string): string {
    if (!servicio) return '';
    
    const mapeo: { [key: string]: string } = {
      'Cable Coaxial': 'DSL',
      'Fibra Óptica': 'Fiber optic',
      'No': 'No'
    };
    
    return mapeo[servicio] || servicio;
  }
}