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

  useEffect(() => {
    setOnibus(linhasOnibus); // Popula o estado com as linhas de ônibus
  }, []);

  const handleSelectChange = (e) => {
    setInputPesquisa(e.target.value.split('-')[0]); // Preenche o campo de pesquisa com o valor selecionado
  };

  const handleButtonClick = () => {
    const inputUsuario = inputPesquisa.toUpperCase();
    if (inputUsuario.length > 0) {
      setIsButtonDisabled(true); // Desabilita o botão
      fetch('/Itinerario.txt') // Caminho acessível no navegador
        .then((response) => response.text())
        .then((data) => processaArquivoTexto(data, inputUsuario))
        .catch((error) => console.error('Erro ao carregar o arquivo:', error));
      
      // Reabilita o botão após 10 segundos
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 5000);
    }
  };

  const processaArquivoTexto = (conteudo, inputUsuario) => {
    const linhas = conteudo.split('\n');
    let blocoAtual = '';
    let blocosTemp = [];
    let capturandoBloco = false;

    linhas.forEach((linha) => {
      if (linha.startsWith('Linha')) {
        if (capturandoBloco) {
          blocosTemp.push(blocoAtual);
          blocoAtual = '';
        }
        capturandoBloco = linha.toUpperCase().includes(inputUsuario);
      }
      if (capturandoBloco) {
        blocoAtual += linha + '\n';
      }
    });

    if (blocoAtual) {
      blocosTemp.push(blocoAtual);
    }

    if (blocosTemp.length > 0) {
      setBlocosEncontrados(blocosTemp); // Atualiza o estado com os blocos encontrados
      enviaParaServidor(blocosTemp); // Envia os blocos para o servidor
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
