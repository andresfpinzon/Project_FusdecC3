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
    backgroundColor: '#1976d2',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflowX: 'hidden',
  },
  toolbar: {
    padding: '0.5rem 1rem',
    '@media (min-width: 600px)': {
      padding: '0.5rem 2rem',
    },
    overflowX: 'hidden',
  },
  drawer: {
    width: 280,
  },
  drawerPaper: {
    width: 280,
    backgroundColor: '#234DB8FF',
    borderRight: '1px solid rgba(25, 118, 210, 0.12)',
    boxShadow: '4px 0 8px rgba(0, 0, 0, 0.05)',
  },
  listItem: {
    margin: '4px 8px',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    position: 'relative',
    '&:before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '3px',
      height: '0%',
      backgroundColor: '#1976d2',
      transition: 'height 0.3s ease',
    },
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
      transform: 'translateX(4px)',
      '&:before': {
        height: '70%',
      },
    },
  },
  listItemActive: {
    backgroundColor: 'rgba(25, 118, 210, 0.12)',
    '&:before': {
      height: '70%',
    },
  },
  listItemIcon: {
    minWidth: 40,
    color: '#1976d2',
  },
  listItemText: {
    '& .MuiTypography-root': {
      fontSize: '0.95rem',
      fontWeight: 500,
      color: '#2c3e50',
      letterSpacing: '0.2px',
    },
  },
  nestedItem: {
    paddingLeft: '32px',
    margin: '2px 8px 2px 28px',
    borderLeft: '2px solid rgba(25, 118, 210, 0.2)',
    borderRadius: '0 10px 10px 0',
    backgroundColor: 'rgba(25, 118, 210, 0.02)',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
      borderLeft: '2px solid #1976d2',
    },
  },
  nestedText: {
    '& .MuiTypography-root': {
      fontSize: '0.9rem',
      color: '#546e7a',
      transition: 'color 0.3s ease',
    },
    '&:hover .MuiTypography-root': {
      color: '#1976d2',
    },
  },
  expandIcon: {
    transition: 'transform 0.3s ease, color 0.3s ease',
    color: '#1976d2',
  },
  expandIconOpen: {
    transform: 'rotate(180deg)',
  },
  divider: {
    margin: '8px 16px',
    backgroundColor: 'rgba(25, 118, 210, 0.12)',
  },
  categoryHeader: {
    padding: '16px 16px 8px',
    color: '#1976d2',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  logo: {
    height: 45,
    marginLeft: 16,
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  menuButton: {
    color: '#fff',
    marginRight: '16px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  button: {
    margin: '0 4px',
    borderRadius: '20px',
    textTransform: 'none',
    padding: '6px 16px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
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
              className={`${classes.listItem} ${expandedItems[index] ? classes.listItemActive : ''}`}
              onClick={() => handleItemClick(index, ruta.subrutas ? null : ruta.ruta)}
            >
              <ListItemIcon className={classes.listItemIcon}>
                {ruta.icon}
              </ListItemIcon>
              <ListItemText 
                primary={ruta.nombre}
                primaryTypographyProps={{ 
                  style: { 
                    color: '#1976d2',
                    fontWeight: 500,
                    fontSize: '0.95rem'
                  }
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
                  className={`${classes.button} ${classes.logoutButton}`}
                  startIcon={<LogoutIcon />}
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
