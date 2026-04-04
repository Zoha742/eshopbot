const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const fs = require('fs');
const path = require('path');

const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});

const WEB_URL = "https://eshopbot.onrender.com";

// --- AI AGENT SECTION (ফাঁকা রাখা হলো আপনার জন্য) ---
// আপনি পরে এখানে AI কমান্ড বা API ইন্টিগ্রেশন করতে পারবেন।
function handleAIResponse(chatId, userText) {
    // এখানে আপনার AI কমান্ডগুলো লিখবেন।
    // উদাহরণ: if(userText === "Help") return "I am here to help!";
}

function sendStart(chatId) {
    bot.sendMessage(chatId, "🛍️ **Welcome to eShop365 Premium Store**\n\nশপিং করতে নিচের বাটনে ক্লিক করুন। যেকোনো প্রয়োজনে AI সাপোর্ট বাটনে চাপ দিন।", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "🛒 Open Store & Profile", web_app: { url: WEB_URL } }],
                [{ text: "🤖 AI Agent Support", callback_data: 'ai_support' }]
            ]
        }
    });
}

bot.onText(/\/start/, (msg) => sendStart(msg.chat.id));

bot.on('callback_query', (query) => {
    if (query.data === 'ai_support') {
        bot.sendMessage(query.message.chat.id, "🤖 **AI Agent Active**\nদয়া করে আপনার প্রশ্নটি লিখুন। আমি প্রসেস করছি...");
        // এখানে আপনি AI লজিক কল করবেন।
    }
    bot.answerCallbackQuery(query.id);
});

// Render Server Setup
const server = http.createServer((req, res) => {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});
server.listen(process.env.PORT || 3000, '0.0.0.0');
