import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import NavBar from './components/navbar/NavBar'
import Footer from './components/footer/Footer'
import NavbarRoutes from './routes/NavbarRoutes'
import theme from './theme/theme'
import {ThemeProvider } from '@mui/material/styles';



function App() {
  return (
      <ThemeProvider theme={theme}>
      <Router>
        <NavBar></NavBar>
        <NavbarRoutes/>
        <Footer/>
      </Router>
    </ThemeProvider>

  )
}

export default App
