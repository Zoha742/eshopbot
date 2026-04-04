const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const fs = require('fs');
const path = require('path');

const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});

const WEB_URL = "https://eshopbot.onrender.com";

function sendMenu(chatId) {
    bot.sendMessage(chatId, "👋 **Welcome to eShop365**\n\nপ্রিমিয়াম প্রোডাক্ট কিনতে স্টোর ওপেন করুন। যেকোনো সমস্যায় আমাদের সাপোর্ট টিমের সাথে কথা বলুন।", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "🛍️ Open Premium Store", web_app: { url: WEB_URL } }],
                [{ text: "👤 My Profile & Cart", web_app: { url: WEB_URL + "#profile" } }],
                [{ text: "📞 Live Support", callback_data: 'support' }]
            ]
        }
    });
}

bot.onText(/\/start/, (msg) => sendMenu(msg.chat.id));

bot.on('callback_query', (query) => {
    if (query.data === 'support') {
        bot.sendMessage(query.message.chat.id, "👨‍💻 **Customer Support**\n\nআমাদের সাপোর্ট এজেন্ট বর্তমানে অফলাইনে আছেন। আপনার সমস্যাটি এখানে লিখে জানান, আমরা দ্রুত যোগাযোগ করব। (শীঘ্রই AI Agent যুক্ত করা হচ্ছে!)");
        bot.answerCallbackQuery(query.id);
    }
});

// SERVER Logic
const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
});
server.listen(process.env.PORT || 3000, '0.0.0.0');
