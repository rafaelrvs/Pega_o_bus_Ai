import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate para navegação
import styles from './SaibaMais.module.css';
import { textos } from './dataSaibaMais'; // Importando o array de textos de outro arquivo

const SaibaMais = () => {
  const navigate = useNavigate(); // Hook para controlar a navegação

  return (
    <div className={styles.containerSaibaMais}>
      {/* Botão de Voltar */}
      <button className={styles.voltarBtn} onClick={() => navigate('/')}>
        Voltar
      </button>

      {/* Blocos de Leis e Dicas */}
      {textos.map((texto, index) => (
        <div key={index} className={styles.textoContainer}>
          <h3 className={styles.titulo}>{texto.titulo}</h3>
          <p className={styles.descricao}>{texto.descricao}</p>
        </div>
      ))}

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.enderecoContainer}>
          <h3 className={styles.enderecoTitulo}>Endereço</h3>
          <p className={styles.enderecoDescricao}>
            Prefeitura de Mogi das Cruzes<br />
            Av. Ver. Narciso Yague Guimarães, 277<br />
            Centro Cívico<br />
            CEP 08780-900<br />
            Mogi das Cruzes/SP
          </p>

          <h3 className={styles.faleConoscoTitulo}>Fale Conosco</h3>
          <p className={styles.faleConoscoDescricao}>
            Segunda a sexta, das 8 às 17 horas<br />
            <strong>Telefone:</strong> 4798-5000<br />
            <strong>Serviços:</strong> 162<br />
            <strong>Ouvidoria:</strong> 156<br />
            <strong>Semae:</strong> 115<br />
            <strong>Saúde:</strong> 160<br />
            <strong>Guarda Municipal:</strong> 153
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SaibaMais;
