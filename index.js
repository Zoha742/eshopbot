const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const fs = require('fs');
const path = require('path');

const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});

const WEB_URL = "https://eshopbot.onrender.com";

function sendStart(chatId) {
    bot.sendMessage(chatId, "👋 **Welcome to eShop365**\nপ্রিমিয়াম স্টোর থেকে শপিং করতে নিচের বাটনে ক্লিক করুন।", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "🛍️ Open Premium Store", web_app: { url: WEB_URL } }],
                [{ text: "👤 User Profile & Cart", web_app: { url: WEB_URL + "#profile" } }],
                [{ text: "👨‍💻 Customer Support", callback_data: 'support_call' }]
            ]
        }
    });
}

bot.onText(/\/start/, (msg) => sendStart(msg.chat.id));

bot.on('callback_query', (query) => {
    if (query.data === 'support_call') {
        bot.sendMessage(query.message.chat.id, "👨‍💻 **Customer Support**\nআপনার সমস্যার কথা এখানে লিখুন। শীঘ্রই আমাদের AI Agent আপনার সাথে যোগাযোগ করবে।");
    }
    bot.answerCallbackQuery(query.id);
});

const server = http.createServer((req, res) => {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});
server.listen(process.env.PORT || 3000, '0.0.0.0');
