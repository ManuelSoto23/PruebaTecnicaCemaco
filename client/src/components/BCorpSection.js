import React from "react";
import "./BCorpSection.css";

const BCorpSection = () => {
  return (
    <div className="b-corp-section">
      <div className="b-corp-content-wrapper">
        <div className="b-corp-box b-corp-logo-box">
          <h4 className="b-corp-box-title">Empresa</h4>
          <div className="b-corp-logo">
            <div className="b-corp-circle">B</div>
            <div className="b-corp-certified-wrapper">
              <div className="b-corp-line"></div>
              <span className="b-corp-certified">Certificada</span>
            </div>
          </div>
        </div>

        <div className="b-corp-box b-corp-text-box">
          <p className="b-corp-title">Somos una empresa B</p>
          <p className="b-corp-description">
            Estamos orgullosos de ser reconocidos por los más altos estándares
            de sostenibilidad social y ambiental.
          </p>
          <a href="#" className="b-corp-link">
            Conoce más
          </a>
        </div>

        <div className="b-corp-box b-corp-reviews-box">
          <div className="reviews-badge">
            <div className="reviews-number">548K</div>
            <div className="reviews-stars">★★★★★</div>
            <div className="reviews-label">
              <span>Opiniones</span>
              <span>certificadas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BCorpSection;
