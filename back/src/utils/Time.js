/**
 * Convierte una fecha y hora a UTC.
 * 
 * @param {string} dateTimeString - La cadena de fecha y hora a convertir. Debe ser 
 * un formato reconocible por el constructor `Date` de JavaScript.
 *
 * @returns {Date} - Devuelve un objeto `Date` ajustado a UTC.
 * 
 * @throws {Error} - Si la cadena de entrada no puede convertirse a un objeto `Date`.
 */
export const getUTCTime = (dateTimeString) => {
    const dt = new Date(dateTimeString);
    const dtNumber = dt.getTime();
    const dtOffset = dt.getTimezoneOffset() * 60000;
    const dtUTC = new Date();
    dtUTC.setTime(dtNumber - dtOffset);

    return dtUTC;
}


/**
 * Obtiene la fecha y hora actual ajustada a la zona horaria de Perú.
 * 
 * @returns {Date} - Devuelve un objeto `Date` que representa la fecha y hora actual 
 * ajustada a la zona horaria de Perú.
 */

export const getPeruTime = () => {
    const ahoraUTC = new Date();
    const diffHorariaPeru = -5;

    const fechaAhora = new Date(
      ahoraUTC.getTime() + diffHorariaPeru * 60 * 60 * 1000
    );
  
    return fechaAhora;
  };