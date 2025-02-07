/* script.js */

// Variabel global untuk sistem antrian pesan dan pengelolaan sesi
let messageQueue = [];
let processing = false;
let id_user;
let inactivityTimeout;
const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 menit

document.addEventListener("DOMContentLoaded", () => {
  initializeSession();
  setupEventListeners();
  resetInactivityTimer();
});

// --- SISTEM SESI & USER ID UNIK --- //
function initializeSession() {
  // Jika belum ada sessionID di sessionStorage, buat ID baru
  if (!sessionStorage.getItem("sessionID")) {
    const sessionID = generateSessionID();
    sessionStorage.setItem("sessionID", sessionID);
    id_user = sessionID
    console.log("Session ID dibuat:", sessionID);
  } else {
    const sesi_id = sessionStorage.getItem("sessionID");
    id_user = sesi_id
    console.log("Session ID yang ada:",sesi_id);
  }
  // Reset session ID saat user meninggalkan halaman
  window.addEventListener("beforeunload", () => {
    sessionStorage.removeItem("sessionID");
  });
}

function generateSessionID() {
  // Pembuatan ID sederhana (bisa disesuaikan)
  return 'user-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
}

// Reset timer inaktivitas
function resetInactivityTimer() {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    // Hapus sessionID setelah 30 menit tidak aktif
    sessionStorage.removeItem("sessionID");
    console.log("Session ID dihapus karena inaktivitas.");
  }, INACTIVITY_LIMIT);
}

// --- EVENT LISTENERS --- //
function setupEventListeners() {
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");

  // Penanganan pengiriman pesan
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (message === "") return;
    addUserMessage(message);
    chatInput.value = "";
    // Reset timer inaktivitas saat ada aktivitas user
    resetInactivityTimer();
  });

  // Penanganan event keyboard: Enter untuk kirim, Shift+Enter untuk newline
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event("submit"));
    }
  });
}

// --- MENANGANI PESAN --- //
// Tambah pesan user ke tampilan chat
function addUserMessage(text) {
  addMessageToChat(text, "user");
  // Masukkan respon bot ke dalam antrian
  enqueueBotResponse(text);
}

// Fungsi untuk menambahkan pesan ke container chat
function addMessageToChat(text, sender) {
  const chatContainer = document.getElementById("chat-container");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);
  // Menggunakan textContent untuk menjaga format string dan mencegah injeksi HTML
  messageElement.textContent = text;
  chatContainer.appendChild(messageElement);
  // Auto-scroll ke pesan terbaru
  messageElement.scrollIntoView({ behavior: "smooth" });
}

// Menambahkan pesan ke antrian dan memulai pemrosesan
function enqueueBotResponse(userMessage) {
  messageQueue.push(userMessage);
  processQueue();
}

// Memproses antrian pesan satu per satu
async function processQueue() {
  if (processing || messageQueue.length === 0) return;
  processing = true;

  try {
    await blockUserInput(true);
    await showTypingIndicator(true);
    
    while (messageQueue.length > 0) {
      const userMessage = messageQueue.shift();
      
      // Simulasi delay mengetik sebelum merespon
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const botResponse = await generateBotResponse(userMessage);
      await addMessageToChat(botResponse, "bot");
    }
  } catch (error) {
    console.error("Error processing message:", error);
    // Tambahkan logika penanganan error di sini
  } finally {
    await showTypingIndicator(false);
    await blockUserInput(false);
    processing = false;
    
    // Cek ulang antrian untuk pesan yang masuk saat proses
    if (messageQueue.length > 0) {
      processQueue();
    }
  }
}

// Generator respon bot sederhana (misalnya, echo pesan user)
function generateBotResponse(userMessage, user_ID) {
  const url = '/chat'; // Ganti dengan URL API Anda

const data = {
  message: userMessage,
  user_id: user_ID
};

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
};

const res = fetch(url, options)
  .then(response => {
    return response.json(); // Ubah respons menjadi objek JSON
  })
  .then(responseData => {
    return responseData;
  })

  return res.reply;
}

// Memblokir atau membuka input user saat bot sedang merespons
function blockUserInput(block) {
  const chatInput = document.getElementById("chat-input");
  const sendButton = document.getElementById("send-button");
  chatInput.disabled = block;
  sendButton.disabled = block;
}

// Menampilkan atau menyembunyikan typing indicator
function showTypingIndicator(show) {
  const indicator = document.getElementById("typing-indicator");
  if (show) {
    indicator.classList.remove("hidden");
  } else {
    indicator.classList.add("hidden");
  }
}