
export const querys = {

    listEEPS: 'EXEC listEEPS @A, @id',
    IUEntity: 'EXEC IUEntity @A, @id, @nm, @tp, @es',
    getSearch:   'EXEC searchEP @A, @value',
    getEstate: 'EXEC CrupState @A, @id',
    getRol: 'EXEC CrupRol @A, @id, @var',
    getArea: 'EXEC CrupAreas @A, @id, @var, @es',
    getTipEmp: 'EXEC CrupTipEmp @A, @id',
    validatePerson: 'EXEC ValidationUser @A, @var',
    getEmployee: 'EXEC IUUsers @A, @user, @co, @pas, @nom, @doc, @rol, @em, @est, @id',
    getPersons: 'EXEC IUPersons @A, @nom, @doc, @emp, @est, @id',
    getLogin: 'EXEC UserLogin @email, @pass',
    listSolicitudes: 'EXEC listSolicitudes @A, @id',
};