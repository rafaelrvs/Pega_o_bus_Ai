const btn = document.querySelector(".btn");
const inputPesquisa = document.querySelector(".pesquisa");
const resultadoDiv = document.getElementById("resultado");
const dataAtual = new Date();
btn.addEventListener('click', () => {
  const inputUsuario = inputPesquisa.value.toUpperCase(); 
  validaRua(inputUsuario);
});

function validaRua(inputUsuario) {
  if (inputUsuario.length > 0) {
    fetch('Intinerario.txt') 
      .then(response => response.text())
      .then(data => {
        processaArquivoTexto(data, inputUsuario);
      })
      .catch(error => console.error('Erro ao carregar o arquivo:', error));
  }
}

function processaArquivoTexto(conteudo, inputUsuario) {
  const linhas = conteudo.split('\n');
  let blocoAtual = '';
  let blocosEncontrados = [];
  let capturandoBloco = false;

  linhas.forEach(linha => {
    if (linha.startsWith('Linha')) {
      if (capturandoBloco) {
        blocosEncontrados.push(blocoAtual);
        blocoAtual = '';
      }
      capturandoBloco = linha.toUpperCase().includes(inputUsuario);
    }
    if (capturandoBloco) {
      blocoAtual += linha + '\n';
    }
  });
  
  if (blocoAtual) {
    blocosEncontrados.push(blocoAtual);
  }

  if (blocosEncontrados.length > 0) {
    console.log("Bloco(s) encontrado(s) correspondente(s) ao input do usuário:");
    console.log(blocosEncontrados.join('\n\n'));

    // Envia blocosEncontrados para o servidor no Render
    resultadoDiv.innerHTML = "Carregando..."; // Exibe a resposta gerada pelo AI no HTML
    fetch('https://api-bus-g6pv.onrender.com/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text:` Me responda de forma resumida o proximo horario de onibus de acordo com meu horario atual ${dataAtual} ${blocosEncontrados.join('\n\n') }` })
    })
    .then(response => response.json())
    .then(data => {
      resultadoDiv.innerHTML = data.resposta; // Exibe a resposta gerada pelo AI no HTML
    })
    .catch(error => console.error('Erro ao enviar para o servidor:', error));

  } else {
    console.log("Nenhum bloco correspondente encontrado.");
    resultadoDiv.innerHTML = "Nenhum bloco correspondente encontrado.";
  }
}
