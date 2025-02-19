/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  Grid,
  Typography,
  TablePagination,
} from "@mui/material";

const token = localStorage.getItem("token");

const Auditorias = () => {
  const [auditorias, setAuditorias] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchAuditorias();
  }, []);

  const fetchAuditorias = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auditorias", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      });
      if (!response.ok) throw new Error("Error al obtener auditorías");
      const data = await response.json();

      // Condicion que verifica si el arreglo de auditorias está vacío
      if (data.length === 0) {
        setErrorMessage("No hay auditorias registradas.");
        setOpenSnackbar(true);
        setAuditorias([]); // esto mantiene el estado vacío para evitar errores
      } else {
        setAuditorias(data);
      }
    } catch (error) {
      console.error("Error al obtener auditorías:", error);
      setErrorMessage("Error al obtener auditorías");
      setOpenSnackbar(true);
    }
  };

  return (
    <Container>
      <Typography
        variant="h4"
        gutterBottom
        style={{
          fontFamily: 'Times New Roman, serif',
          fontWeight: 'bold',
          color: '#000',
        }}
      >
        Gestión de Auditorías
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableContainer component={Paper} style={{ marginTop: "20px", width: "100%", borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Table>
              <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', color: '#333' }}>Fecha de Auditoría</TableCell>
                  <TableCell style={{ fontWeight: 'bold', color: '#333' }}>Nombre del Emisor</TableCell>
                  <TableCell style={{ fontWeight: 'bold', color: '#333' }}>Código de Verificación</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditorias.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((auditoria) => (
                  <TableRow key={auditoria._id} style={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
                    <TableCell>{new Date(auditoria.fechaAuditoria).toLocaleDateString("es-ES")}</TableCell>
                    <TableCell>{auditoria.nombreEmisor}</TableCell>
                    <TableCell>{auditoria.codigoVerificacion}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={auditorias.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </TableContainer>
        </Grid>
      </Grid>

      {/* Snackbar para mensajes de error */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Auditorias;
