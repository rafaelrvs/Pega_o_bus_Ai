import React, { useState, useEffect } from 'react';
import styles from './Main.module.css';
import { linhasOnibus } from '../../dados';
import CookieBanner from '../CookieBanner/CookieBanner';
import { ativaFrame } from '../utils';
import Carousel from '../Carousel';
import Modal from '../Modal/Modal';
import mapa from './../../mapa.js';
import axios from 'axios';

const Main = () => {
  const [inputPesquisa, setInputPesquisa] = useState(''); 
  const [resultado, setResultado] = useState(''); 
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); 
  const [linkframe, setLinkframe] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla o modal
  const dataAtual = new Date().toLocaleTimeString(); // Formata o horário atual

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
    setIsButtonDisabled(true);
    
    if (!termosAceitos) {
      alert("Por favor, aceite os Termos de Uso antes de consultar.");
      setIsModalOpen(true); // Reabre o modal se os termos não foram aceitos
      return;
    }
  
    const inputUsuario = inputPesquisa.trim().toUpperCase(); // Usando trim() para remover espaços extras
  
    if (inputUsuario.length === 0) {
      alert("Por favor, digite o código da linha de ônibus.");
      return;
    }
  
    ativaFrame(inputUsuario, mapa, setLinkframe); // Presumindo que essa função está correta
    
  
    // Fazer a requisição para buscar os dados da API, passando o código da linha como parâmetro
    axios.get(`https://api-bus-g6pv.onrender.com/escolhaOnibus?codigo=${inputUsuario.trim()}`)
      .then((response) => {
        const data = response.data;
          enviaParaServidor(data);
      
         
      })
      .catch((error) => {
        console.error('Erro ao carregar os dados da API:', error);
        setResultado('Erro ao buscar os dados da linha de ônibus.');
      })
      .finally(() => {
        setTimeout(() => setIsButtonDisabled(false), 3000); 
      });
  };
  
  const formataHorariosParaEnvio = (horarios) => {
    return Object.keys(horarios).map(dia => {
        const horas = horarios[dia].join(', ');
        return `${dia}: ${horas}`;
    }).join(' | ');
};

const enviaParaServidor = (dados) => {
  console.log(dados);
  
    if (!dados.horarios || Object.keys(dados.horarios).length === 0) {
        console.error('Horários não encontrados:', dados); // Verifica se os horários estão presentes
        setResultado('Horários não encontrados.');
        return;
    }

    const horariosFormatados = formataHorariosParaEnvio(dados.horarios);


    setResultado('Consultando o próximo horário de ônibus...');

    axios.post('https://api-bus-g6pv.onrender.com/analyze', {
        text: `Me responda de forma resumida o próximo horário de ônibus de acordo com meu horário atual (${dataAtual}). mais informações(${JSON.stringify(dados)})`,
        horarios: JSON.stringify(horariosFormatados),
    
    })
    .then((response) => {

        const resposta = response.data?.resposta || 'Resposta não encontrada';
        setResultado(resposta); // Exibir a resposta da API do Chat
    })
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
