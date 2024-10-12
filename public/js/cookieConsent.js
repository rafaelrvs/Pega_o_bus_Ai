// Espera que o DOM esteja totalmente carregado para executar a lógica
document.addEventListener('DOMContentLoaded', function () {
  // Verifica se o consentimento já foi dado e está salvo no armazenamento local
  if (!localStorage.getItem('cookieConsent')) {
    // Se não houver consentimento, exibe o banner de consentimento
    const cookieConsent = document.getElementById('cookieConsent');
    if (cookieConsent) {
      cookieConsent.style.display = 'block';
    }
  }

  // Adiciona um evento para o botão "Aceitar Cookies"
  const acceptCookiesButton = document.getElementById('acceptCookies');
  if (acceptCookiesButton) {
    acceptCookiesButton.addEventListener('click', function () {
      // Armazena a confirmação de consentimento no localStorage
      localStorage.setItem('cookieConsent', 'true');
      // Esconde o banner de consentimento após aceitar
      const cookieConsent = document.getElementById('cookieConsent');
      if (cookieConsent) {
        cookieConsent.style.display = 'none';
      }
    });
  }
});
