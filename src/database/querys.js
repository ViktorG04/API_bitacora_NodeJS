
export const querys = {

    listEEPS: 'EXEC listEEPS @A, @id',
    IUEntity: 'EXEC IUEntity @A, @id, @nm, @tp, @es',
    getSearch:   'EXEC searchEP @A, @value',
    getEstate: 'EXEC CrupState @A, @id',
    getRol: 'EXEC CrupRol @A, @id, @var',
    getArea: 'EXEC CrupAreas @A, @id, @var, @es, @cap',
    getTipEmp: 'EXEC CrupTipEmp @A, @id',
    validateDocandEmail: 'EXEC ValidationUser @A, @var',
    getDataEmployee: 'EXEC dataEmployee @A, @id',
    getEmployee: 'EXEC IUUsers @A, @user, @co, @pas, @nom, @doc, @rol, @em, @est, @id',
    getPersons: 'EXEC IUPersons @A, @nom, @doc, @emp, @est, @id',
    getLogin: 'EXEC UserLogin @email',
    listSolicitudes: 'EXEC listSolicitudes @id, @rol',
    getDetalleSolicitud: 'EXEC detalleSolicitudes @A, @id',
    getSolicitud: 'EXEC updateSolicitud @id, @est',
    getDataSolicitud: 'EXEC dataSolicitud @A, @id',
    postPutSolicitud: 'EXEC ISolicitud @A, @user, @fech, @mo, @area, @est',
    postDSolicitud: 'EXEC IDSolicitud @sol, @per',
    postDIngreso: 'EXEC IIngreso @temp, @idDP',
    getCapacidad: 'EXEC capacidadIngress @A, @est, @area, @fech, @id',
    IIncapacidad: 'EXEC IIncapacidad @A, @numI, @emp, @fechI, @fechF, @mot, @id',
    crupFormulario: 'EXEC crupFormulario @A, @detaS, @pre, @res',
    getNexEpidemiological: ' EXEC listPeople15days @fech',

};