import React, { useState, useEffect } from 'react';
import styles from './Main.module.css';
import { linhasOnibus } from '../../dados';


const Main = () => {
  const [onibus, setOnibus] = useState([]); // Armazena a lista de ônibus
  const [inputPesquisa, setInputPesquisa] = useState(''); // Campo de pesquisa
  const [resultado, setResultado] = useState(''); // Resultado a ser exibido
  const [blocosEncontrados, setBlocosEncontrados] = useState([]); // Armazena os blocos encontrados no arquivo
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Estado para desabilitar o botão
  const dataAtual = new Date();
  
  
  setOnibus(linhasOnibus); 
  
  
  const handleSelectChange = (e) => {
    setInputPesquisa(e.target.value.split('-')[0]); // Preenche o campo de pesquisa com o valor selecionado
  };
  
  const handleButtonClick = () => {
    const inputUsuario = inputPesquisa.toUpperCase();
    if (inputUsuario.length > 0) {
      setIsButtonDisabled(true); // Desabilita o botão
      fetch('/Itinerario.txt') 
      .then((response) => response.text())
      .then((data) => processaArquivoTexto(data, inputUsuario))
      .catch((error) => console.error('Erro ao carregar o arquivo:', error))
      .finally(() => {
        setIsButtonDisabled(false); // Só reabilita após o processo
      });
    }
  };
  
  
  const processaArquivoTexto = (conteudo, inputUsuario) => {
    const linhas = conteudo.split('\n');
    let blocoAtual = '';
    let blocosTemp = [];
    let capturandoBloco = false;
    
    
    
    linhas.forEach((linha) => {
      if (linha.startsWith('Linha')) {
        if (capturandoBloco && blocoAtual) {
          blocosTemp.push(blocoAtual); // Armazena o bloco anterior
        }
        capturandoBloco = linha.toUpperCase().includes(inputUsuario);
        blocoAtual = capturandoBloco ? linha + '\n' : ''; // Reseta o bloco atual
      } else if (capturandoBloco) {
        blocoAtual += linha + '\n'; // Continua capturando o bloco
      }
    });
    
    // Captura o último bloco
    if (capturandoBloco && blocoAtual) {
      blocosTemp.push(blocoAtual);
    }
    
    if (blocosTemp.length > 0) {
      setBlocosEncontrados(blocosTemp);
      enviaParaServidor(blocosTemp);
    } else {
      setResultado('Nenhum bloco correspondente encontrado.');
    }
  };
  
  const enviaParaServidor = (blocos) => {
    setResultado('Carregando...');
    
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
    .then((data) => setResultado(data.resposta)) // Exibe a resposta do servidor
    .catch((error) => {
      console.error('Erro ao enviar para o servidor:', error);
      setResultado('Erro ao processar a solicitação.');
    });
  };
  
  return (
    <section className={styles.section}>
      <img className={styles.img} src="/image/onibus.svg" alt="Logo" />
      <div className={styles.containerChat}>
        <div className={styles.header}>
          <p>Consulte seu ônibus</p>
        </div>

        <select
          className={styles.option}
          onChange={handleSelectChange}
          value={inputPesquisa}
        >
          <option className={styles.option} value="">Selecione a linha</option>
          {onibus.map((linha, index) => (
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

        <input
          className={isButtonDisabled?styles.btnInativo:styles.inputBtn}
          type="button"
          value="Buscar"
          onClick={handleButtonClick}
          disabled={isButtonDisabled} // Botão será desativado por 10 segundos
        />
      </div>
    </section>
  );
};

export default Main;
