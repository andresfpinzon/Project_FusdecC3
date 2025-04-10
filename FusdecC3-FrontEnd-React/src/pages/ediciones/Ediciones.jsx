/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    TextField, 
    Button, 
    Grid, 
    Paper, 
    TableContainer, 
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody, 
    IconButton, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    Snackbar,
    Alert
} from '@mui/material';
import { Edit, Delete, Close } from '@mui/icons-material';

const token = localStorage.getItem("token");

const Ediciones = () => {
    const [ediciones, setEdiciones] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [selectedEdicion, setSelectedEdicion] = useState(null);
    const [formValues, setFormValues] = useState({
        tituloEdicion: '',
        fechaInicioEdicion: '',
        fechaFinEdicion: '',
        estadoEdicion: true,
        cursoId: '',
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Fetch cursos and ediciones on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch cursos
                const cursosResponse = await fetch('http://localhost:3000/api/cursos',{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token 
                    }
                });
                if (cursosResponse.ok) {
                    const cursosData = await cursosResponse.json();
                    setCursos(cursosData);
                }

                // Fetch ediciones
                const edicionesResponse = await fetch('http://localhost:3000/api/ediciones',{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token 
                    }
                });
                if (edicionesResponse.ok) {
                    const edicionesData = await edicionesResponse.json();
                    setEdiciones(edicionesData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setSnackbarMessage('Error al cargar datos');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        };

        fetchData();
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Submit form to create or update edition
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const edicionData = {
                tituloEdicion: formValues.tituloEdicion,
                cursoId: formValues.cursoId,
                fechaInicioEdicion: formValues.fechaInicioEdicion,
                fechaFinEdicion: formValues.fechaFinEdicion,
                estadoEdicion: formValues.estadoEdicion,
            };

            const url = selectedEdicion 
                ? `http://localhost:3000/api/ediciones/${selectedEdicion._id}` 
                : 'http://localhost:3000/api/ediciones';
            
            const method = selectedEdicion ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token 
                },
                body: JSON.stringify(edicionData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Error al guardar la edición');
            }

            // Refresh ediciones list
            const updatedEdicionesResponse = await fetch('http://localhost:3000/api/ediciones',{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token 
                }
            });
            const updatedEdiciones = await updatedEdicionesResponse.json();
            setEdiciones(updatedEdiciones);

            // Reset form and close dialog
            setFormValues({
                tituloEdicion: '',
                fechaInicioEdicion: '',
                fechaFinEdicion: '',
                estadoEdicion: true,
                cursoId: '',
            });
            setSelectedEdicion(null);
            setOpenDialog(false);

            // Show success message
            setSnackbarMessage(selectedEdicion 
                ? 'Edición actualizada exitosamente' 
                : 'Edición creada exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

        } catch (error) {
            console.error('Error:', error);
            setSnackbarMessage(error.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    // Edit an existing edition
    const handleEdit = (edicion) => {
        setSelectedEdicion(edicion);
        setFormValues({
            tituloEdicion: edicion.tituloEdicion,
            fechaInicioEdicion: edicion.fechaInicioEdicion,
            fechaFinEdicion: edicion.fechaFinEdicion,
            estadoEdicion: edicion.estadoEdicion,
            cursoId: edicion.cursoId?._id || '',
        });
        setOpenDialog(true);
    };

    // Delete an edition (soft delete)
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/ediciones/${id}`,{
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token 
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la edición');
            }

            // Refresh ediciones list
            const updatedEdicionesResponse = await fetch('http://localhost:3000/api/ediciones',{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token 
                }
            });
            const updatedEdiciones = await updatedEdicionesResponse.json();
            setEdiciones(updatedEdiciones);

            // Show success message
            setSnackbarMessage('Edición eliminada exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

        } catch (error) {
            console.error('Error:', error);
            setSnackbarMessage(error.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Gestión de Ediciones
            </Typography>

            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => {
                    setSelectedEdicion(null);
                    setFormValues({
                        tituloEdicion: '',
                        fechaInicioEdicion: '',
                        fechaFinEdicion: '',
                        estadoEdicion: true,
                        cursoId: '',
                    });
                    setOpenDialog(true);
                }}
            >
                Crear Nueva Edición
            </Button>

            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell>Curso</TableCell>
                            <TableCell>Fecha Inicio</TableCell>
                            <TableCell>Fecha Fin</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ediciones.map((edicion) => (
                            <TableRow key={edicion._id}>
                                <TableCell>{edicion.tituloEdicion}</TableCell>
                                <TableCell>{edicion.cursoId?.nombreCurso || 'Sin Curso'}</TableCell>
                                <TableCell>{edicion.fechaInicioEdicion ? new Date(edicion.fechaInicioEdicion).toLocaleDateString() : 'N/A'}</TableCell>
                                <TableCell>{edicion.fechaFinEdicion ? new Date(edicion.fechaFinEdicion).toLocaleDateString() : 'N/A'}</TableCell>
                                <TableCell>{edicion.estadoEdicion ? 'Activo' : 'Inactivo'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(edicion)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(edicion._id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>
                    {selectedEdicion ? 'Editar Edición' : 'Crear Nueva Edición'}
                    <IconButton 
                        onClick={() => setOpenDialog(false)} 
                        style={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Título de la Edición"
                                    name="tituloEdicion"
                                    value={formValues.tituloEdicion}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Curso"
                                    name="cursoId"
                                    select
                                    value={formValues.cursoId || ''}
                                    onChange={handleInputChange}
                                    required
                                    SelectProps={{ native: true }}
                                >
                                    <option value="">Seleccionar Curso</option>
                                    {cursos.map((curso) => (
                                        <option key={curso._id} value={curso._id}>
                                            {curso.nombreCurso}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Fecha de Inicio"
                                    type="date"
                                    name="fechaInicioEdicion"
                                    value={formValues.fechaInicioEdicion}
                                    onChange={handleInputChange}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Fecha de Fin"
                                    type="date"
                                    name="fechaFinEdicion"
                                    value={formValues.fechaFinEdicion}
                                    onChange={handleInputChange}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained">
                        {selectedEdicion ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={6000} 
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setOpenSnackbar(false)} 
                    severity={snackbarSeverity}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Ediciones;