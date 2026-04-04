const TelegramBot = require('node-telegram-bot-api');
const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});
const WEB_URL = "https://eshopbot.onrender.com";

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "👋 **Welcome to eShop365**\nPremium শপিং এবং গেম খেলতে নিচের বাটনগুলো দেখুন।", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "🛍️ Open Premium Store", web_app: { url: WEB_URL } }],
                [{ text: "🎮 Play Game (Fiverr)", url: "https://www.fiverr.com/users/mr_zoha" }],
                [{ text: "🤖 AI Support", callback_data: 'ai' }]
            ]
        }
    });
});

bot.on('callback_query', (q) => {
    if(q.data === 'ai') bot.sendMessage(q.message.chat.id, "🤖 **AI Agent Active**\nApnar question-ti likhun (Commands pore add hobe).");
    bot.answerCallbackQuery(q.id);
});

// Server part (Render specific)
const http = require('http');
const fs = require('fs');
const path = require('path');
http.createServer((req, res) => {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}).listen(process.env.PORT || 3000);
