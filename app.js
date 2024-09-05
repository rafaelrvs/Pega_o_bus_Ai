
const btn = document.querySelector(".btn");
const inputPesquisa = document.querySelector(".pesquisa");
const resultadoDiv = document.getElementById("resultado");
const listaOnibusSelect = document.getElementById('lista-onibus');
const dataAtual = new Date();
let onibus = [];

// Populando o array onibus
linhasOnibus.forEach(linha => {
  onibus.push(linha);
});

// Loop para criar e exibir os itens do array como opções dentro do select
for (let i = 0; i < onibus.length; i++) {
  const optionItem = document.createElement('option'); // Cria um elemento option para cada item
  optionItem.value = onibus[i]; // Define o valor do option
  optionItem.textContent = onibus[i]; // Define o texto exibido no option
  listaOnibusSelect.appendChild(optionItem); // Insere o option dentro do elemento select
}

// Evento para preencher o campo de pesquisa com o valor selecionado no dropdown
listaOnibusSelect.addEventListener('change', function() {
  inputPesquisa.value = listaOnibusSelect.value.split("-")[0]; // Preenche o campo de pesquisa com o valor selecionado
});

// Evento de clique para buscar os resultados com base no input do usuário
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
      body: JSON.stringify({ text:`Me responda de forma resumida o próximo horário de ônibus de acordo com meu horário atual ${dataAtual} ${blocosEncontrados.join('\n\n') }` })
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