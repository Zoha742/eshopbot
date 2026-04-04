const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const fs = require('fs');
const path = require('path');

const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});

const WEB_URL = "https://eshopbot.onrender.com"; // আপনার Render URL

// --- BOT INTERFACE ---
function startMenu(chatId) {
    bot.sendMessage(chatId, "👋 **Welcome to eShop365 Premium**\n\nআমাদের স্টোর থেকে শপিং করতে নিচের বাটনে ক্লিক করুন। এখানে আপনি আপনার প্রোফাইল এবং পেমেন্ট অপশনও পাবেন।", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "🛍️ Open Premium Store", web_app: { url: WEB_URL } }]
            ]
        }
    });
}

bot.onText(/\/start/, (msg) => startMenu(msg.chat.id));
bot.on('message', (msg) => {
    if (msg.text && msg.text !== '/start') startMenu(msg.chat.id);
});

// --- FIXED SERVER FOR RENDER ---
const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) { res.writeHead(500); res.end("Error"); }
            else { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(data); }
        });
    } else { res.writeHead(404); res.end("Not Found"); }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0');
