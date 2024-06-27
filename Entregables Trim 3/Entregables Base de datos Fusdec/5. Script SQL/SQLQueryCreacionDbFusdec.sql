CREATE DATABASE DB_Fundacion
GO

USE DB_Fundacion
GO
CREATE TABLE Administrador 
    (
     IdRol INTEGER NOT NULL , 
     IdAdministrador INTEGER NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id del rol' , 'USER' , 'dbo' , 'TABLE' , 'Administrador' , 'COLUMN' , 'IdRol' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id del  administrador' , 'USER' , 'dbo' , 'TABLE' , 'Administrador' , 'COLUMN' , 'IdAdministrador' 
GO

ALTER TABLE Administrador ADD CONSTRAINT Administrador_PK PRIMARY KEY CLUSTERED (IdRol, IdAdministrador)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO
ALTER TABLE Administrador ADD CONSTRAINT Administrador_PKv1 UNIQUE NONCLUSTERED (IdAdministrador)
GO

CREATE TABLE Administrador_Colegio 
    (
     Administrador_IdRol INTEGER NOT NULL , 
     colegio_IdColegio INTEGER NOT NULL , 
     Administrador_IdAdministrador INTEGER NOT NULL 
    )
GO

ALTER TABLE Administrador_Colegio ADD CONSTRAINT Administrador_Colegio_PK PRIMARY KEY CLUSTERED (Administrador_IdRol, colegio_IdColegio)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE AsignacionReporteIn 
    (
     Inasistencia_IdInasistencia INTEGER NOT NULL , 
     colegio_IdColegio INTEGER NOT NULL 
    )
GO

CREATE TABLE AsignacionRol 
    (
     Usuario_IdUsuario INTEGER NOT NULL , 
     Rol_IdRol INTEGER NOT NULL 
    )
GO

ALTER TABLE AsignacionRol ADD CONSTRAINT AsignacionRol_PK PRIMARY KEY CLUSTERED (Rol_IdRol, Usuario_IdUsuario)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE AsignarCalificacion 
    (
     Calificacion_IdCalificacion INTEGER NOT NULL , 
     Registro_IdRegistro INTEGER NOT NULL 
    )
GO

ALTER TABLE AsignarCalificacion ADD CONSTRAINT AsignarCalificacion_PK PRIMARY KEY CLUSTERED (Calificacion_IdCalificacion)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Auditoria 
    (
     IdAuditoria INTEGER NOT NULL , 
     FechaAuditoria DATE NOT NULL , 
     NombreQuienExpidio NVARCHAR (256) NOT NULL , 
     Certificado_IdCertificado INTEGER NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el uid de la auditoria para cada certificado' , 'USER' , 'dbo' , 'TABLE' , 'Auditoria' , 'COLUMN' , 'IdAuditoria' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene la fecha en que el certificado fue expedido' , 'USER' , 'dbo' , 'TABLE' , 'Auditoria' , 'COLUMN' , 'FechaAuditoria' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el nombre de la persona que expidio el certificado' , 'USER' , 'dbo' , 'TABLE' , 'Auditoria' , 'COLUMN' , 'NombreQuienExpidio' 
GO

    


CREATE UNIQUE NONCLUSTERED INDEX 
    Auditoria__IDX ON Auditoria 
    ( 
     Certificado_IdCertificado 
    ) 
GO

ALTER TABLE Auditoria ADD CONSTRAINT Auditoria_PK PRIMARY KEY CLUSTERED (IdAuditoria)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE brigada 
    (
     IdBrigada INTEGER NOT NULL , 
     NombreBrigada NVARCHAR (256) NOT NULL , 
     Comando_IdComando INTEGER NOT NULL , 
     UbicacionBrigada NVARCHAR (256) NOT NULL , 
     EstadoBrigada BIT NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id de la brigada' , 'USER' , 'dbo' , 'TABLE' , 'brigada' , 'COLUMN' , 'IdBrigada' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el nombre de la brigada' , 'USER' , 'dbo' , 'TABLE' , 'brigada' , 'COLUMN' , 'NombreBrigada' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene la ubicacion de la brigada' , 'USER' , 'dbo' , 'TABLE' , 'brigada' , 'COLUMN' , 'UbicacionBrigada' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el estado de la brigada' , 'USER' , 'dbo' , 'TABLE' , 'brigada' , 'COLUMN' , 'EstadoBrigada' 
GO

ALTER TABLE brigada ADD CONSTRAINT brigada_PK PRIMARY KEY CLUSTERED (IdBrigada)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Calificacion 
    (
     IdReporte INTEGER NOT NULL , 
     IdCalificacion INTEGER NOT NULL , 
     NotaCalificacion BIT NOT NULL , 
     Administrador_IdAdministrador INTEGER NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id del reporte' , 'USER' , 'dbo' , 'TABLE' , 'Calificacion' , 'COLUMN' , 'IdReporte' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id de la edicion' , 'USER' , 'dbo' , 'TABLE' , 'Calificacion' , 'COLUMN' , 'IdCalificacion' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene la calificacion (aprobado, no aprobado)' , 'USER' , 'dbo' , 'TABLE' , 'Calificacion' , 'COLUMN' , 'NotaCalificacion' 
GO

ALTER TABLE Calificacion ADD CONSTRAINT Calificacion_PK PRIMARY KEY CLUSTERED (IdReporte, IdCalificacion)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO
ALTER TABLE Calificacion ADD CONSTRAINT Calificacion_PKv1 UNIQUE NONCLUSTERED (IdCalificacion)
GO

CREATE TABLE Certificado 
    (
     IdCertificado INTEGER NOT NULL , 
     Nombres NVARCHAR (256) NOT NULL , 
     Apellidos NVARCHAR (256) NOT NULL , 
     CodigoVerificador NVARCHAR (256) NOT NULL , 
     QuienExpidio NVARCHAR (256) NOT NULL , 
     NumeroDocumentoUsuario NVARCHAR (256) NOT NULL , 
     persona_IdPersona INTEGER NOT NULL , 
     Administrador_IdAdministrador INTEGER NOT NULL , 
     Curso_IdCurso INTEGER NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el uid del certificado' , 'USER' , 'dbo' , 'TABLE' , 'Certificado' , 'COLUMN' , 'IdCertificado' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene los nombres del usuario que obtuvo el certificado' , 'USER' , 'dbo' , 'TABLE' , 'Certificado' , 'COLUMN' , 'Nombres' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene los apellidos del usuario que obtuvo el certificado' , 'USER' , 'dbo' , 'TABLE' , 'Certificado' , 'COLUMN' , 'Apellidos' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el codigo verificador del certificado' , 'USER' , 'dbo' , 'TABLE' , 'Certificado' , 'COLUMN' , 'CodigoVerificador' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el nombre de la persona que expidio el certificado' , 'USER' , 'dbo' , 'TABLE' , 'Certificado' , 'COLUMN' , 'QuienExpidio' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el numero de cocumento del usuario que obtuvo el certificado' , 'USER' , 'dbo' , 'TABLE' , 'Certificado' , 'COLUMN' , 'NumeroDocumentoUsuario' 
GO

    


CREATE UNIQUE NONCLUSTERED INDEX 
    Certificado__IDX ON Certificado 
    ( 
     persona_IdPersona 
    ) 
GO

ALTER TABLE Certificado ADD CONSTRAINT Certificado_PK PRIMARY KEY CLUSTERED (IdCertificado)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE colegio 
    (
     IdColegio INTEGER NOT NULL , 
     NombreCol NVARCHAR (256) NOT NULL , 
     CodigoCol NVARCHAR (256) NOT NULL , 
     CalleCol NVARCHAR (256) NOT NULL , 
     ZonaDistritoCol NVARCHAR (256) NOT NULL , 
     NumeroCol NVARCHAR (10) NOT NULL , 
     CiudadCol NVARCHAR (256) NOT NULL , 
     CorreoElectronicoCol NVARCHAR (256) NOT NULL , 
     fundacion_IdFundacion INTEGER NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id del colegio' , 'USER' , 'dbo' , 'TABLE' , 'colegio' , 'COLUMN' , 'IdColegio' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el nombre del colegio' , 'USER' , 'dbo' , 'TABLE' , 'colegio' , 'COLUMN' , 'NombreCol' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el codigo del colegio' , 'USER' , 'dbo' , 'TABLE' , 'colegio' , 'COLUMN' , 'CodigoCol' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene la calle del colegio' , 'USER' , 'dbo' , 'TABLE' , 'colegio' , 'COLUMN' , 'CalleCol' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene la zona del colegio' , 'USER' , 'dbo' , 'TABLE' , 'colegio' , 'COLUMN' , 'ZonaDistritoCol' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el numero del colegio' , 'USER' , 'dbo' , 'TABLE' , 'colegio' , 'COLUMN' , 'NumeroCol' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene la ciudad del colegio' , 'USER' , 'dbo' , 'TABLE' , 'colegio' , 'COLUMN' , 'CiudadCol' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el correo del colegio' , 'USER' , 'dbo' , 'TABLE' , 'colegio' , 'COLUMN' , 'CorreoElectronicoCol' 
GO

ALTER TABLE colegio ADD CONSTRAINT colegio_PK PRIMARY KEY CLUSTERED (IdColegio)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Comando 
    (
     IdComando INTEGER NOT NULL , 
     Estado BIT NOT NULL , 
     NombreComando NVARCHAR (256) NOT NULL , 
     UbicacionComando NVARCHAR (256) NOT NULL , 
     fundacion_IdFundacion INTEGER NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id del comando' , 'USER' , 'dbo' , 'TABLE' , 'Comando' , 'COLUMN' , 'IdComando' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el estado del comando' , 'USER' , 'dbo' , 'TABLE' , 'Comando' , 'COLUMN' , 'Estado' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el nombre del comando' , 'USER' , 'dbo' , 'TABLE' , 'Comando' , 'COLUMN' , 'NombreComando' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene la ubicacion del comando' , 'USER' , 'dbo' , 'TABLE' , 'Comando' , 'COLUMN' , 'UbicacionComando' 
GO

ALTER TABLE Comando ADD CONSTRAINT Comando_PK PRIMARY KEY CLUSTERED (IdComando)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Curso 
    (
     IdCurso INTEGER NOT NULL , 
     NombreCurso NVARCHAR (256) NOT NULL , 
     DescripcionCurso NTEXT NOT NULL , 
     IntensidadHorariaCurso NVARCHAR (256) NOT NULL , 
     fundacion_IdFundacion INTEGER NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id del curso' , 'USER' , 'dbo' , 'TABLE' , 'Curso' , 'COLUMN' , 'IdCurso' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el nombre del curso' , 'USER' , 'dbo' , 'TABLE' , 'Curso' , 'COLUMN' , 'NombreCurso' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene una breve descripcion del curso' , 'USER' , 'dbo' , 'TABLE' , 'Curso' , 'COLUMN' , 'DescripcionCurso' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene la intensidad horaria del curso' , 'USER' , 'dbo' , 'TABLE' , 'Curso' , 'COLUMN' , 'IntensidadHorariaCurso' 
GO

ALTER TABLE Curso ADD CONSTRAINT Curso_PK PRIMARY KEY CLUSTERED (IdCurso)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Curso_Administrador 
    (
     Curso_IdCurso INTEGER NOT NULL , 
     Administrador_IdRol INTEGER NOT NULL , 
     Administrador_IdAdministrador INTEGER NOT NULL 
    )
GO

ALTER TABLE Curso_Administrador ADD CONSTRAINT Curso_Administrador_PK PRIMARY KEY CLUSTERED (Curso_IdCurso, Administrador_IdRol)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Edicion 
    (
     IdEdicion INTEGER NOT NULL , 
     FechaInicioEdicion DATE NOT NULL , 
     FechaFinEdicion DATE NOT NULL , 
     Curso_IdCurso INTEGER NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id de la edicion' , 'USER' , 'dbo' , 'TABLE' , 'Edicion' , 'COLUMN' , 'IdEdicion' 
GO

ALTER TABLE Edicion ADD CONSTRAINT Edicion_PK PRIMARY KEY CLUSTERED (IdEdicion)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Funcion 
    (
     IdFunciones INTEGER NOT NULL , 
     NombreFuncion NVARCHAR (256) NOT NULL , 
     DescripcionFuncion NTEXT NOT NULL , 
     SuperAdministrador_IdSA INTEGER NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id de la funcion' , 'USER' , 'dbo' , 'TABLE' , 'Funcion' , 'COLUMN' , 'IdFunciones' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el nombre de la funcion' , 'USER' , 'dbo' , 'TABLE' , 'Funcion' , 'COLUMN' , 'NombreFuncion' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene una explicacion de la funcion' , 'USER' , 'dbo' , 'TABLE' , 'Funcion' , 'COLUMN' , 'DescripcionFuncion' 
GO

ALTER TABLE Funcion ADD CONSTRAINT Funcion_PK PRIMARY KEY CLUSTERED (IdFunciones)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Funciones_Rol 
    (
     Funcion_IdFunciones INTEGER NOT NULL , 
     Rol_IdRol INTEGER NOT NULL 
    )
GO

ALTER TABLE Funciones_Rol ADD CONSTRAINT Funciones_Rol_PK PRIMARY KEY CLUSTERED (Funcion_IdFunciones, Rol_IdRol)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE fundacion 
    (
     IdFundacion INTEGER NOT NULL , 
     NombreFundacion NVARCHAR (256) NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id de la fundcion' , 'USER' , 'dbo' , 'TABLE' , 'fundacion' , 'COLUMN' , 'IdFundacion' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el nombre de la fundacion' , 'USER' , 'dbo' , 'TABLE' , 'fundacion' , 'COLUMN' , 'NombreFundacion' 
GO

ALTER TABLE fundacion ADD CONSTRAINT fundacion_PK PRIMARY KEY CLUSTERED (IdFundacion)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Horario 
    (
     IdHorario INTEGER NOT NULL , 
     FechaInicioHorario DATETIME NOT NULL , 
     FechaFinHorario DATETIME NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id del horario' , 'USER' , 'dbo' , 'TABLE' , 'Horario' , 'COLUMN' , 'IdHorario' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene los dias a venir' , 'USER' , 'dbo' , 'TABLE' , 'Horario' , 'COLUMN' , 'FechaInicioHorario' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'contiene los diferentes espacios para realziar las actividades' , 'USER' , 'dbo' , 'TABLE' , 'Horario' , 'COLUMN' , 'FechaFinHorario' 
GO

ALTER TABLE Horario ADD CONSTRAINT Horario_PK PRIMARY KEY CLUSTERED (IdHorario)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Inasistencia 
    (
     IdReporte INTEGER NOT NULL , 
     IdInasistencia INTEGER NOT NULL , 
     NombrePersona NVARCHAR (256) NOT NULL , 
     ApellidoPersona NVARCHAR (256) NOT NULL , 
     NombreColegio NVARCHAR (256) NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id del reporte' , 'USER' , 'dbo' , 'TABLE' , 'Inasistencia' , 'COLUMN' , 'IdReporte' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id de la inasistencia' , 'USER' , 'dbo' , 'TABLE' , 'Inasistencia' , 'COLUMN' , 'IdInasistencia' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el nombre de la persona relacionada al reporte' , 'USER' , 'dbo' , 'TABLE' , 'Inasistencia' , 'COLUMN' , 'NombrePersona' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el apellido de la persona relacionada al reporte' , 'USER' , 'dbo' , 'TABLE' , 'Inasistencia' , 'COLUMN' , 'ApellidoPersona' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el nombre del colegio al que esta asociado la persona ' , 'USER' , 'dbo' , 'TABLE' , 'Inasistencia' , 'COLUMN' , 'NombreColegio' 
GO

ALTER TABLE Inasistencia ADD CONSTRAINT Inasistencia_PK PRIMARY KEY CLUSTERED (IdReporte, IdInasistencia)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO
ALTER TABLE Inasistencia ADD CONSTRAINT Inasistencia_PKv1 UNIQUE NONCLUSTERED (IdInasistencia)
GO

CREATE TABLE Instructor 
    (
     IdRol INTEGER NOT NULL , 
     IdInstructor INTEGER NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id del rol' , 'USER' , 'dbo' , 'TABLE' , 'Instructor' , 'COLUMN' , 'IdRol' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id del instrcutor' , 'USER' , 'dbo' , 'TABLE' , 'Instructor' , 'COLUMN' , 'IdInstructor' 
GO

ALTER TABLE Instructor ADD CONSTRAINT Instructor_PK PRIMARY KEY CLUSTERED (IdRol, IdInstructor)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO
ALTER TABLE Instructor ADD CONSTRAINT Instructor_PKv1 UNIQUE NONCLUSTERED (IdInstructor)
GO

CREATE TABLE perfil 
    (
     IdPerfil INTEGER NOT NULL , 
     Nombres NVARCHAR (256) NOT NULL , 
     Apellidos NVARCHAR (256) NOT NULL , 
     TipoDocumento NVARCHAR (256) NOT NULL , 
     NumeroDocumentoUsuario NVARCHAR (256) NOT NULL , 
     Usuario_IdUsuario INTEGER NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'contiene el id del perfil ' , 'USER' , 'dbo' , 'TABLE' , 'perfil' , 'COLUMN' , 'IdPerfil' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'contiene el telefono del usuario' , 'USER' , 'dbo' , 'TABLE' , 'perfil' , 'COLUMN' , 'Nombres' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'contiene el estado del usuario' , 'USER' , 'dbo' , 'TABLE' , 'perfil' , 'COLUMN' , 'Apellidos' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'contiene el tipo de sangre del usuario' , 'USER' , 'dbo' , 'TABLE' , 'perfil' , 'COLUMN' , 'TipoDocumento' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'contiene la foto que ira en el perfil del usuario' , 'USER' , 'dbo' , 'TABLE' , 'perfil' , 'COLUMN' , 'NumeroDocumentoUsuario' 
GO

    


CREATE UNIQUE NONCLUSTERED INDEX 
    perfil__IDX ON perfil 
    ( 
     Usuario_IdUsuario 
    ) 
GO

ALTER TABLE perfil ADD CONSTRAINT perfil_PK PRIMARY KEY CLUSTERED (IdPerfil)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE persona 
    (
     IdPersona INTEGER NOT NULL , 
     nombrePer NVARCHAR (256) NOT NULL , 
     apellidosPer NVARCHAR (256) NOT NULL , 
     TipoDocumentoPer NVARCHAR (256) NOT NULL , 
     NumeroDocumentoPer NVARCHAR (256) NOT NULL , 
     CorreoElectronico NVARCHAR (256) NOT NULL , 
     GeneroPer NVARCHAR (256) NOT NULL , 
     FechaNacimientoPer DATE NOT NULL , 
     colegio_IdColegio INTEGER NOT NULL , 
     Unidad_IdUnidad INTEGER NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id de la persona' , 'USER' , 'dbo' , 'TABLE' , 'persona' , 'COLUMN' , 'IdPersona' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el nombre de la persona' , 'USER' , 'dbo' , 'TABLE' , 'persona' , 'COLUMN' , 'nombrePer' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el apellido de la persona' , 'USER' , 'dbo' , 'TABLE' , 'persona' , 'COLUMN' , 'apellidosPer' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el tipo de documento de la persona' , 'USER' , 'dbo' , 'TABLE' , 'persona' , 'COLUMN' , 'TipoDocumentoPer' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el numero de documento de la persona' , 'USER' , 'dbo' , 'TABLE' , 'persona' , 'COLUMN' , 'NumeroDocumentoPer' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el correo electronico de la persona' , 'USER' , 'dbo' , 'TABLE' , 'persona' , 'COLUMN' , 'CorreoElectronico' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el genero de la persona' , 'USER' , 'dbo' , 'TABLE' , 'persona' , 'COLUMN' , 'GeneroPer' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene la fecha de nacimiento de la persona' , 'USER' , 'dbo' , 'TABLE' , 'persona' , 'COLUMN' , 'FechaNacimientoPer' 
GO

ALTER TABLE persona ADD CONSTRAINT persona_PK PRIMARY KEY CLUSTERED (IdPersona)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Persona_Calificacion 
    (
     persona_IdPersona INTEGER NOT NULL , 
     Calificacion_IdReporte INTEGER NOT NULL , 
     Calificacion_IdCalificacion INTEGER NOT NULL 
    )
GO

ALTER TABLE Persona_Calificacion ADD CONSTRAINT Persona_Calificacion_PK PRIMARY KEY CLUSTERED (persona_IdPersona, Calificacion_IdReporte)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Persona_Horario 
    (
     persona_IdPersona INTEGER NOT NULL , 
     Horario_IdHorario INTEGER NOT NULL , 
     Fecha DATE NOT NULL 
    )
GO

ALTER TABLE Persona_Horario ADD CONSTRAINT Persona_Horario_PK PRIMARY KEY CLUSTERED (persona_IdPersona, Horario_IdHorario)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Persona_Inasistencia 
    (
     persona_IdPersona INTEGER NOT NULL , 
     Inasistencia_IdReporte INTEGER NOT NULL , 
     Inasistencia_IdInasistencia INTEGER NOT NULL 
    )
GO

ALTER TABLE Persona_Inasistencia ADD CONSTRAINT Persona_Inasistencia_PK PRIMARY KEY CLUSTERED (persona_IdPersona, Inasistencia_IdReporte)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Registro 
    (
     IdRegistro INTEGER NOT NULL , 
     FechaRegistro DATE NOT NULL , 
     persona_IdPersona INTEGER NOT NULL , 
     Edicion_IdEdicion INTEGER NOT NULL , 
     Administrador_IdAdministrador INTEGER NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id del registro' , 'USER' , 'dbo' , 'TABLE' , 'Registro' , 'COLUMN' , 'IdRegistro' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene la fecha del registro' , 'USER' , 'dbo' , 'TABLE' , 'Registro' , 'COLUMN' , 'FechaRegistro' 
GO

ALTER TABLE Registro ADD CONSTRAINT Registro_PK PRIMARY KEY CLUSTERED (IdRegistro)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Reporte 
    (
     IdReporte INTEGER NOT NULL , 
     NombreReporte NVARCHAR (256) NOT NULL , 
     Instructor_IdInstructor INTEGER NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id del reporte' , 'USER' , 'dbo' , 'TABLE' , 'Reporte' , 'COLUMN' , 'IdReporte' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el contenido del reporte' , 'USER' , 'dbo' , 'TABLE' , 'Reporte' , 'COLUMN' , 'NombreReporte' 
GO

ALTER TABLE Reporte ADD CONSTRAINT Reporte_PK PRIMARY KEY CLUSTERED (IdReporte)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Rol 
    (
     IdRol INTEGER NOT NULL , 
     NombreRol NVARCHAR (256) NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id del rol' , 'USER' , 'dbo' , 'TABLE' , 'Rol' , 'COLUMN' , 'IdRol' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el nombre del rol' , 'USER' , 'dbo' , 'TABLE' , 'Rol' , 'COLUMN' , 'NombreRol' 
GO

ALTER TABLE Rol ADD CONSTRAINT Rol_PK PRIMARY KEY CLUSTERED (IdRol)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE SuperAdministrador 
    (
     IdSA INTEGER NOT NULL , 
     NombreUsuario NVARCHAR (256) NOT NULL , 
     Contraseña NVARCHAR (256) NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id del super administrador' , 'USER' , 'dbo' , 'TABLE' , 'SuperAdministrador' , 'COLUMN' , 'IdSA' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el nombre del super administrador' , 'USER' , 'dbo' , 'TABLE' , 'SuperAdministrador' , 'COLUMN' , 'NombreUsuario' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene la contraseña del super administrador' , 'USER' , 'dbo' , 'TABLE' , 'SuperAdministrador' , 'COLUMN' , 'Contraseña' 
GO

ALTER TABLE SuperAdministrador ADD CONSTRAINT SuperAdministrador_PK PRIMARY KEY CLUSTERED (IdSA)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Unidad 
    (
     IdUnidad INTEGER NOT NULL , 
     NombreUnidad NVARCHAR (256) NOT NULL , 
     EstadoUnidad BIT NOT NULL , 
     brigada_IdBrigada INTEGER NOT NULL , 
     UbicacionUnidad NVARCHAR (256) NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el id de la unidad' , 'USER' , 'dbo' , 'TABLE' , 'Unidad' , 'COLUMN' , 'IdUnidad' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el nombre de la unidad' , 'USER' , 'dbo' , 'TABLE' , 'Unidad' , 'COLUMN' , 'NombreUnidad' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el estado de la unidad' , 'USER' , 'dbo' , 'TABLE' , 'Unidad' , 'COLUMN' , 'EstadoUnidad' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene la ubicacion de la unidad' , 'USER' , 'dbo' , 'TABLE' , 'Unidad' , 'COLUMN' , 'UbicacionUnidad' 
GO

ALTER TABLE Unidad ADD CONSTRAINT Unidad_PK PRIMARY KEY CLUSTERED (IdUnidad)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Usuario 
    (
     IdUsuario INTEGER NOT NULL , 
     NombreUsuario NVARCHAR (256) NOT NULL , 
     contraseñaUsuario NVARCHAR (256) NOT NULL , 
     UltimaFechaDeAccesoU DATE NOT NULL , 
     FechaDeCreacionU DATE NOT NULL , 
     EstadoUsuario BIT NOT NULL , 
     SuperAdministrador_IdSA INTEGER NOT NULL 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene la id del usuario' , 'USER' , 'dbo' , 'TABLE' , 'Usuario' , 'COLUMN' , 'IdUsuario' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el nombre del usuario' , 'USER' , 'dbo' , 'TABLE' , 'Usuario' , 'COLUMN' , 'NombreUsuario' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene la contraseña del usuario' , 'USER' , 'dbo' , 'TABLE' , 'Usuario' , 'COLUMN' , 'contraseñaUsuario' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene la ultima fecha de acceso del usuario' , 'USER' , 'dbo' , 'TABLE' , 'Usuario' , 'COLUMN' , 'UltimaFechaDeAccesoU' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene la fecha de creacion del usuario' , 'USER' , 'dbo' , 'TABLE' , 'Usuario' , 'COLUMN' , 'FechaDeCreacionU' 
GO



EXEC sp_addextendedproperty 'MS_Description' , 'Contiene el estado del usuario' , 'USER' , 'dbo' , 'TABLE' , 'Usuario' , 'COLUMN' , 'EstadoUsuario' 
GO

ALTER TABLE Usuario ADD CONSTRAINT Usuario_PK PRIMARY KEY CLUSTERED (IdUsuario)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

ALTER TABLE Administrador_Colegio 
    ADD CONSTRAINT Administrador_Colegio_Administrador_FK FOREIGN KEY 
    ( 
     Administrador_IdRol, 
     Administrador_IdAdministrador
    ) 
    REFERENCES Administrador 
    ( 
     IdRol , 
     IdAdministrador 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Administrador_Colegio 
    ADD CONSTRAINT Administrador_Colegio_colegio_FK FOREIGN KEY 
    ( 
     colegio_IdColegio
    ) 
    REFERENCES colegio 
    ( 
     IdColegio 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Administrador 
    ADD CONSTRAINT Administrador_Rol_FK FOREIGN KEY 
    ( 
     IdRol
    ) 
    REFERENCES Rol 
    ( 
     IdRol 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE AsignacionReporteIn 
    ADD CONSTRAINT AsignacionReporteIn_colegio_FK FOREIGN KEY 
    ( 
     colegio_IdColegio
    ) 
    REFERENCES colegio 
    ( 
     IdColegio 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE AsignacionReporteIn 
    ADD CONSTRAINT AsignacionReporteIn_Inasistencia_FK FOREIGN KEY 
    ( 
     Inasistencia_IdInasistencia
    ) 
    REFERENCES Inasistencia 
    ( 
     IdInasistencia 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE AsignacionRol 
    ADD CONSTRAINT AsignacionRol_Rol_FK FOREIGN KEY 
    ( 
     Rol_IdRol
    ) 
    REFERENCES Rol 
    ( 
     IdRol 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE AsignacionRol 
    ADD CONSTRAINT AsignacionRol_Usuario_FK FOREIGN KEY 
    ( 
     Usuario_IdUsuario
    ) 
    REFERENCES Usuario 
    ( 
     IdUsuario 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE AsignarCalificacion 
    ADD CONSTRAINT AsignarCalificacion_Calificacion_FK FOREIGN KEY 
    ( 
     Calificacion_IdCalificacion
    ) 
    REFERENCES Calificacion 
    ( 
     IdCalificacion 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE AsignarCalificacion 
    ADD CONSTRAINT AsignarCalificacion_Registro_FK FOREIGN KEY 
    ( 
     Registro_IdRegistro
    ) 
    REFERENCES Registro 
    ( 
     IdRegistro 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Auditoria 
    ADD CONSTRAINT Auditoria_Certificado_FK FOREIGN KEY 
    ( 
     Certificado_IdCertificado
    ) 
    REFERENCES Certificado 
    ( 
     IdCertificado 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE brigada 
    ADD CONSTRAINT brigada_Comando_FK FOREIGN KEY 
    ( 
     Comando_IdComando
    ) 
    REFERENCES Comando 
    ( 
     IdComando 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Calificacion 
    ADD CONSTRAINT Calificacion_Administrador_FK FOREIGN KEY 
    ( 
     Administrador_IdAdministrador
    ) 
    REFERENCES Administrador 
    ( 
     IdAdministrador 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Calificacion 
    ADD CONSTRAINT Calificacion_Reporte_FK FOREIGN KEY 
    ( 
     IdReporte
    ) 
    REFERENCES Reporte 
    ( 
     IdReporte 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Certificado 
    ADD CONSTRAINT Certificado_Administrador_FK FOREIGN KEY 
    ( 
     Administrador_IdAdministrador
    ) 
    REFERENCES Administrador 
    ( 
     IdAdministrador 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Certificado 
    ADD CONSTRAINT Certificado_Curso_FK FOREIGN KEY 
    ( 
     Curso_IdCurso
    ) 
    REFERENCES Curso 
    ( 
     IdCurso 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Certificado 
    ADD CONSTRAINT Certificado_persona_FK FOREIGN KEY 
    ( 
     persona_IdPersona
    ) 
    REFERENCES persona 
    ( 
     IdPersona 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE colegio 
    ADD CONSTRAINT colegio_fundacion_FK FOREIGN KEY 
    ( 
     fundacion_IdFundacion
    ) 
    REFERENCES fundacion 
    ( 
     IdFundacion 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Comando 
    ADD CONSTRAINT Comando_fundacion_FK FOREIGN KEY 
    ( 
     fundacion_IdFundacion
    ) 
    REFERENCES fundacion 
    ( 
     IdFundacion 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Curso_Administrador 
    ADD CONSTRAINT Curso_Administrador_Administrador_FK FOREIGN KEY 
    ( 
     Administrador_IdRol, 
     Administrador_IdAdministrador
    ) 
    REFERENCES Administrador 
    ( 
     IdRol , 
     IdAdministrador 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Curso_Administrador 
    ADD CONSTRAINT Curso_Administrador_Curso_FK FOREIGN KEY 
    ( 
     Curso_IdCurso
    ) 
    REFERENCES Curso 
    ( 
     IdCurso 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Curso 
    ADD CONSTRAINT Curso_fundacion_FK FOREIGN KEY 
    ( 
     fundacion_IdFundacion
    ) 
    REFERENCES fundacion 
    ( 
     IdFundacion 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Edicion 
    ADD CONSTRAINT Edicion_Curso_FK FOREIGN KEY 
    ( 
     Curso_IdCurso
    ) 
    REFERENCES Curso 
    ( 
     IdCurso 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Funcion 
    ADD CONSTRAINT Funcion_SuperAdministrador_FK FOREIGN KEY 
    ( 
     SuperAdministrador_IdSA
    ) 
    REFERENCES SuperAdministrador 
    ( 
     IdSA 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Funciones_Rol 
    ADD CONSTRAINT Funciones_Rol_Funcion_FK FOREIGN KEY 
    ( 
     Funcion_IdFunciones
    ) 
    REFERENCES Funcion 
    ( 
     IdFunciones 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Funciones_Rol 
    ADD CONSTRAINT Funciones_Rol_Rol_FK FOREIGN KEY 
    ( 
     Rol_IdRol
    ) 
    REFERENCES Rol 
    ( 
     IdRol 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Inasistencia 
    ADD CONSTRAINT Inasistencia_Reporte_FK FOREIGN KEY 
    ( 
     IdReporte
    ) 
    REFERENCES Reporte 
    ( 
     IdReporte 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Instructor 
    ADD CONSTRAINT Instructor_Rol_FK FOREIGN KEY 
    ( 
     IdRol
    ) 
    REFERENCES Rol 
    ( 
     IdRol 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE perfil 
    ADD CONSTRAINT perfil_Usuario_FK FOREIGN KEY 
    ( 
     Usuario_IdUsuario
    ) 
    REFERENCES Usuario 
    ( 
     IdUsuario 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Persona_Calificacion 
    ADD CONSTRAINT Persona_Calificacion_Calificacion_FK FOREIGN KEY 
    ( 
     Calificacion_IdReporte, 
     Calificacion_IdCalificacion
    ) 
    REFERENCES Calificacion 
    ( 
     IdReporte , 
     IdCalificacion 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Persona_Calificacion 
    ADD CONSTRAINT Persona_Calificacion_persona_FK FOREIGN KEY 
    ( 
     persona_IdPersona
    ) 
    REFERENCES persona 
    ( 
     IdPersona 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE persona 
    ADD CONSTRAINT persona_colegio_FK FOREIGN KEY 
    ( 
     colegio_IdColegio
    ) 
    REFERENCES colegio 
    ( 
     IdColegio 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Persona_Horario 
    ADD CONSTRAINT Persona_Horario_Horario_FK FOREIGN KEY 
    ( 
     Horario_IdHorario
    ) 
    REFERENCES Horario 
    ( 
     IdHorario 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Persona_Horario 
    ADD CONSTRAINT Persona_Horario_persona_FK FOREIGN KEY 
    ( 
     persona_IdPersona
    ) 
    REFERENCES persona 
    ( 
     IdPersona 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Persona_Inasistencia 
    ADD CONSTRAINT Persona_Inasistencia_Inasistencia_FK FOREIGN KEY 
    ( 
     Inasistencia_IdReporte, 
     Inasistencia_IdInasistencia
    ) 
    REFERENCES Inasistencia 
    ( 
     IdReporte , 
     IdInasistencia 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Persona_Inasistencia 
    ADD CONSTRAINT Persona_Inasistencia_persona_FK FOREIGN KEY 
    ( 
     persona_IdPersona
    ) 
    REFERENCES persona 
    ( 
     IdPersona 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE persona 
    ADD CONSTRAINT persona_Unidad_FK FOREIGN KEY 
    ( 
     Unidad_IdUnidad
    ) 
    REFERENCES Unidad 
    ( 
     IdUnidad 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Registro 
    ADD CONSTRAINT Registro_Administrador_FK FOREIGN KEY 
    ( 
     Administrador_IdAdministrador
    ) 
    REFERENCES Administrador 
    ( 
     IdAdministrador 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Registro 
    ADD CONSTRAINT Registro_Edicion_FK FOREIGN KEY 
    ( 
     Edicion_IdEdicion
    ) 
    REFERENCES Edicion 
    ( 
     IdEdicion 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Registro 
    ADD CONSTRAINT Registro_persona_FK FOREIGN KEY 
    ( 
     persona_IdPersona
    ) 
    REFERENCES persona 
    ( 
     IdPersona 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Reporte 
    ADD CONSTRAINT Reporte_Instructor_FK FOREIGN KEY 
    ( 
     Instructor_IdInstructor
    ) 
    REFERENCES Instructor 
    ( 
     IdInstructor 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Unidad 
    ADD CONSTRAINT Unidad_brigada_FK FOREIGN KEY 
    ( 
     brigada_IdBrigada
    ) 
    REFERENCES brigada 
    ( 
     IdBrigada 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Usuario 
    ADD CONSTRAINT Usuario_SuperAdministrador_FK FOREIGN KEY 
    ( 
     SuperAdministrador_IdSA
    ) 
    REFERENCES SuperAdministrador 
    ( 
     IdSA 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO



-- Informe de Resumen de Oracle SQL Developer Data Modeler: 
-- 
-- CREATE TABLE                            31
-- CREATE INDEX                             3
-- ALTER TABLE                             76
-- CREATE VIEW                              0
-- ALTER VIEW                               0
-- CREATE PACKAGE                           0
-- CREATE PACKAGE BODY                      0
-- CREATE PROCEDURE                         0
-- CREATE FUNCTION                          0
-- CREATE TRIGGER                           0
-- ALTER TRIGGER                            0
-- CREATE DATABASE                          0
-- CREATE DEFAULT                           0
-- CREATE INDEX ON VIEW                     0
-- CREATE ROLLBACK SEGMENT                  0
-- CREATE ROLE                              0
-- CREATE RULE                              0
-- CREATE SCHEMA                            0
-- CREATE SEQUENCE                          0
-- CREATE PARTITION FUNCTION                0
-- CREATE PARTITION SCHEME                  0
-- 
-- DROP DATABASE                            0
-- 
-- ERRORS                                   0
-- WARNINGS                                 0