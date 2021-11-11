import { getConnection, querys } from "../database";

//all areas
export const getAllReportes = async (req, res) => {

  var resultS, resulPS;

  resultS = await consultReportes('LTS', '', '', '');

  resulPS = await consultReportes('LSS', '', '', '');

  for (const i in resulPS) {
    for (const x in resultS) {
      if (resultS[x]['idSolicitud'] == resulPS[i]['idSolicitud']) {
        if (resultS[x]['idDetalle'] == resulPS[i]['idDetalle']) {
          resultS[x].temperatura = resulPS[i]['temperatura'];
          resultS[x].fechaHoraIngreso = resulPS[i]['fechaHoraIngreso'];
          resultS[x].fechaHoraSalida = resulPS[i]['fechaHoraSalida'];
        }
      }
    }
  }
  res.json(resultS);
};


//reporte por rango fecha
export const getAllReportesBydate = async (req, res) => {
  const { fechaI, fechaF } = req.body;
  var resultS, resulPS;
  var filtro = [];

  resultS = await consultReportes('LTS', '', '', '');

  resulPS = await consultReportes('LSF', fechaI, fechaF, '');

  for (const i in resulPS) {
    for (const x in resultS) {
      if (resultS[x]['idSolicitud'] == resulPS[i]['idSolicitud']) {
        if (resultS[x]['idDetalle'] == resulPS[i]['idDetalle']) {
          resultS[x].temperatura = resulPS[i]['temperatura'];
          resultS[x].fechaHoraIngreso = resulPS[i]['fechaHoraIngreso'];
          resultS[x].fechaHoraSalida = resulPS[i]['fechaHoraSalida'];
          filtro.push(resultS[x]);
        }
      }
    }
  }

  res.json(filtro);
};


//reporte de visitas por una area
export const getAllVisitasByArea = async (req, res) => {
  var id = req.params.id
  var resultS, resulPS;
  var filtro = [];

  resultS = await consultReportes('LSA', '', '', id);

  resulPS = await consultReportes('LSS', '', '', '');

  for (const i in resulPS) {
    for (const x in resultS) {
      if (resultS[x]['idSolicitud'] == resulPS[i]['idSolicitud']) {
        if (resultS[x]['idDetalle'] == resulPS[i]['idDetalle']) {
          resultS[x].temperatura = resulPS[i]['temperatura'];
          resultS[x].fechaHoraIngreso = resulPS[i]['fechaHoraIngreso'];
          resultS[x].fechaHoraSalida = resulPS[i]['fechaHoraSalida'];
          filtro.push(resultS[x]);
        }
      }
    }
  }

  res.json(filtro);
};

//reporte por rango fecha para una oficina
export const getAllAreaFech = async (req, res) => {
  const { fechaI, fechaF, idArea } = req.body;
  var resultS, resulPS;
  var filtro = [];

  resultS = await consultReportes('LSA', '', '', idArea);

  resulPS = await consultReportes('LSF', fechaI, fechaF, '');

  for (const i in resulPS) {
    for (const x in resultS) {
      if (resultS[x]['idSolicitud'] == resulPS[i]['idSolicitud']) {
        if (resultS[x]['idDetalle'] == resulPS[i]['idDetalle']) {
          resultS[x].temperatura = resulPS[i]['temperatura'];
          resultS[x].fechaHoraIngreso = resulPS[i]['fechaHoraIngreso'];
          resultS[x].fechaHoraSalida = resulPS[i]['fechaHoraSalida'];
          filtro.push(resultS[x]);
        }
      }
    }
  }

  res.json(filtro);
};

//all solicitudes by date
export const getAllSolicidByDate = async (req, res) => {
  const { fecha } = req.body;
  var resultS, fechaLike;

  fechaLike = fecha + '%';
  resultS = await consultReportes('BSF', fechaLike, '', '')

  res.json(resultS);
};


//function crup in database
async function consultReportes(action, fechaInicio, fechaFin, area) {
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("A", action)
      .input("fechaI", fechaInicio)
      .input("fechaF", fechaFin)
      .input("area", area)
      .query(querys.getReportes);
    return result.recordset;
  }
  catch (error) {
    console.error(error);
  }
};