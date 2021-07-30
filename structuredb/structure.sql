drop database if exists bitacora;

create database bitacora;

use bitacora;

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[rol]') AND type in (N'U'))
DROP TABLE [dbo].[rol]

create table rol(
idRol int not null IDENTITY(1,1),
rol varchar(20) not null,
primary key(idRol));

INSERT INTO rol(rol) VALUES('administrador');


IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[estadousuario]') AND type in (N'U'))
DROP TABLE [dbo].[estadousuario]

create table estadousuario(
idEstado int not null IDENTITY(1,1),
estado varchar(12) not null,
primary key(idEstado));

INSERT INTO estadousuario(estado) VALUES('Activo');
INSERT INTO estadousuario(estado) VALUES('Inactivo');

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[estadosolicitudes]') AND type in (N'U'))
DROP TABLE [dbo].[estadosolicitudes]

create table estadosolicitudes(
idEstado int not null IDENTITY(1,1),
estado varchar(12) not null,
primary key(idEstado));

INSERT INTO estadosolicitudes(estado) VALUES('Aprobado');
INSERT INTO estadosolicitudes(estado) VALUES('Rechazado');
INSERT INTO estadosolicitudes(estado) VALUES('Pendiente');
INSERT INTO estadosolicitudes(estado) VALUES('Finalizado');

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[areas]') AND type in (N'U'))
DROP TABLE [dbo].[areas]

create table areas(
idArea int not null IDENTITY(1,1),
descripcion varchar(20) not null,
capacidad int not null,
primary key(idArea));

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usuario]') AND type in (N'U'))
DROP TABLE [dbo].[usuario]

create table usuario(
 idUsuario int not Null  IDENTITY(1,1),
 nombreCompleto varchar(30) not null,
 carnet varchar(30) not null,
 correo varchar(30) not null,
 pass varchar(50) not null,
 idRol int not null,
 idEstado int not null,
 primary key(idUsuario),
 foreign key(idRol) references rol(idRol),
 foreign key(idEstado) references estadousuario(idEstado));

 Insert into usuario(nombreCompleto, carnet, correo, pass, idRol, idEstado)
 values ('admin', '2534322013', '2534322013@gmail.com',  '123456', '1', '1');


IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tipov]') AND type in (N'U'))
DROP TABLE [dbo].[tipov]

create table tipov(
idTipo int not null IDENTITY(1,1),
tipo varchar(20) not null
primary key(idTipo));

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[entidad]') AND type in (N'U'))
DROP TABLE [dbo].[entidad]

create table entidad(
idEntidad int not null IDENTITY(1,1),
entidad varchar(20) not null,
primary key(idEntidad));

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[visitante]') AND type in (N'U'))
DROP TABLE [dbo].[visitante]

create table visitante(
idVisitante int not null IDENTITY(1,1),
idEntidad int not null,
idTipoVi int not null,
nombreVisitante varchar(30) not null,
idEstado int not null,
primary key(idVisitante),
foreign key(idEntidad) references entidad(idEntidad),
foreign key(idTipoVi) references tipov(idTipo),
foreign key(idEstado) references estadousuario(idEstado));


IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[preguntas]') AND type in (N'U'))
DROP TABLE [dbo].[preguntas]

create table preguntas(
idPregunta int not null IDENTITY(1,1),
descripcion varchar(100) not null
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
fechaVisita date not null,
horaVisita time not null,
motivo text not null,
idEstado int not null,
idArea int not null,
idFormulario int not null,
primary key(idSolicitud),
foreign key(idEstado) references estadosolicitudes(idEstado),
foreign key(idArea) references areas(idArea),
foreign key(idFormulario) references formulario(idFormulario));

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[detallesolicitud]') AND type in (N'U'))
DROP TABLE [dbo].[detallesolicitud]

create table detallesolicitud(
idDetalle int not null IDENTITY(1,1),
idSolicituDe int not null,
idEmpleado int not null,
idVisitanteDe int not null,
primary key(idDetalle),
foreign key(idSolicituDe) references solicitud(idSolicitud),
foreign key(idEmpleado) references Usuario(idUsuario),
foreign key(idVisitanteDe) references visitante(idVisitante));

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[detalleingreso]') AND type in (N'U'))
DROP TABLE [dbo].[detalleingreso]

create table detalleingreso(
idIngreso int not null IDENTITY(1,1),
fechaHoraIngreso datetime not null,
fechaHoraSalida datetime not null,
temperatura decimal(3,2) not null,
idDetalle int not null,
idEstado int not null,
primary key(idIngreso),
foreign key(idDetalle) references detallesolicitud(idDetalle),
foreign key(idEstado) references estadosolicitudes(idEstado));

--store procedure: states ---
GO
CREATE PROCEDURE CrupState
	@id int,
	@action char(2)
AS
IF(@action = 'LU')
BEGIN
	SELECT * FROM estadousuario;
END
IF(@action = 'BU')
BEGIN
	SELECT * FROM estadousuario WHERE idEstado = @id;
END
IF(@action = 'LS')
BEGIN
	SELECT * FROM estadosolicitudes;
END
IF(@action = 'BS')
BEGIN
	SELECT * FROM estadosolicitudes WHERE idEstado = @id;
END;

--store procedure: rol ---
 GO
CREATE PROCEDURE CrupRol
	@id int,
	@action char(1),
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
IF(@action = 'D')
BEGIN
	DELETE rol WHERE idRol = @id;
END;

---store procedure: areas ----
GO
CREATE PROCEDURE CrupAreas
	@id int,
	@action char(1),
	@des varchar(20),
	@capa int
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
	INSERT INTO areas(descripcion, capacidad) VALUES(@des, @capa);
END
IF(@action = 'U')
BEGIN
	UPDATE areas SET descripcion = @des, capacidad = @capa WHERE idArea = @id;
END
IF(@action = 'D')
BEGIN
	DELETE areas WHERE idArea = @id;
END;

--- store procedure: users ----
GO
CREATE PROCEDURE CrupUsers
	@id int,
	@action char(1)
AS
IF(@action = 'L')
BEGIN
	SELECT * FROM usuario;
END
IF(@action = 'B')
BEGIN
	SELECT * FROM usuario WHERE idUsuario = @id;
END;