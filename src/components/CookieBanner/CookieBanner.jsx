import React, { useState, useEffect } from 'react';
import styles from './CookieBanner.module.css'; // Estilos do banner de cookies

const CookieBanner = ({ onAccept }) => {
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  useEffect(() => {
    const consentGiven = localStorage.getItem('cookieConsent');
    if (!consentGiven) {
      setIsBannerVisible(true); // Exibe o banner se o consentimento não foi dado
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true'); // Armazena o consentimento
    setIsBannerVisible(false); // Oculta o banner
    onAccept(); // Chama a função para carregar os cookies ou scripts
  };

  return (
    isBannerVisible && (
      <div className={styles.cookieBanner}>
        <p>
          Usamos cookies para personalizar anúncios e melhorar sua experiência.
          Ao continuar, você aceita o uso de cookies de terceiros.
        </p>
        <button onClick={handleAcceptCookies} className={styles.acceptButton}>
          Aceitar
        </button>
      </div>
    )
  );
};

export default CookieBanner;
