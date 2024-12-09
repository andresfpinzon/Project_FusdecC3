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
import './navbar.css';
import normalizeText from "../../utils/textUtils";
import logoFusdec from "../../assets/images/logoFu.png";
import obtenerRutasPermitidas from "../../routes/rutasPermitidas";
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';

export default function Navbar() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAuthenticated, roles, logout } = useContext(AuthContext);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

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
          .filter(ruta => ruta.nombre !== 'Más Información' && ruta.nombre !== 'Home')
          .map((ruta, index) => (
            <React.Fragment key={ruta.nombre}>
              <ListItem 
                button 
                className="listItem"
                onClick={() => navigate(normalizeText(ruta.ruta))}
              >
                <ListItemIcon className="listItemIcon">
                  {ruta.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={ruta.nombre}
                  primaryTypographyProps={{ 
                    style: { 
                      color: '#1976d2',
                    }
                  }}
                />
              </ListItem>
            </React.Fragment>
          ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" className="appBar">
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
            className="logo"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate("/home")}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <Button 
              color="inherit" 
              onClick={() => navigate("/home")} 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <HomeIcon />
            </Button>
          </Box>
          <Box>
            <Button 
              color="inherit" 
              onClick={() => navigate("/masinformacion")} 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <InfoIcon />
            </Button>
          </Box>
          <Box>
            {!isAuthenticated ? (
              <Button 
                color="inherit" 
                onClick={() => navigate("/login")} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  borderRadius: '5px',
                  padding: '8px',
                }}
              >
                <LoginIcon />
              </Button>
            ) : (
              <Button 
                color="inherit" 
                onClick={handleLogout} 
                style={{ 
                  backgroundColor: '#F44336',
                  color: '#fff',
                  borderRadius: '5px',
                  padding: '8px',
                }}
              >
                <LogoutIcon />
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {isAuthenticated && (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerToggle}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
}