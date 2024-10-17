import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <button className={styles.closeBtn} onClick={onClose}>X</button>
        </div>
        <div className={styles.modalBody}>
          <h2>Termos de Uso e Política de Privacidade</h2>
          <p>
            Ao utilizar este site, você concorda com os seguintes Termos de Uso e a Política de Privacidade:
            <br /><br />
            1. Coletamos dados para melhorar a experiência do usuário.
            <br />
            2. Garantimos a privacidade de seus dados de acordo com a legislação vigente.
            <br />
            3. Ao aceitar, você concorda com o uso de cookies e outros mecanismos de rastreamento para análise de comportamento de navegação.
            <br /><br />
            Por favor, leia todos os termos com atenção antes de aceitar.
          </p>
          <div className={styles.buttonsContainer}>
            <button className={styles.acceptBtn} onClick={onAccept}>Aceitar os Termos</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
