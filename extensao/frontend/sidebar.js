const API_URL = 'http://localhost:3000/v1/analyze';
const API_KEY = 'cf_demo_key';

document.getElementById('analyze').addEventListener('click', async () => {
  const message = document.getElementById('leadMessage').value.trim();
  const resultEl = document.getElementById('result');

  if (!message) {
    resultEl.textContent = 'Cole uma mensagem primeiro.';
    return;
  }

  resultEl.textContent = 'Analisando...';

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        leadMessage: message,
        channel: 'whatsapp-web',
        language: 'pt-BR'
      })
    });

    if (!res.ok) {
      throw new Error(`Erro ${res.status}`);
    }

    const data = await res.json();

    resultEl.textContent =
      data?.suggestions?.join('\n\n') ||
      JSON.stringify(data, null, 2);
  } catch (err) {
    resultEl.textContent = 'Erro ao gerar sugestão.';
  }
});
