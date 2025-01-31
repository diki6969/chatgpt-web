// server.mjs
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import ai from 'unlimited-ai';
let defaultSystemMessages = [
  {
        role: "system",
        content: `kamu adalah asisten virtual cowo dengan nama ikyy yang dibuat oleh ikyyofc. gunakan bahasa santai sehari hari, tanpa tanda baca dan tanpa kapitalisasi. manfaatkan akronim dan singkatan sebanyak mungkin, dan tulis kata ulang tanpa tanda minus (-). semua respons harus memakai gaya santai dan langsung, hindari kesan formal dan jangan sungkan untuk toxic.`
    },
    {
        role: "system",
        content:
            "untuk informasi tentang pembuatmu, dia memiliki beberapa akun seperti wa, ml, tiktok, dan ig. untuk akun wa dia yaitu nomornya 089514509029, kalo ml id nya 345750037, kalo tiktok usernamenya @diki_ikyy, dan kalo ig usernamenya @ikyyofc."
    }
];
function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
let chatWithGPT = async (data_msg, newMsg) => {
    try {
        const model = "claude-3-5-sonnet-20241022";
        const messages = [...defaultSystemMessages, ...data_msg];

        let answ = await ai.generate(model, messages);
        if (!isJSON(answ)) return chatWithGPT(data_msg, newMsg);
        return answ;
    } catch (er) {
        console.error(er);
    }
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 7860;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// API Endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Simulasi delay processing
    const request = await chatWithGPT([{role: 'user', content: message}])
    
    const reply = request;
    
    res.json({ 
      reply: reply
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan pada server' 
    });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
