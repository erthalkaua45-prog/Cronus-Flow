const SIDEBAR_ID = 'cronus-flow-sidebar';
const API_URL = IS_LOCAL
  ? 'http://localhost:3000/v1/analyze'
  : 'https://api.cronusflow.com/v1/analyze';
const API_KEY = 'cf_demo_key';
const IS_LOCAL = true;

/**
 * Toggle da sidebar
 */
function toggleSidebar() {
  const existing = document.getElementById(SIDEBAR_ID);
  if (existing) {
    existing.remove();
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.id = SIDEBAR_ID;
  iframe.src = chrome.runtime.getURL('sidebar.html');
  iframe.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 25%;
    height: 100vh;
    z-index: 9999;
    border: none;
    background: #fff;
  `;

  document.body.appendChild(iframe);
}

toggleSidebar();

/**
 * Extrai a última mensagem do CLIENTE
 */
function getLastClientMessage() {
  const messages = document.querySelectorAll('[data-testid="msg-container"]');

  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];

    // Mensagens recebidas NÃO têm a classe de mensagem enviada
    const isIncoming = !msg.querySelector('[data-testid="msg-check"]');

    if (isIncoming) {
      return msg.innerText.trim();
    }
  }

  return null;
}

/**
 * Comunicação segura com a sidebar
 */
window.addEventListener('message', async (event) => {
  // Garantia de origem
  if (event.source !== window) return;
  if (!event.data || event.data.type !== 'ANALYZE') return;

  const leadMessage = getLastClientMessage();

  if (!leadMessage) {
    window.postMessage(
      { type: 'ERROR', message: 'Nenhuma mensagem do cliente encontrada.' },
      window.location.origin
    );
    return;
  }

  const payload = {
    leadMessage,
    channel: 'whatsapp-web',
    language: 'pt-BR'
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`API_ERROR_${res.status}`);
    }

    const data = await res.json();

    window.postMessage(
      { type: 'RESULT', data },
      window.location.origin
    );
  } catch (err) {
    window.postMessage(
      {
        type: 'ERROR',
        message: 'Não foi possível gerar sugestões agora. Tente novamente.'
      },
      window.location.origin
    );
  }
});
