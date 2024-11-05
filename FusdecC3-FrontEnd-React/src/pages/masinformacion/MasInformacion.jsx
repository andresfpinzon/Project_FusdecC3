import React from "react";
import { Box, Typography, Card, CardContent, CardHeader, Grid, Divider } from "@mui/material";
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

export default function MasInformacion() {
  return (
    <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 3, fontWeight: 'bold', color: '#1d526eff' }}>
        Información sobre la Fundación Socorristas de Colombia (Fusdec)
      </Typography>

      <Card variant="outlined" sx={{ marginBottom: 4 }}>
        <CardHeader title="Información General" sx={{ backgroundColor: '#1d526eff', color: '#fff' }} />
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <PhoneIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">Teléfono de contacto: <strong>3125921742</strong></Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <HomeIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">Dirección: <strong>Av. Calle 26 # 68B-70, Bogotá</strong></Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <DescriptionIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">Línea Nacional: <strong>01 8000 110 21113</strong></Typography>
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ marginBottom: 4 }}>
        <CardHeader title="Actividades y Programas" sx={{ backgroundColor: '#1d526eff', color: '#fff' }} />
        <CardContent>
          <Typography variant="body1" mb={2}>
            Fusdec se dedica a diversas actividades, entre las cuales destacan:
          </Typography>
          <Box display="flex" alignItems="flex-start" mb={2}>
            <AssignmentIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">Servicio Social Estudiantil: Ofrecen programas a instituciones educativas para fomentar la participación de los estudiantes en actividades sociales y comunitarias.</Typography>
          </Box>
          <Box display="flex" alignItems="flex-start">
            <LocalHospitalIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">Prevención de Riesgos: Colaboran con entidades educativas para realizar diagnósticos de prevención del riesgo en colegios, mejorando la seguridad ante emergencias.</Typography>
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardHeader title="Objetivos" sx={{ backgroundColor: '#1d526eff', color: '#fff' }} />
        <CardContent>
          <Typography variant="body1">
            El enfoque de Fusdec está en:
          </Typography>
          <Box display="flex" alignItems="flex-start" mb={2}>
            <AssignmentIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">Capacitar a la comunidad en temas de primeros auxilios y respuesta ante emergencias.</Typography>
          </Box>
          <Box display="flex" alignItems="flex-start">
            <AssignmentIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">Promover la cultura de prevención y atención oportuna en situaciones críticas.</Typography>
          </Box>
          <Typography variant="body1" mt={2}>
            La fundación juega un papel importante en la formación de socorristas y en la sensibilización sobre la importancia de estar preparados ante cualquier eventualidad.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

