/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import normalizeText from "../../utils/textUtils";
import LinkBehavior from "./LinkBehavior";
import logoFusdec from "../../assets/images/logoFu.png";
import obtenerRutasPermitidas from "../../routes/rutasPermitidas";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import LogoutIcon from '@mui/icons-material/Logout';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#1976d2', // Color azul original de MUI
  },
  drawer: {
    width: 250,
  },
  drawerPaper: {
    width: 250,
    backgroundColor: '#fff',
    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
  },
  listItem: {
    borderRadius: '8px',
    margin: '4px 8px',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
    },
  },
  listItemActive: {
    backgroundColor: 'rgba(25, 118, 210, 0.12)',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.16)',
    },
  },
  listItemIcon: {
    minWidth: 40,
    color: '#1976d2',
  },
  nestedItem: {
    paddingLeft: '32px',
  },
  expandIcon: {
    transition: 'transform 0.3s',
  },
  expandIconOpen: {
    transform: 'rotate(180deg)',
  },
  logo: {
    height: 40,
    marginLeft: 16,
  },
  menuButton: {
    color: '#fff',
  },
}));

export default function Navbar() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const { isAuthenticated, roles, logout } = useContext(AuthContext);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const handleItemClick = (itemId, ruta) => {
    if (ruta) {
      navigate(normalizeText(ruta));
      setDrawerOpen(false);
    } else {
      setExpandedItems(prev => ({
        ...prev,
        [itemId]: !prev[itemId]
      }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/home");
    setDrawerOpen(false);
  };

  const rutasPermitidas = obtenerRutasPermitidas(isAuthenticated, roles);

  const drawer = (
    <Box>
      <List>
        {rutasPermitidas
          .filter(ruta => !['Home', 'Más Información', 'Login'].includes(ruta.nombre))
          .map((ruta, index) => (
          <React.Fragment key={ruta.nombre}>
            <ListItem 
              button 
              className={classes.listItem}
              onClick={() => handleItemClick(index, ruta.subrutas ? null : ruta.ruta)}
            >
              <ListItemIcon className={classes.listItemIcon}>
                {ruta.icon}
              </ListItemIcon>
              <ListItemText 
                primary={ruta.nombre}
                primaryTypographyProps={{ 
                  style: { color: '#1976d2', fontWeight: 500 }
                }}
              />
              {ruta.subrutas && (
                <ExpandMoreIcon 
                  className={`${classes.expandIcon} ${expandedItems[index] ? classes.expandIconOpen : ''}`}
                  style={{ color: '#1976d2' }}
                />
              )}
            </ListItem>
            {ruta.subrutas && (
              <Collapse in={expandedItems[index]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {ruta.subrutas.map((subruta) => (
                    <ListItem
                      key={subruta.nombre}
                      button
                      onClick={() => handleItemClick(null, subruta.ruta)}
                      className={`${classes.listItem} ${classes.nestedItem}`}
                    >
                      <ListItemText 
                        primary={subruta.nombre}
                        primaryTypographyProps={{ 
                          style: { color: '#666' }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" open={drawerOpen} className={classes.appBar}>
        <Toolbar>
          {isAuthenticated && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <img 
            src={logoFusdec} 
            alt="Fusdec Logo" 
            className={classes.logo}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate("/home")}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            {!isAuthenticated ? (
              <>
                <Button 
                  color="inherit" 
                  onClick={() => navigate("/home")}
                >
                  Home
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate("/masinformacion")}
                >
                  Más Información
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  onClick={() => navigate("/home")}
                >
                  Home
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate("/masinformacion")}
                >
                  Más Información
                </Button>
                <Button 
                  color="inherit" 
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {isAuthenticated && (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          {drawer}
        </Drawer>
      )}
      <Toolbar /> {/* Espaciador para el contenido debajo del AppBar */}
    </>
  );
}



