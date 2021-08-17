use bitacora;

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[rol]') AND type in (N'U'))
DROP TABLE [dbo].[rol]

create table rol(
idRol int not null IDENTITY(1,1),
rol varchar(20) not null,
primary key(idRol));

INSERT INTO rol(rol) VALUES('RRHH');
INSERT INTO rol(rol) VALUES('jefe');
INSERT INTO rol(rol) VALUES('empleado');
INSERT INTO rol(rol) VALUES('Seguridad');


IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[estado]') AND type in (N'U'))
DROP TABLE [dbo].[estado]

create table estado(
idEstado int not null IDENTITY(1,1),
estado varchar(12) not null,
primary key(idEstado));

INSERT INTO estado(estado) VALUES('Activo');
INSERT INTO estado(estado) VALUES('Inactivo');
INSERT INTO estado(estado) VALUES('Aprobado');
INSERT INTO estado(estado) VALUES('Rechazado');
INSERT INTO estado(estado) VALUES('Pendiente');
INSERT INTO estado(estado) VALUES('En Progreso');
INSERT INTO estado(estado) VALUES('Finalizado');
INSERT INTO estado(estado) VALUES('Cancelado');

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[areas]') AND type in (N'U'))
DROP TABLE [dbo].[areas]

create table areas(
idArea int not null IDENTITY(1,1),
descripcion varchar(20) not null,
idEstado int not null,
primary key(idArea),
foreign key(idEstado) references estado(idEstado));

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usuario]') AND type in (N'U'))
DROP TABLE [dbo].[usuario]

create table usuario(
 idUsuario int not Null  IDENTITY(1,1),
 usuario varchar(30) not null,
 correo varchar(30) not null,
 pass varchar(12) not null,
 idRol int not null
 primary key(idUsuario),
 foreign key(idRol) references rol(idRol));

 Insert into usuario(usuario, correo, pass, idRol)
 values ('admin', '2534322013@gmail.com',  '123456', '1');

 IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tipov]') AND type in (N'U'))
DROP TABLE [dbo].[tipov]

create table tipov(
idTipo int not null IDENTITY(1,1),
tipo varchar(20) not null
primary key(idTipo));

INSERT INTO tipov(tipo) VALUES('Interno');
INSERT INTO tipov(tipo) VALUES('Cliente');
INSERT INTO tipov(tipo) VALUES('Proveedor');
INSERT INTO tipov(tipo) VALUES('Particular');

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[empresa]') AND type in (N'U'))
DROP TABLE [dbo].[empresa]

create table empresa(
idEmpresa int not null IDENTITY(1,1),
nombre varchar(50) not null,
idTipo int not null,
idEstado int not null,
primary key(idEmpresa),
foreign key(idTipo) references tipov(idTipo),
foreign Key(idEstado) references estado(idEstado));

INSERT INTO empresa(nombre, idTipo, idEstado) VALUES('Empresa S.A de C.V', 1, 1);

 IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[personas]') AND type in (N'U'))
DROP TABLE [dbo].[personas]

create table personas(
idPersona int not null IDENTITY(1,1),
nombreCompleto varchar(60) not null,
docIdentidad varchar(20) not null,
idEmpresa int not null,
idEmpleado int,
idEstado int not null,
fechayHoraCreacion datetime not null,
primary key(idPersona),
foreign key(idEmpresa) references empresa(idEmpresa),
foreign key(idEmpleado) references usuario(idUsuario),
foreign key(idEstado) references estado(idEstado));

INSERT INTO personas(nombreCompleto, docIdentidad, idEmpresa, idEmpleado, idEstado, fechayHoraCreacion) VALUES('administrador 1', '0616041291-1', 1, 1, 1, SYSDATETIMEOffset());

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[preguntas]') AND type in (N'U'))
DROP TABLE [dbo].[preguntas]

create table preguntas(
idPregunta int not null IDENTITY(1,1),
descripcion text not null
primary key(idPregunta));

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[formulario]') AND type in (N'U'))
DROP TABLE [dbo].[formulario]

create table formulario(
idFormulario int not null IDENTITY(1,1),
idPregunta int not null,
respuesta char(1)
primary key(idFormulario),
foreign key(idPregunta) references preguntas(idPregunta));

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[solicitud]') AND type in (N'U'))
DROP TABLE [dbo].[solicitud]

create table solicitud (
idSolicitud int not null IDENTITY(1,1),
idUsuario int not null,
fechaCreacion datetime not null,
fechayHoraVisita DATETIME not null,
motivo text not null,
idEstado int not null,
idArea int not null,
primary key(idSolicitud),
foreign key(idEstado) references estado(idEstado),
foreign key(idArea) references areas(idArea),
foreign key(idUsuario) references usuario(idUsuario));

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[detallesolicitud]') AND type in (N'U'))
DROP TABLE [dbo].[detallesolicitud]

