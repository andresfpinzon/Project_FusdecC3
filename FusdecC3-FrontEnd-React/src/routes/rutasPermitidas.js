// Función para obtener rutas permitidas según los roles del usuario
const obtenerRutasPermitidas = (isAuthenticated, roles) => {
    const rutasBase = [
      { nombre: "Home", ruta: "/home", roles: [] },
      { nombre: "Más Información", ruta: "/masinformacion", roles: [] },
      ...(isAuthenticated ? [] : [{ nombre: "Login", ruta: "/login", roles: [] }]),
    ];
  
    const rutasAdministrador = [
      { nombre: "Fundaciones", ruta: "/fundaciones", roles: ["Administrador", "Root"] },
      { nombre: "Comandos", ruta: "/comandos", roles: ["Administrador", "Root"] },
      { nombre: "Brigadas", ruta: "/brigadas", roles: ["Administrador", "Root"] },
      { nombre: "Unidades", ruta: "/unidades", roles: ["Administrador", "Root"] },
      { nombre: "Colegios", ruta: "/colegios", roles: ["Administrador", "Root"] },
      { nombre: "Asistencias", ruta: "/asistencias", roles: ["Administrador", "Root"] },
      { nombre: "Inasistencias", ruta: "/inasistencias", roles: ["Administrador", "Root"] },
      { nombre: "Auditorias", ruta: "/auditorias", roles: ["Administrador", "Root"] },
      { nombre: "Certificados", ruta: "/certificados", roles: ["Administrador", "Root"] },
      { nombre: "Usuarios", ruta: "/usuarios", roles: ["Administrador", "Root"] },
      { nombre: "Roles", ruta: "/roles", roles: ["Administrador", "Root"] },
      { nombre: "Calificaciones", ruta: "/calificaciones", roles: ["Administrador", "Root"] },
    ];
  
    const rutasSecretario = [
      { nombre: "Estudiantes", ruta: "/estudiantes", roles: ["Secretario", "Root"] },
      { nombre: "Cursos", ruta: "/cursos", roles: ["Secretario", "Root"] },
      { nombre: "Horarios", ruta: "/horarios", roles: ["Secretario", "Root"] },
      { nombre: "Ediciones", ruta: "/ediciones", roles: ["Secretario", "Root"] },
    ];
  
    const rutasInstructor = [
      { nombre: "Estudiantes", ruta: "/estudiantes", roles: ["Instructor", "Root"] },
      { nombre: "Asistencias", ruta: "/asistencias", roles: ["Instructor", "Root"] },
      { nombre: "Inasistencias", ruta: "/inasistencias", roles: ["Instructor", "Root"] },
      { nombre: "Calificaciones", ruta: "/calificaciones", roles: ["Instructor", "Root"] },
    ];

    // Combinar las rutas según los roles del usuario
    let rutasPermitidas = [
      ...rutasBase,
      ...(isAuthenticated && (roles.includes("Administrador") || roles.includes("Root")) ? rutasAdministrador : []),
      ...(isAuthenticated && (roles.includes("Secretario") || roles.includes("Root")) ? rutasSecretario : []),
      ...(isAuthenticated && (roles.includes("Instructor") || roles.includes("Root")) ? rutasInstructor : []),
    ];
  
    // Eliminar rutas duplicadas basadas en la propiedad 'ruta'
    return rutasPermitidas.filter((ruta, index, self) =>
      index === self.findIndex((r) => r.ruta === ruta.ruta)
    );
  };

  export default obtenerRutasPermitidas;