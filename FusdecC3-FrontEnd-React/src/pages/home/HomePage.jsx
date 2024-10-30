import React from 'react';
import img1 from '.../assets/images/img1';
import img2 from '.../assets/images/img2';
import img3 from '.../assets/images/img3';
import img4 from '.../assets/images/img4';

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="display-4">FUSDEC</h1>

      <div
        id="carouselExampleIndicators"
        className="carousel slide"
        data-bs-ride="carousel"
        style={{ maxWidth: '550px', maxHeight: '800px', margin: '0 auto' }}
      >
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
        </div>

        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={img1} className="d-block w-100" alt="Descripción de la imagen 1" style={{ objectFit: 'cover', height: '520px' }} />
          </div>
          <div className="carousel-item">
            <img src={img2} className="d-block w-100" alt="Descripción de la imagen 2" style={{ objectFit: 'cover', height: '520px' }} />
          </div>
          <div className="carousel-item">
            <img src={img3} className="d-block w-100" alt="Descripción de la imagen 3" style={{ objectFit: 'cover', height: '520px' }} />
          </div>
          <div className="carousel-item">
            <img src={img4} className="d-block w-100" alt="Descripción de la imagen 4" style={{ objectFit: 'cover', height: '520px' }} />
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  )
};
