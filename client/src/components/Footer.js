import React, { useState } from "react";
import {
  FaStore,
  FaEnvelope,
  FaWhatsapp,
  FaPhone,
  FaComments,
  FaTiktok,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaPinterest,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import BCorpSection from "./BCorpSection";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Email suscrito:", email);
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="footer-top-bar">
        <div className="footer-top-container">
          <a
            href="https://www.cemaco.com/tiendas"
            className="footer-top-link"
            target="_blank"
            rel="noreferrer"
          >
            <FaStore className="footer-icon" />
            <span>Tiendas</span>
          </a>
          <a href="mailto:tusamigos@cemaco.com" className="footer-top-link">
            <FaEnvelope className="footer-icon" />
            <span>tusamigos@cemaco.com</span>
          </a>
          <a
            href="https://api.whatsapp.com/send/?phone=%2B50224999990&text&app_absent=0"
            className="footer-top-link"
            target="_blank"
            rel="noreferrer"
          >
            <FaWhatsapp className="footer-icon" />
            <span>Compra por WhatsApp</span>
          </a>
          <a href="tel:+50224999990" className="footer-top-link">
            <FaPhone className="footer-icon" />
            <span>(502) 2499-9990</span>
          </a>
          <a
            href="https://api.whatsapp.com/send/?phone=%2B50224999990&text&app_absent=0"
            className="footer-top-link"
            target="_blank"
            rel="noreferrer"
          >
            <FaComments className="footer-icon" />
            <span>Chat en línea</span>
          </a>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-main-container">
          <div className="footer-links-section">
            <div className="footer-links-column">
              <h4>Servicios</h4>
              <ul>
                <li>
                  <a href="#">Instalaciones</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Tiendas</a>
                </li>
                <li>
                  <a href="#">Privilegio</a>
                </li>
                <li>
                  <a href="#">Servicio a empresas</a>
                </li>
                <li>
                  <a href="#">Bodas</a>
                </li>
                <li>
                  <a href="#">Actividades</a>
                </li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h4>Nuestros valores</h4>
              <ul>
                <li>
                  <a href="#">Sostenibilidad</a>
                </li>
                <li>
                  <a href="#">Garantía total</a>
                </li>
                <li>
                  <a href="#">Sistema B</a>
                </li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h4>Venta en línea</h4>
              <ul>
                <li>
                  <a href="#">Retirar en tienda</a>
                </li>
                <li>
                  <a href="#">Métodos de pago</a>
                </li>
                <li>
                  <a href="#">Preguntas frecuentes</a>
                </li>
                <li>
                  <a href="#">Descargar aplicación</a>
                </li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h4>Grupo Cemaco</h4>
              <ul>
                <li>
                  <a href="#">Únete a nuestro equipo</a>
                </li>
                <li>
                  <a href="#">Sobre nosotros</a>
                </li>
                <li>
                  <a href="#">Deseas ser proveedor</a>
                </li>
                <li>
                  <a href="#">Juguetón</a>
                </li>
                <li>
                  <a href="#">Bebé Juguetón</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-right-section">
            <BCorpSection />
            <div className="footer-subscribe">
              <h4>Suscríbete</h4>
              <p>Recibe ofertas, beneficios y noticias</p>
              <form onSubmit={handleSubscribe} className="subscribe-form">
                <input
                  type="email"
                  placeholder="Tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="subscribe-input"
                />
                <button type="submit" className="subscribe-button">
                  SUSCRIBIRME
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="footer-bottom-links">
            <a
              href="https://www.cemaco.com/privacidad-y-seguridad"
              target="_blank"
              rel="noreferrer"
            >
              Privacidad
            </a>
            <a
              href="https://www.cemaco.com/terminos-y-condiciones"
              target="_blank"
              rel="noreferrer"
            >
              Términos y condiciones
            </a>
          </div>
          <div className="footer-social">
            <a
              href="https://www.tiktok.com/@cemacogt_oficial?_t=8nYaIo29LN8&_r=1"
              aria-label="TikTok"
              className="social-icon"
              target="_blank"
              rel="noreferrer"
            >
              <FaTiktok />
            </a>
            <a
              href="https://www.facebook.com/cemacogt"
              aria-label="Facebook"
              className="social-icon"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.instagram.com/accounts/login/?next=%2Fcemacoguate%2F&source=omni_redirect"
              aria-label="Instagram"
              className="social-icon"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://x.com/cemaco_gt"
              aria-label="X (Twitter)"
              className="social-icon"
              target="_blank"
              rel="noreferrer"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://www.youtube.com/user/cemacogt"
              aria-label="YouTube"
              className="social-icon"
              target="_blank"
              rel="noreferrer"
            >
              <FaYoutube />
            </a>
            <a
              href="https://mx.pinterest.com/cemacoguatemala/_created/"
              aria-label="Pinterest"
              className="social-icon"
              target="_blank"
              rel="noreferrer"
            >
              <FaPinterest />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
