import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import normalizeText from "../../utils/textUtils";
import LinkBehavior from "./LinkBehavior";
import logoFusdec from "../../assets/images/logoFu.png";
import obtenerRutasPermitidas from "../../routes/rutasPermitidas"

const useStyles = makeStyles((theme) => ({
  toolbar: { 
    display: "flex", 
    justifyContent: "space-between", 
    minHeight: "64px" 
  },
  logo: { 
    height: "40px", 
    width: "40px", 
    marginRight: theme.spacing(2) 
  },
  title: { 
    flexGrow: 1 
  },
  link: { 
    color: "white", 
    textDecoration: "none", 
    margin: theme.spacing(2) 
  },
  drawer: { 
    width: 250 
  },
  drawerLink: { 
    textDecoration: "none", 
    color: theme.palette.text.primary 
  },
}));

export default function Navbar() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState([]);

  // Cargar el estado de autenticación y roles al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRoles = JSON.parse(localStorage.getItem("roles"));

    if (token) {
      setIsAuthenticated(true);
      setRoles(storedRoles || []);
    }
  }, []);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    setIsAuthenticated(false);
    setRoles([]);
    navigate("/home");
  };

  const rutasPermitidas = obtenerRutasPermitidas(isAuthenticated, roles);

  const drawer = (
    <div className={classes.drawer}>
      <List>
        {rutasPermitidas.map((ruta) => (
          <ListItem
            button
            component={LinkBehavior}
            to={normalizeText(ruta.ruta)}
            key={ruta.nombre}
          >
            <ListItemText primary={ruta.nombre} />
          </ListItem>
        ))}
        {isAuthenticated && (
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Salir" />
          </ListItem>
        )}
      </List>
    </div>
  );

  return (
    <>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <img src={logoFusdec} alt="Fusdec Logo" className={classes.logo} />
          <Typography variant="h6" className={classes.title}>Fusdec</Typography>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle} sx={{ display: { xs: "block", md: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {rutasPermitidas.map((ruta) => (
              <Button color="inherit" component={LinkBehavior} to={normalizeText(ruta.ruta)} key={ruta.nombre}>
                {ruta.nombre}
              </Button>
            ))}
            {isAuthenticated && (
              <Button color="inherit" onClick={handleLogout}>Salir</Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </>
  );
}


