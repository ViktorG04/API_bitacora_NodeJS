import { getConnection, querys } from "../database";

//all areas
export const getAllReportes = async (req, res) => {

  var resultS, resulPS;

  resultS = await consultReportes('LT', '');

  resulPS = await consultReportes('LS', '')

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

//all solicitudes by date
export const getAllSolicidByDate = async (req, res) => {
  const { fecha } = req.body;
  var resultS, fechaLike;

  fechaLike = fecha + '%';
  resultS = await consultReportes('SF', fechaLike)

  res.json(resultS);
};


//function crup in database
async function consultReportes(action, fechaInicio) {
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("A", action)
      .input("fechaI", fechaInicio)
      .query(querys.getReportes);
    return result.recordset;
  }
  catch (error) {
    console.error(error);
  }
};