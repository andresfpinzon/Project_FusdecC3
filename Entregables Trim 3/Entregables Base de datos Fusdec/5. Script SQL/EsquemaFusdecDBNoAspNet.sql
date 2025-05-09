USE [FusdecDB]
GO
/****** Object:  Table [dbo].[Attendances]    Script Date: 25/09/2024 1:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Attendances](
	[IdAttendance] [uniqueidentifier] NOT NULL,
	[AttendanceDate] [datetime2](7) NOT NULL,
	[AttendanceTitle] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Attendances] PRIMARY KEY CLUSTERED 
(
	[IdAttendance] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Audits]    Script Date: 25/09/2024 1:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Audits](
	[IdAudit] [uniqueidentifier] NOT NULL,
	[AuditDate] [date] NOT NULL,
	[NameOfIssuerAudit] [nvarchar](max) NOT NULL,
	[IdCertificate] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_Audits] PRIMARY KEY CLUSTERED 
(
	[IdAudit] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Brigade]    Script Date: 25/09/2024 1:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Brigade](
	[IdBrigade] [uniqueidentifier] NOT NULL,
	[BrigadeName] [nvarchar](max) NOT NULL,
	[BrigadeLocation] [nvarchar](max) NOT NULL,
	[BrigadeStatus] [bit] NOT NULL,
	[IdCommand] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_Brigade] PRIMARY KEY CLUSTERED 
(
	[IdBrigade] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Certificate]    Script Date: 25/09/2024 1:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Certificate](
	[IdCertificate] [uniqueidentifier] NOT NULL,
	[VerificationCode] [nvarchar](max) NOT NULL,
	[NameOfIssuerCert] [nvarchar](max) NOT NULL,
	[CertificateStatus] [bit] NOT NULL,
	[IdStudent] [uniqueidentifier] NOT NULL,
	[IdCourse] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_Certificate] PRIMARY KEY CLUSTERED 
(
	[IdCertificate] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Commands]    Script Date: 25/09/2024 1:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Commands](
	[IdCommand] [uniqueidentifier] NOT NULL,
	[CommandName] [nvarchar](max) NOT NULL,
	[CommandStatus] [bit] NOT NULL,
	[UbicacionComando] [nvarchar](max) NOT NULL,
	[IdFundation] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_Commands] PRIMARY KEY CLUSTERED 
(
	[IdCommand] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Courses]    Script Date: 25/09/2024 1:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Courses](
	[IdCourse] [uniqueidentifier] NOT NULL,
	[CourseName] [nvarchar](max) NOT NULL,
	[CourseDescription] [nvarchar](max) NOT NULL,
	[CourseHourlyIntensity] [nvarchar](max) NOT NULL,
	[CourseEstatus] [bit] NOT NULL,
	[IdFundation] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_Courses] PRIMARY KEY CLUSTERED 
(
	[IdCourse] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Editions]    Script Date: 25/09/2024 1:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Editions](
	[IdEdition] [uniqueidentifier] NOT NULL,
	[EditionStartDate] [date] NOT NULL,
	[EditionEndDate] [date] NOT NULL,
	[IdCourse] [uniqueidentifier] NOT NULL,
	[EditionTitle] [nvarchar](max) NOT NULL,
	[EditionStatus] [bit] NOT NULL,
 CONSTRAINT [PK_Editions] PRIMARY KEY CLUSTERED 
(
	[IdEdition] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EditionSchedules]    Script Date: 25/09/2024 1:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EditionSchedules](
	[IdEdition] [uniqueidentifier] NOT NULL,
	[IdSchedule] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_EditionSchedules] PRIMARY KEY CLUSTERED 
(
	[IdEdition] ASC,
	[IdSchedule] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Fundations]    Script Date: 25/09/2024 1:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Fundations](
	[IdFundation] [uniqueidentifier] NOT NULL,
	[FundationName] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Fundations] PRIMARY KEY CLUSTERED 
(
	[IdFundation] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Grades]    Script Date: 25/09/2024 1:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Grades](
	[IdGrade] [uniqueidentifier] NOT NULL,
	[Approved] [bit] NOT NULL,
	[GradeTitle] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Grades] PRIMARY KEY CLUSTERED 
(
	[IdGrade] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NonAttendances]    Script Date: 25/09/2024 1:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NonAttendances](
	[IdNonAttendance] [uniqueidentifier] NOT NULL,
	[IdAttendance] [uniqueidentifier] NOT NULL,
	[Observacion] [nvarchar](max) NOT NULL,
	[NonAttendanceTitle] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_NonAttendances] PRIMARY KEY CLUSTERED 
(
	[IdNonAttendance] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Schedules]    Script Date: 25/09/2024 1:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Schedules](
	[IdSchedule] [uniqueidentifier] NOT NULL,
	[ScheduleTitle] [nvarchar](max) NOT NULL,
	[ScheduleStartDate] [time](7) NOT NULL,
	[ScheduleEndDate] [time](7) NOT NULL,
	[ScheduleStatus] [bit] NOT NULL,
 CONSTRAINT [PK_Schedules] PRIMARY KEY CLUSTERED 
(
	[IdSchedule] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Schools]    Script Date: 25/09/2024 1:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Schools](
	[IdSchool] [uniqueidentifier] NOT NULL,
	[SchoolName] [nvarchar](max) NOT NULL,
	[SchoolEmail] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Schools] PRIMARY KEY CLUSTERED 
(
	[IdSchool] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StudentAttendances]    Script Date: 25/09/2024 1:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StudentAttendances](
	[IdStudent] [uniqueidentifier] NOT NULL,
	[IdAttendance] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_StudentAttendances] PRIMARY KEY CLUSTERED 
(
	[IdStudent] ASC,
	[IdAttendance] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StudentEditions]    Script Date: 25/09/2024 1:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StudentEditions](
	[IdStudent] [uniqueidentifier] NOT NULL,
	[IdEdition] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_StudentEditions] PRIMARY KEY CLUSTERED 
(
	[IdStudent] ASC,
	[IdEdition] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StudentGrades]    Script Date: 25/09/2024 1:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StudentGrades](
	[IdStudent] [uniqueidentifier] NOT NULL,
	[IdGrade] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_StudentGrades] PRIMARY KEY CLUSTERED 
(
	[IdStudent] ASC,
	[IdGrade] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StudentNonAttendances]    Script Date: 25/09/2024 1:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StudentNonAttendances](
	[IdStudent] [uniqueidentifier] NOT NULL,
	[IdNonAttendance] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_StudentNonAttendances] PRIMARY KEY CLUSTERED 
(
	[IdStudent] ASC,
	[IdNonAttendance] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Students]    Script Date: 25/09/2024 1:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Students](
	[IdStudent] [uniqueidentifier] NOT NULL,
	[StudentDateBirth] [date] NOT NULL,
	[StudentGender] [nvarchar](max) NOT NULL,
	[IdUnit] [uniqueidentifier] NOT NULL,
	[IdSchool] [uniqueidentifier] NOT NULL,
	[StudentName] [nvarchar](max) NOT NULL,
	[DocumentNumber] [nvarchar](max) NOT NULL,
	[DocumentType] [nvarchar](max) NOT NULL,
	[StudentStatus] [bit] NOT NULL,
	[StudentLastName] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Students] PRIMARY KEY CLUSTERED 
(
	[IdStudent] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Units]    Script Date: 25/09/2024 1:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Units](
	[IdUnit] [uniqueidentifier] NOT NULL,
	[UnitName] [nvarchar](max) NOT NULL,
	[UnitState] [bit] NOT NULL,
	[IdBrigade] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_Units] PRIMARY KEY CLUSTERED 
(
	[IdUnit] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[Attendances] ADD  DEFAULT (N'') FOR [AttendanceTitle]
GO
ALTER TABLE [dbo].[Certificate] ADD  DEFAULT ('00000000-0000-0000-0000-000000000000') FOR [IdCourse]
GO
ALTER TABLE [dbo].[Editions] ADD  DEFAULT (N'') FOR [EditionTitle]
GO
ALTER TABLE [dbo].[Editions] ADD  DEFAULT (CONVERT([bit],(0))) FOR [EditionStatus]
GO
ALTER TABLE [dbo].[Grades] ADD  DEFAULT (N'') FOR [GradeTitle]
GO
ALTER TABLE [dbo].[NonAttendances] ADD  DEFAULT (N'') FOR [Observacion]
GO
ALTER TABLE [dbo].[NonAttendances] ADD  DEFAULT (N'') FOR [NonAttendanceTitle]
GO
ALTER TABLE [dbo].[Schedules] ADD  DEFAULT (CONVERT([bit],(0))) FOR [ScheduleStatus]
GO
ALTER TABLE [dbo].[Students] ADD  DEFAULT (N'') FOR [StudentName]
GO
ALTER TABLE [dbo].[Students] ADD  DEFAULT (N'') FOR [DocumentNumber]
GO
ALTER TABLE [dbo].[Students] ADD  DEFAULT (N'') FOR [DocumentType]
GO
ALTER TABLE [dbo].[Students] ADD  DEFAULT (CONVERT([bit],(0))) FOR [StudentStatus]
GO
ALTER TABLE [dbo].[Students] ADD  DEFAULT (N'') FOR [StudentLastName]
GO
ALTER TABLE [dbo].[Audits]  WITH CHECK ADD  CONSTRAINT [FK_Audits_Certificate_IdCertificate] FOREIGN KEY([IdCertificate])
REFERENCES [dbo].[Certificate] ([IdCertificate])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Audits] CHECK CONSTRAINT [FK_Audits_Certificate_IdCertificate]
GO
ALTER TABLE [dbo].[Brigade]  WITH CHECK ADD  CONSTRAINT [FK_Brigade_Commands_IdCommand] FOREIGN KEY([IdCommand])
REFERENCES [dbo].[Commands] ([IdCommand])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Brigade] CHECK CONSTRAINT [FK_Brigade_Commands_IdCommand]
GO
ALTER TABLE [dbo].[Certificate]  WITH CHECK ADD  CONSTRAINT [FK_Certificate_Courses_IdCourse] FOREIGN KEY([IdCourse])
REFERENCES [dbo].[Courses] ([IdCourse])
GO
ALTER TABLE [dbo].[Certificate] CHECK CONSTRAINT [FK_Certificate_Courses_IdCourse]
GO
ALTER TABLE [dbo].[Certificate]  WITH CHECK ADD  CONSTRAINT [FK_Certificate_Students_IdStudent] FOREIGN KEY([IdStudent])
REFERENCES [dbo].[Students] ([IdStudent])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Certificate] CHECK CONSTRAINT [FK_Certificate_Students_IdStudent]
GO
ALTER TABLE [dbo].[Commands]  WITH CHECK ADD  CONSTRAINT [FK_Commands_Fundations_IdFundation] FOREIGN KEY([IdFundation])
REFERENCES [dbo].[Fundations] ([IdFundation])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Commands] CHECK CONSTRAINT [FK_Commands_Fundations_IdFundation]
GO
ALTER TABLE [dbo].[Courses]  WITH CHECK ADD  CONSTRAINT [FK_Courses_Fundations_IdFundation] FOREIGN KEY([IdFundation])
REFERENCES [dbo].[Fundations] ([IdFundation])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Courses] CHECK CONSTRAINT [FK_Courses_Fundations_IdFundation]
GO
ALTER TABLE [dbo].[Editions]  WITH CHECK ADD  CONSTRAINT [FK_Editions_Courses_IdCourse] FOREIGN KEY([IdCourse])
REFERENCES [dbo].[Courses] ([IdCourse])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Editions] CHECK CONSTRAINT [FK_Editions_Courses_IdCourse]
GO
ALTER TABLE [dbo].[EditionSchedules]  WITH CHECK ADD  CONSTRAINT [FK_EditionSchedules_Editions_IdEdition] FOREIGN KEY([IdEdition])
REFERENCES [dbo].[Editions] ([IdEdition])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[EditionSchedules] CHECK CONSTRAINT [FK_EditionSchedules_Editions_IdEdition]
GO
ALTER TABLE [dbo].[EditionSchedules]  WITH CHECK ADD  CONSTRAINT [FK_EditionSchedules_Schedules_IdSchedule] FOREIGN KEY([IdSchedule])
REFERENCES [dbo].[Schedules] ([IdSchedule])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[EditionSchedules] CHECK CONSTRAINT [FK_EditionSchedules_Schedules_IdSchedule]
GO
ALTER TABLE [dbo].[NonAttendances]  WITH CHECK ADD  CONSTRAINT [FK_NonAttendances_Attendances_IdAttendance] FOREIGN KEY([IdAttendance])
REFERENCES [dbo].[Attendances] ([IdAttendance])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[NonAttendances] CHECK CONSTRAINT [FK_NonAttendances_Attendances_IdAttendance]
GO
ALTER TABLE [dbo].[StudentAttendances]  WITH CHECK ADD  CONSTRAINT [FK_StudentAttendances_Attendances_IdAttendance] FOREIGN KEY([IdAttendance])
REFERENCES [dbo].[Attendances] ([IdAttendance])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[StudentAttendances] CHECK CONSTRAINT [FK_StudentAttendances_Attendances_IdAttendance]
GO
ALTER TABLE [dbo].[StudentAttendances]  WITH CHECK ADD  CONSTRAINT [FK_StudentAttendances_Students_IdStudent] FOREIGN KEY([IdStudent])
REFERENCES [dbo].[Students] ([IdStudent])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[StudentAttendances] CHECK CONSTRAINT [FK_StudentAttendances_Students_IdStudent]
GO
ALTER TABLE [dbo].[StudentEditions]  WITH CHECK ADD  CONSTRAINT [FK_StudentEditions_Editions_IdEdition] FOREIGN KEY([IdEdition])
REFERENCES [dbo].[Editions] ([IdEdition])
GO
ALTER TABLE [dbo].[StudentEditions] CHECK CONSTRAINT [FK_StudentEditions_Editions_IdEdition]
GO
ALTER TABLE [dbo].[StudentEditions]  WITH CHECK ADD  CONSTRAINT [FK_StudentEditions_Students_IdStudent] FOREIGN KEY([IdStudent])
REFERENCES [dbo].[Students] ([IdStudent])
GO
ALTER TABLE [dbo].[StudentEditions] CHECK CONSTRAINT [FK_StudentEditions_Students_IdStudent]
GO
ALTER TABLE [dbo].[StudentGrades]  WITH CHECK ADD  CONSTRAINT [FK_StudentGrades_Grades_IdGrade] FOREIGN KEY([IdGrade])
REFERENCES [dbo].[Grades] ([IdGrade])
GO
ALTER TABLE [dbo].[StudentGrades] CHECK CONSTRAINT [FK_StudentGrades_Grades_IdGrade]
GO
ALTER TABLE [dbo].[StudentGrades]  WITH CHECK ADD  CONSTRAINT [FK_StudentGrades_Students_IdStudent] FOREIGN KEY([IdStudent])
REFERENCES [dbo].[Students] ([IdStudent])
GO
ALTER TABLE [dbo].[StudentGrades] CHECK CONSTRAINT [FK_StudentGrades_Students_IdStudent]
GO
ALTER TABLE [dbo].[StudentNonAttendances]  WITH CHECK ADD  CONSTRAINT [FK_StudentNonAttendances_NonAttendances_IdNonAttendance] FOREIGN KEY([IdNonAttendance])
REFERENCES [dbo].[NonAttendances] ([IdNonAttendance])
GO
ALTER TABLE [dbo].[StudentNonAttendances] CHECK CONSTRAINT [FK_StudentNonAttendances_NonAttendances_IdNonAttendance]
GO
ALTER TABLE [dbo].[StudentNonAttendances]  WITH CHECK ADD  CONSTRAINT [FK_StudentNonAttendances_Students_IdStudent] FOREIGN KEY([IdStudent])
REFERENCES [dbo].[Students] ([IdStudent])
GO
ALTER TABLE [dbo].[StudentNonAttendances] CHECK CONSTRAINT [FK_StudentNonAttendances_Students_IdStudent]
GO
ALTER TABLE [dbo].[Students]  WITH CHECK ADD  CONSTRAINT [FK_Students_Schools_IdSchool] FOREIGN KEY([IdSchool])
REFERENCES [dbo].[Schools] ([IdSchool])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Students] CHECK CONSTRAINT [FK_Students_Schools_IdSchool]
GO
ALTER TABLE [dbo].[Students]  WITH CHECK ADD  CONSTRAINT [FK_Students_Units_IdUnit] FOREIGN KEY([IdUnit])
REFERENCES [dbo].[Units] ([IdUnit])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Students] CHECK CONSTRAINT [FK_Students_Units_IdUnit]
GO
ALTER TABLE [dbo].[Units]  WITH CHECK ADD  CONSTRAINT [FK_Units_Brigade_IdBrigade] FOREIGN KEY([IdBrigade])
REFERENCES [dbo].[Brigade] ([IdBrigade])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Units] CHECK CONSTRAINT [FK_Units_Brigade_IdBrigade]
GO