create table detallesolicitud(
idDetalle int not null IDENTITY(1,1),
idSolicituDe int not null,
idVisitante int not null,
idFormulario int not null,
primary key(idDetalle),
foreign key(idSolicituDe) references solicitud(idSolicitud),
foreign key(idVisitante) references personas(idPersona),
foreign key(idFormulario) references formulario(idFormulario));

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[detalleingreso]') AND type in (N'U'))
DROP TABLE [dbo].[detalleingreso]

create table detalleingreso(
idIngreso int not null IDENTITY(1,1),
fechaHoraIngreso datetime not null,
fechaHoraSalida datetime not null,
temperatura decimal(3,2) not null,
idDetalle int not null,
primary key(idIngreso),
foreign key(idDetalle) references detallesolicitud(idDetalle));

GO;

------------Store Procedures ------------

---validar login -----
GO
CREATE PROCEDURE UserLogin
@corr varchar(30),
@pass varchar(12)
AS
BEGIN
	SELECT idUsuario, correo, pass, idRol, nombreCompleto, idEstado AS estado FROM usuario 
	INNER JOIN personas ON personas.idEmpleado = usuario.idUsuario
	WHERE correo = @corr AND pass = @pass;
END
GO;

---validar campos usuario-----
GO
CREATE PROCEDURE ValidationUser
@action char(1),
@var varchar(30)
AS
	IF(@action = 'D')
	BEGIN
		SELECT count(idPersona) AS V FROM personas WHERE docIdentidad LIKE @var;
	END
	IF(@action = 'C')
	BEGIN
		SELECT count(idUsuario) AS V FROM usuario WHERE correo LIKE @var;
	END
GO;


--store procedure: states ---
GO
CREATE PROCEDURE CrupState
@action char(1),
@id int
AS
	IF(@action = 'L')
	BEGIN
		SELECT * FROM estado;
	END
	IF(@action = 'B')
	BEGIN
		SELECT * FROM estado WHERE idEstado = @id;
	END
GO;


--store procedure: rol ---
 GO
CREATE PROCEDURE CrupRol
@action char(1),
@id int,
@var varchar(20)
AS
	IF(@action = 'L')
	BEGIN
		SELECT * FROM rol;
	END
	IF(@action = 'B')
	BEGIN
		SELECT * FROM rol WHERE idRol = @id;
	END
	IF(@action = 'I')
	BEGIN
		INSERT INTO rol(rol) VALUES(@var);
	END
	IF(@action = 'U')
	BEGIN
		UPDATE rol SET rol = @var WHERE idRol = @id;
	END

GO;


---store procedure: areas ----
GO
CREATE PROCEDURE CrupAreas
	@action char(1),
	@id int,
	@des varchar(20),
	@est int
AS
IF(@action = 'L')
BEGIN
	SELECT * FROM areas;
END
IF(@action = 'B')
BEGIN
	SELECT * FROM areas WHERE idArea = @id;
END
IF(@action = 'I')
BEGIN
	INSERT INTO areas(descripcion, idEstado) VALUES(@des, @est);
END
IF(@action = 'U')
BEGIN
	UPDATE areas SET descripcion = @des, idEstado = @est WHERE idArea = @id;
END
IF(@action = 'D')
BEGIN
	DELETE areas WHERE idArea = @id;
END;
GO;


---store procedure: entidades ----
GO
CREATE PROCEDURE IUEmpresa
@action char(1),
@id int,
@var varchar(50),
@tip int,
@es int
AS
	IF(@action = 'I')
	BEGIN
		INSERT INTO empresa(nombre, idTipo, idEstado) VALUES(@var,@tip,@es);
		SELECT @@IDENTITY as ID;
	END
	IF(@action = 'U')
	BEGIN
		UPDATE empresa SET nombre = @var, idTipo = @tip, idEstado = @es WHERE idEmpresa = @id;
		IF(@es = 2)
		BEGIN
			UPDATE personas SET personas.idEstado = @es WHERE personas.idEmpresa=@id;
		END
	END
GO;


---store procedure: tipo-empresa ----
GO
CREATE PROCEDURE CrupTipEmp
@action char(1),
@id int
AS
	IF(@action = 'L')
	BEGIN
		SELECT * FROM tipov;
	END
	IF(@action = 'B')
	BEGIN
		SELECT * FROM tipov WHERE idTipo = @id;
	END
GO;


