const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const fs = require('fs');
const path = require('path');

const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});

const WEB_URL = "https://eshopbot.onrender.com";

function sendMain(chatId) {
    bot.sendMessage(chatId, "👋 **Welcome to eShop365**\nPremium শপিং এর জন্য নিচের 'Open Store' বাটনে ক্লিক করুন।", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "🛍️ Open Premium Store", web_app: { url: WEB_URL } }],
                [{ text: "👨‍💻 AI Agent Support", callback_data: 'ai_support' }]
            ]
        }
    });
}

bot.onText(/\/start/, (msg) => sendMain(msg.chat.id));

bot.on('callback_query', (query) => {
    if (query.data === 'ai_support') {
        bot.sendMessage(query.message.chat.id, "🤖 **AI Agent Support**\n\nAI এজেন্ট বর্তমানে আপনার মেসেজটি প্রসেস করছে। দয়া করে আপনার প্রশ্নটি এখানে লিখুন, আমরা শীঘ্রই রিপ্লাই দেব।");
    }
    bot.answerCallbackQuery(query.id);
});

// Render Server Port Fix
const server = http.createServer((req, res) => {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});
server.listen(process.env.PORT || 3000, '0.0.0.0');
