/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Carrusel from "../../components/carrusel/Carrusel";
import { LocalHospital, School, MedicalServices, SearchOutlined } from '@mui/icons-material';

export default function Home() {
  const [cedula, setCedula] = useState('');
  const [codigo, setCodigo] = useState('');
  const [mostrarCodigo, setMostrarCodigo] = useState(false);
  const [certificadoVisible, setCertificadoVisible] = useState(false);

  const handleVerificarCedula = () => {
    if (cedula.trim() !== '') {
      setMostrarCodigo(true);
    }
  };

  const handleVerificarCodigo = () => {
    if (codigo.trim() === '123456') { // Código válido para la demostración
      setCertificadoVisible(true);
    } else {
      alert('Código inválido. Por favor intente nuevamente.');
    }
  };

  return (
    <div style={{
      fontFamily: "Arial, sans-serif",
      padding: "20px",
    }}>
      {/* Sección de Servicios */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '30px',
      }}>
        <h1 style={{
          fontSize: "3.5rem",
          fontWeight: "bold",
          color: "#1d526eff",
          textAlign: "center",
          marginBottom: "10px",
        }}>
          FUSDEC
        </h1>
        <p style={{
          fontSize: "1.4rem",
          color: "#333",
          textAlign: "center",
          maxWidth: "600px",
          lineHeight: "1.5",
        }}>
          Fundación dedicada a formar estudiantes en primeros auxilios
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
      }}>
        {/* Panel de Servicios */}
        <div style={{
          flex: '1 1 300px',
          maxWidth: '400px',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{
            color: '#e31837',
            textAlign: 'center',
            marginBottom: '15px',
            fontSize: '1.8rem',
          }}>
            Nuestros Servicios
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
          }}>
            {[{
              icon: <LocalHospital style={{ color: '#e31837', fontSize: '2rem' }} />,
              title: 'Primeros Auxilios',
              description: 'Atención inmediata y profesional en situaciones de emergencia'
            }, {
              icon: <School style={{ color: '#e31837', fontSize: '2rem' }} />,
              title: 'Capacitación',
              description: 'Formación especializada en técnicas de rescate y primeros auxilios'
            }, {
              icon: <MedicalServices style={{ color: '#e31837', fontSize: '2rem' }} />,
              title: 'Servicios Médicos',
              description: 'Asistencia médica preventiva y de emergencia'
            }].map((service, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                {service.icon}
                <h3 style={{
                  color: '#1d526eff',
                  margin: '10px 0',
                }}>{service.title}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Carrusel y Verificación */}
        <div style={{
          flex: '2 1 600px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          <Carrusel />

          <div style={{
            backgroundColor: '#ffffff',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '2px solid #1d526eff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#1d526eff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <SearchOutlined style={{
                fontSize: '2.5rem',
                color: 'white',
              }} />
            </div>

            <h3 style={{
              color: '#1d526eff',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              textAlign: 'center',
              margin: '0',
            }}>
              Verificar Certificado
            </h3>

            <p style={{
              color: '#666',
              fontSize: '1rem',
              textAlign: 'center',
              margin: '0',
              lineHeight: '1.5',
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
                outline: 'none',
                transition: 'border-color 0.3s ease',
              }}
            />

            <button
              onClick={handleVerificarCedula}
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
                transition: 'background-color 0.3s ease',
              }}
            >
              Verificar
            </button>

            {mostrarCodigo && (
              <>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Código de verificación"
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                  }}
                />

                <button
                  onClick={handleVerificarCodigo}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1d526eff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  Verificar Código
                </button>
              </>
            )}

            {certificadoVisible && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <iframe
                  src="/src/assets/certificates/MIRAVALLE.pdf"
                  title="Certificado"
                  width="100%"
                  height="500px"
                  style={{ border: 'none' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
