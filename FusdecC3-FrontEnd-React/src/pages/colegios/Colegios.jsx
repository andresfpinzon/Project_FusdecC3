import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

import { Edit, Delete, Info } from "@mui/icons-material";

const Colegios = () => {
  const [colegios, setColegios] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedColegio, setSelectedColegio] = useState(null);
  const [formValues, setFormValues] = useState({
    nombreColegio: "",
    emailColegio: "",
    estadoColegio: true,
    //estudiantes: [],
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [colegioToDelete, setColegioToDelete] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoColegio, setInfoColegio] = useState(null);

  
  

  //constante con promise.all para que se ejecuten en paralelo los fetch de colegios y estudiantes
  const fetchData = async () => {
    try {
      const [colegiosData, estudiantesData] = await Promise.all([
        fetch("http://localhost:3000/api/colegios").then((res) => res.json()),
        //fetch("http://localhost:3000/api/estudiantes").then((res) => res.json()),
      ]);
      setColegios(colegiosData);
      setEstudiantes(estudiantesData);
    } catch (error) {
      handleError("Error al cargar los datos");
    } 
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const handleError = (message) => {
    setErrorMessage(message);
    setOpenSnackbar(true);
  };

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSwitchChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.checked,
    });
  };

  const handleCreateColegio = async () => {
    /*
    if (!formValues.tituloEdicion || !formValues.fechaInicioEdicion || !formValues.fechaFinEdicion || !formValues.cursoId) {
      setErrorMessage("Todos los campos son obligatorios");
      setOpenSnackbar(true);
      return;
      }
    */
    try {
        const response = await fetch("http://localhost:3000/api/colegios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formValues),
        });

        // Maneja la respuesta
        if (response.ok) {
            const nuevoColegio = await response.json();
            setColegios([...colegios, nuevoColegio]);
            setFormValues({
              nombreColegio: "",
              emailColegio: "",
              estadoColegio: true,
              //estudiantes: [],
            });
            console.log('Colegio creado exitosamente:', nuevoColegio);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al crear colegio");
        }
    } catch (error) {
        handleError("Error al crear el colegio");
    }
};

  const handleUpdateColegio = async () => {
    if (!selectedColegio) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/colegios/${selectedColegio._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );

      if (response.ok) {
        const colegioActualizado = await response.json();
        setColegios(
          colegios.map((colegio) =>
            colegio._id === selectedColegio._id ? colegioActualizado : colegio
          )
        );
        setSelectedColegio(null);
        setFormValues({
          nombreColegio: "",
          emailColegio: "",
          estadoColegio: true,
          //estudiantes: [],
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el colegio");
      }
    } catch (error) {
      handleError("Error al actualizar el colegio");
    }
  };

  const handleDeleteColegio = async () => {
    if (!colegioToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/colegios/${colegioToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setColegios(colegios.filter((colegio) => colegio._id !== colegioToDelete._id));
        handleCloseDeleteDialog(); // Cierra el modal de confirmación después de eliminar
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar el colegio");
      }
    } catch (error) {
      handleError("Error al eliminar el colegio");
    }
  };

  const handleEditClick = (colegio) => {
    setSelectedColegio(colegio);
    setFormValues({
      nombreColegio: colegio.nombreColegio,
      emailColegio: colegio.emailColegio,
      estadoColegio: colegio.estadoColegio,
      //estudiantes: edicion.estudiantes || [],
    });
  };

  const handleDeleteClick = (colegio) => {
    setColegioToDelete(colegio);
    setOpenDeleteDialog(true);
  };

  const handleInfoClick = async (colegio) => {
    const response = await fetch(`http://localhost:3000/api/colegios/${colegio._id}`,);
    const data = await response.json();
    setInfoColegio(data);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setColegioToDelete(null);
  };

  return (
    <Container>
      <h1>Gestión de Colegio:</h1>
      <form noValidate autoComplete="off">
        <TextField
          label="Nombre del colegio"
          name="nombreColegio"
          value={formValues.nombreColegio}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email del colegio"
          name="emailColegio"
          value={formValues.emailColegio}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        {/*
        <FormControl fullWidth margin="normal">
          <InputLabel>Estudiantes</InputLabel>
          <Select
            multiple
            value={formValues.estudiantes}
            onChange={handleEditionChange}
            input={<OutlinedInput label="Estudiantes" />}
            renderValue={(selected) =>
              estudiantes
                .filter((estudiante) => selected.includes(estudiante._id))
                .map((estudiante) => estudiante.nombreEstudiante)
                .join(", ")
            }
          >
            
            {estudiantes.map((estudiante) => (
              <MenuItem key={estudiante._id} value={estudiante._id}>
                <Checkbox checked={formValues.estudiantes.indexOf(estudiante._id) > -1} />
                <ListItemText primary={estudiante.nombreEstudiante} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        */}

        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.estadoColegio}
            onChange={handleSwitchChange}
            name="estadoColegio"
            color="primary"
          />
          Estado Activo
        </Box>
        
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedColegio ? handleUpdateColegio : handleCreateColegio}
          >
            {selectedColegio? "Actualizar colegio" : "Crear colegio"}
          </Button>
        </Box>
      </form>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {colegios.map((colegio) => (
              <TableRow key={colegio._id}>
                <TableCell>{colegio.nombreColegio}</TableCell>
                <TableCell>{colegio.emailColegio}</TableCell>
                <TableCell>{colegio.estadoColegio ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(colegio)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleInfoClick(colegio)} color="primary">
                    <Info />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(colegio)}
                    color="secondary"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar colegio</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar a {colegioToDelete?.nombreColegio}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteColegio} color="secondary">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog}>
      <DialogTitle>Información de la Colegio</DialogTitle>
        <DialogContent>
          <Typography>Nombre: {infoColegio?.nombreColegio || "Nombre no disponible"}</Typography>
          <Typography>Email: {infoColegio?.emailColegio || "Email no disponible"}</Typography>
          <Typography>Estado: {infoColegio?.estadoColegio ? "Activo" : "Inactivo"}</Typography>
          <Typography> 
            estudiantes: {infoColegio?.estudiantes?.map((ca) => es.estudiantes).join(", ") || "Sin estudiantes"} 
          </Typography>
           
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseInfoDialog} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Colegios;