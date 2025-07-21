const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');
const waveBtn = document.getElementById('wave-btn');
const chatContainer = document.getElementById('chat-container');

// Tunjuk/hide butang ikut status menaip
userInput.addEventListener('input', () => {
  const typing = userInput.value.trim() !== '';
  sendBtn.classList.toggle('hidden', !typing);
  micBtn.classList.toggle('hidden', typing);
  waveBtn.classList.toggle('hidden', typing);
});

// Fungsi tambah mesej user ke UI
function addMessage(text, sender = 'user') {
  const bubble = document.createElement('div');
  bubble.classList.add('msg-bubble', sender === 'user' ? 'user-msg' : 'ai-msg');
  bubble.textContent = text;
  chatContainer.appendChild(bubble);
  bubble.scrollIntoView({ behavior: 'smooth' });
}

// Fungsi AI balas dengan loading dots + taip satu-satu
async function typeAIMessageWithLoading(text) {
  const bubble = document.createElement('div');
  bubble.classList.add('msg-bubble', 'ai-msg', 'loading-dots');
  bubble.textContent = 'NEX AI is typing';
  chatContainer.appendChild(bubble);
  bubble.scrollIntoView({ behavior: 'smooth' });

  await new Promise(resolve => setTimeout(resolve, 800)); // optional delay

  // Taip satu-satu
  bubble.classList.remove('loading-dots');
  bubble.classList.add('typing-cursor');
  bubble.textContent = '';
  let i = 0;
  function typeNext() {
    if (i < text.length) {
      bubble.textContent += text.charAt(i);
      i++;
      setTimeout(typeNext, 30);
    } else {
      bubble.classList.remove('typing-cursor');
    }
    bubble.scrollIntoView({ behavior: 'smooth' });
  }
  typeNext();
}

// Bila tekan butang Hantar
sendBtn.addEventListener('click', async () => {
  const text = userInput.value.trim();
  if (text === '') return;

  addMessage(text, 'user');
  userInput.value = '';
  sendBtn.classList.add('hidden');
  micBtn.classList.remove('hidden');
  waveBtn.classList.remove('hidden');

  const aiReply = await generateAIReply(text);
  typeAIMessageWithLoading(aiReply);
});

// Fungsi sambung ke OpenRouter API
async function generateAIReply(userText) {
  const apiKey = "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";
  const endpoint = "https://openrouter.ai/api/v1/chat/completions";

  const payload = {
    model: "mistralai/mistral-7b-instruct",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userText }
    ]
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error(err);
    return "❌ Ralat sambungan ke NEX AI.";
  }
}