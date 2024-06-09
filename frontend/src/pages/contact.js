import React from 'react';
import './contact.css';

function Contact() {
  return (
    <div className="contact">
      <div className="top">
        <h3>Sección de contacto</h3>
        <div className="iconos">
          <a href="https://www.facebook.com/">
            <svg>...</svg>
          </a>
          <a href="https://www.instagram.com/">
            <svg>...</svg>
          </a>
          <a href="https://www.twitter.com/">
            <svg>...</svg>
          </a>
        </div>
      </div>
      <div className="center">
        <div className="pregunta">
          <h2>¿Quieres conocer más sobre el planetario de tus sueños?</h2>
        </div>
        <div className="contenido">
          <div className="bug-reporter">
            <form>
              <h3>Bug Reporter</h3>
              <p>Reporta tu problema aquí:</p>
              <textarea name="bug" id="bug"></textarea>
              <button type="submit">Enviar</button>
            </form>
          </div>
        </div>
        <div className="mailto">
          <p>Escríbenos a:</p>
          <a href="mailto:planetarioDeTusSueños@gmail.com">planetarioDeTusSueños@gmail.com</a>
        </div>
      </div>
    </div>
  );
}

export default Contact;
