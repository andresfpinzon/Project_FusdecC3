import React, { useState } from 'react';
import Carrusel from "../../components/carrusel/Carrusel";
import { LocalHospital, School, MedicalServices, SearchOutlined } from '@mui/icons-material';

export default function Home() {
  const [cedula, setCedula] = useState('');

  return (
    <div style={{ 
      display: 'flex', 
      fontFamily: "Arial, sans-serif", 
      padding: "5px 20px",
      gap: "20px",
      marginTop: "10px"
    }}>
      <div style={{ 
        width: '300px',
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          color: '#e31837',
          textAlign: 'center',
          marginBottom: '15px',
          fontSize: '1.8rem'
        }}>
          Nuestros Servicios
        </h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <LocalHospital style={{ color: '#e31837', fontSize: '2rem' }} />
            <h3 style={{ color: '#1d526eff', margin: '10px 0' }}>Primeros Auxilios</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Atención inmediata y profesional en situaciones de emergencia
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <School style={{ color: '#e31837', fontSize: '2rem' }} />
            <h3 style={{ color: '#1d526eff', margin: '10px 0' }}>Capacitación</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Formación especializada en técnicas de rescate y primeros auxilios
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <MedicalServices style={{ color: '#e31837', fontSize: '2rem' }} />
            <h3 style={{ color: '#1d526eff', margin: '10px 0' }}>Servicios Médicos</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Asistencia médica preventiva y de emergencia
            </p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ 
          marginBottom: '10px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: 'translateX(-200px)'
        }}>
          <h1 style={{ 
            fontSize: "3.5rem", 
            fontWeight: "bold", 
            color: "#1d526eff", 
            marginBottom: "15px",
            letterSpacing: "2px"
          }}>
            FUSDEC
          </h1>
          <p style={{ 
            fontSize: "1.4rem", 
            color: "#333", 
            maxWidth: "600px",
            lineHeight: "1.5",
            margin: '0 auto'
          }}>
            Fundación dedicada a formar estudiantes en primeros auxilios
          </p>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: '2' }}>
            <Carrusel />
          </div>
          
          <div style={{
            flex: '1',
            backgroundColor: '#ffffff',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '2px solid #1d526eff',
            minWidth: '300px',
            maxWidth: '350px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#1d526eff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px'
            }}>
              <SearchOutlined style={{ 
                fontSize: '2.5rem', 
                color: 'white' 
              }} />
            </div>

            <h3 style={{
              color: '#1d526eff',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              textAlign: 'center',
              margin: '0'
            }}>
              Verificar Certificado
            </h3>

            <p style={{
              color: '#666',
              fontSize: '1rem',
              textAlign: 'center',
              margin: '0',
              lineHeight: '1.5'
            }}>
              Digite su número de documento para verificar su certificado
            </p>

            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Número de documento"
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '8px',
                border: '2px solid #e0e0e0',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                outline: 'none',
                ':focus': {
                  borderColor: '#1d526eff',
                  boxShadow: '0 0 0 2px rgba(29, 82, 110, 0.1)'
                }
              }}
            />

            <button
              onClick={() => console.log('Verificando:', cedula)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#e31837',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                ':hover': {
                  backgroundColor: '#c41230',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Verificar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



