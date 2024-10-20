import React, { useState, useEffect } from 'react';
import styles from './Main.module.css';
import { linhasOnibus } from '../../dados';
import CookieBanner from '../CookieBanner/CookieBanner';
import { mapa } from '../../mapa';
import { ativaFrame, processaArquivoTexto } from '../utils';
import Carousel from '../Carousel';
import Modal from '../Modal/Modal';

const Main = () => {
  const [inputPesquisa, setInputPesquisa] = useState(''); 
  const [resultado, setResultado] = useState(''); 
  const [blocosEncontrados, setBlocosEncontrados] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); 
  const [linkframe, setLinkframe] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla o modal
  const dataAtual = new Date();

  // Verifica se os termos foram aceitos ao carregar o componente
  useEffect(() => {
    const termosAceitos = localStorage.getItem('termosAceitos');
    if (!termosAceitos) {
      setIsModalOpen(true); // Abre o modal se os termos não foram aceitos
    }
  }, []);

  const handleSelectChange = (e) => {
    setInputPesquisa(e.target.value.split('-')[0]);
  };

  const handleCookieAccept = () => {
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7736006621106112';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);
  };

  const handleButtonClick = () => {
    const termosAceitos = localStorage.getItem('termosAceitos');
    if (!termosAceitos) {
      alert("Por favor, aceite os Termos de Uso antes de consultar.");
      setIsModalOpen(true); // Reabre o modal se os termos não foram aceitos
      return;
    }

    const inputUsuario = inputPesquisa.toUpperCase();

    ativaFrame(inputUsuario, mapa, setLinkframe);

    if (inputUsuario.length > 0) {
      setIsButtonDisabled(true);
      fetch('/Itinerario.txt')
        .then((response) => response.text())
        .then((data) => processaArquivoTexto(data, inputUsuario, setBlocosEncontrados, setResultado, enviaParaServidor))
        .catch((error) => console.error('Erro ao carregar o arquivo:', error))
        .finally(() => {
          setTimeout(() => setIsButtonDisabled(false), 5000);
        });
    }
  };

  const enviaParaServidor = (blocos) => {
    setResultado('Em desenvolvimento...');

    fetch('https://api-bus-g6pv.onrender.com/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: `Me responda de forma resumida o próximo horário de ônibus de acordo com meu horário atual ${dataAtual} ${blocos.join('\n\n')}`,
      }),
    })
    .then((response) => response.json())
    .then((data) => setResultado(data.resposta))
    .catch((error) => {
      console.error('Erro ao enviar para o servidor:', error);
      setResultado('Erro ao processar a solicitação.');
    });
  };

  // Função para aceitar os termos
  const handleAcceptTerms = () => {
    localStorage.setItem('termosAceitos', 'true'); // Salva a aceitação no localStorage
    setIsModalOpen(false); // Fecha o modal ao aceitar
  };

  // Função para fechar o modal sem aceitar os termos (mantém o modal aberto na próxima tentativa)
  const handleCloseModal = () => {
    alert("Você precisa aceitar os Termos de Uso para continuar.");
    setIsModalOpen(true); // Reabre o modal
  };

  return (
    <section className={styles.section}>
      <img className={styles.img} src="/image/onibus.svg" alt="Logo" />
      
      <Carousel />
      <div className={styles.containerChat}>
        <div className={styles.header}>
          <p>Consulte seu ônibus</p>
        </div>

        <select className={styles.option} onChange={handleSelectChange} value={inputPesquisa}>
          <option className={styles.option} value="">
            Selecione a linha
          </option>
          {linhasOnibus.map((linha, index) => (
            <option key={index} value={linha}>
              {linha}
            </option>
          ))}
        </select>

        <input
          className={styles.inputText}
          type="text"
          value={inputPesquisa}
          onChange={(e) => setInputPesquisa(e.target.value)}
          placeholder="Digite seu ônibus!"
        />

        <div className={styles.resultado}>
          <p>{resultado}</p>
        </div>
        <div className={styles.containerBtn}>
          {isButtonDisabled ? (
            <div className={styles.loadingSpinner}>
              {isButtonDisabled ? null : 'Buscar'}
            </div>
          ) : (
            <input
              className={styles.inputBtn}
              type="button"
              value="Buscar"
              onClick={handleButtonClick}
              disabled={isButtonDisabled}
            />
          )}
        </div>
      </div>
      <iframe className={styles.frame} src={linkframe} frameBorder="0" title="Mapa do ônibus"></iframe>
      <CookieBanner onAccept={handleCookieAccept} />
      
      {/* Componente Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} onAccept={handleAcceptTerms}>
        <p>Este é o texto padrão dos Termos de Uso e Política de Privacidade.</p>
        <button onClick={handleAcceptTerms} className={styles.acceptTermsBtn}>Aceitar Termos</button>
      </Modal>
    </section>
  );
};

export default Main;
