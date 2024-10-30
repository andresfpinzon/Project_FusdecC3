// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import LinkBehavior from "./LinkBehavior"; // Asegúrate de importar el componente personalizado
import normalizeText from "../../utils/textUtils"; // Importación de la función de normalización de texto
import logoFusdec from "../../assets/images/logoFu.png";



const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    minHeight: "64px",
  },
  logo: {
    height: "40px",
    width: "40px",
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: "white",
    textDecoration: "none",
    margin: theme.spacing(2),
  },
  drawer: {
    width: 250,
  },
  drawerLink: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
}));

export default function Navbar() {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <div className={classes.drawer}>
      <List>
      {["Home", "Asistencias", "Auditorias","Brigadas","Calificaciones", "Certificados","Comandos", "Cursos", "Ediciones", "Horarios", "Más Información", "Estudiantes", "Inasistencias", "Roles", "Unidades", "Usuarios", "Login"].map((text) => (
          <ListItem
            button
            component={LinkBehavior}
            to={`/${normalizeText(text)}`}
            key={text}
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <img src={logoFusdec} alt="Fusdec Logo" className={classes.logo} />
          <Typography variant="h6" className={classes.title}>
            Fusdec
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {["Home", "Asistencias", "Auditorias","Brigadas","Calificaciones", "Certificados","Comandos", "Cursos", "Ediciones", "Horarios", "Más Información", "Estudiantes", "Inasistencias", "Roles", "Unidades", "Usuarios", "Login"].map((text) => (
              <Button
                color="inherit"
                component={LinkBehavior}
                to={`/${normalizeText(text)}`}
                key={text}
              >
                {text}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </>
  );
}
