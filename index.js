const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const fs = require('fs');
const path = require('path');

const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});

const WEB_URL = "https://eshopbot.onrender.com";

// --- BOT LOGIC ---
function sendStartMenu(chatId) {
    bot.sendMessage(chatId, "👋 **Welcome to eShop365**\n\nআমাদের প্রিমিয়াম কালেকশন দেখতে নিচের বাটনে ক্লিক করে স্টোর ওপেন করুন। এখানে আপনি প্রোফাইল এবং পেমেন্ট অপশনও পাবেন।", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "🛍️ Open Premium Store", web_app: { url: WEB_URL } }]
            ]
        }
    });
}

bot.onText(/\/start/, (msg) => sendStartMenu(msg.chat.id));
bot.on('message', (msg) => {
    if (msg.text && msg.text !== '/start') sendStartMenu(msg.chat.id);
});

// --- SERVER LOGIC (FIXED FOR RENDER) ---
const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
        const filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("Error loading index.html");
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});

// Render-এর জন্য এই পোর্ট সেটিংসটি বাধ্যতামূলক
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
