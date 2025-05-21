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
    <Box 
      sx={{ 
        width: 250, 
        height: '100%', 
        backgroundColor: '#f0f0f0',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          p: 2,
          backgroundColor: '#1976d2',
          color: 'white'
        }}
      >
        <img 
          src={logoFusdec} 
          alt="FUSDEC Logo" 
          style={{ height: 50, marginRight: 10 }} 
        />
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>FUSDEC</span>
      </Box>
      <List>
        {rutasPermitidas
          .filter(ruta => ruta.nombre !== 'Más Información' && ruta.nombre !== 'Home')
          .map((ruta, index) => (
            <React.Fragment key={ruta.nombre}>
              <ListItem 
                button={true.toString()} 
                className="listItem"
                onClick={() => {
                  navigate(normalizeText(ruta.ruta));
                  setDrawerOpen(false);
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    borderLeft: '4px solid #1976d2'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <ListItemIcon 
                  className="listItemIcon"
                  sx={{ 
                    color: '#1976d2', 
                    minWidth: 40 
                  }}
                >
                  {ruta.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={ruta.nombre}
                  primaryTypographyProps={{ 
                    style: { 
                      color: '#1976d2',
                      fontWeight: 500
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
                id = "loginButton"
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
                button={true.toString()} 
                variant="contained" 
                color="primary" 
                onClick={handleLogout}
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
          sx={{
            '& .MuiDrawer-paper': {
              width: 250,
              boxSizing: 'border-box',
              backgroundColor: '#f0f0f0',
              borderRight: '1px solid rgba(0, 0, 0, 0.12)'
            }
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
}