--- Store procedures: preguntas ----
GO
CREATE PROCEDURE CrupPregunta
@id int,
@action char(1),
@var text
AS
	IF(@action = 'L')
	BEGIN
		SELECT * FROM preguntas;
	END
	IF(@action = 'B')
	BEGIN
		SELECT * FROM preguntas WHERE idPregunta = @id;
	END
	IF(@action = 'I')
	BEGIN
		INSERT INTO preguntas(descripcion) VALUES(@var);
	END
	IF(@action = 'U')
	BEGIN
		UPDATE preguntas SET descripcion = @var WHERE idPregunta = @id;
	END
	IF(@action = 'D')
	BEGIN
		DELETE preguntas WHERE idPregunta = @id;
	END
GO;


--- store procedure: users ----
GO
CREATE PROCEDURE IUUsers
@action char(1),
@user varchar(30),
@corr varchar(30),
@pass varchar(12),
@nom varchar(60),
@doc varchar(20),
@rol int,
@emp int,
@est int,
@id int
AS
	IF(@action = 'I')
	BEGIN
		-----Insert user ----
		INSERT INTO usuario(usuario, correo, pass, idRol) VALUES(@user, @corr, @pass, @rol);

		INSERT INTO personas(nombreCompleto, docIdentidad, idEmpresa, idEmpleado, idEstado, fechayHoraCreacion) 
		VALUES( @nom, @doc, @emp, (SELECT @@IDENTITY as ID), @est, SYSDATETIMEOffset());
	END
	IF(@action = 'U')
	BEGIN
		---Update table user---
		UPDATE usuario SET usuario = @user, correo = @corr, pass = @pass, idRol = @rol WHERE idUsuario = @id;

		---update table persons----
		UPDATE personas SET nombreCompleto = @nom, docIdentidad = @doc, idEstado = @est WHERE idEmpleado = @id;
	END
GO;

GO
CREATE PROCEDURE IUPersons
@action char(1),
@nom varchar(60),
@doc varchar(20),
@emp int,
@est int,
@id int
AS
	IF(@action = 'I')
	BEGIN
		----insertar personas ---
		INSERT INTO personas(nombreCompleto, docIdentidad, idEmpresa, idEstado, fechayHoraCreacion) 
		VALUES( @nom, @doc, @emp, @est, SYSDATETIMEOffset());
		SELECT @@IDENTITY as ID;
	END
	IF(@action = 'U')
	BEGIN
		--Actualizar Personas ---
		UPDATE personas SET nombreCompleto = @nom, docIdentidad = @doc, idEmpresa = @emp,
		 idEstado = @est WHERE idPersona = @id;
	END
GO;

GO
CREATE PROCEDURE searchEP
@action char(1),
@var varchar(8)
AS
	IF(@action = 'P')
	BEGIN
		--Buscar Personas ---
		SELECT idPersona, nombreCompleto, docIdentidad FROM personas WHERE idEstado = 1 AND nombreCompleto LIKE @var;
	END
	IF(@action = 'E')
	BEGIN
		--buscar empresas---
		SELECT nombre, empresa.idTipo, tipo FROM empresa INNER JOIN tipov ON empresa.idTipo = tipov.idTipo
		WHERE idEstado = 1 AND nombre LIKE @var;
	END
GO;

GO
CREATE PROCEDURE listEEPS
@action char(3),
@id int
AS
	IF(@action = 'LTE')
	BEGIN
		---list all companies
		SELECT idEmpresa, nombre, empresa.idTipo, tipo, idEstado FROM empresa
		INNER JOIN tipov ON empresa.idTipo = tipov.idTipo;
	END
	IF(@action = 'LTP')
	BEGIN
		---list all people---
		SELECT idPersona, nombreCompleto, docIdentidad, nombre AS empresa, estado FROM personas INNER JOIN empresa
		ON personas.idEmpresa = empresa.idEmpresa INNER JOIN estado ON estado.idEstado = personas.idEstado
	END
	IF(@action = 'BP')
	BEGIN
		--search person ---
		SELECT idPersona, nombreCompleto, docIdentidad, P.idEmpresa, E.nombre AS empresa, P.idEstado FROM personas AS P INNER JOIN
		empresa AS E ON P.idEmpresa = E.idEmpresa WHERE idPersona = @id;
	END
	IF(@action = 'BE')
	BEGIN
		----search employee ---
		SELECT idPersona, idUsuario, usuario, nombreCompleto, docIdentidad, correo, idRol, pass, idEstado, idEmpresa
		FROM personas INNER JOIN usuario ON personas.idEmpleado = usuario.idUsuario
		WHERE idPersona = @id;
	END
	IF(@action = 'LPE')
	BEGIN
		---list people by company---
		SELECT idPersona, nombreCompleto, docIdentidad, nombre, estado FROM personas INNER JOIN empresa
		ON personas.idEmpresa = empresa.idEmpresa INNER JOIN estado ON estado.idEstado = personas.idEstado
		WHERE personas.idEmpresa = @id;
	END;