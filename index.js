const TelegramBot = require('node-telegram-bot-api');
const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});

const WEB_URL = "https://eshopbot.onrender.com"; // আপনার রেন্ডার ইউআরএল

// বটের চ্যাট মেনু
function sendStartMenu(chatId) {
    bot.sendMessage(chatId, "👋 **Welcome to eShop365**\n\nClick the button below to browse our collection, manage your profile, and make payments in our modern Mini App Store!", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "🛍️ Open Premium Store", web_app: { url: WEB_URL } }],
                [{ text: "👤 My Profile (In-App)", web_app: { url: WEB_URL + "#profile" } }]
            ]
        }
    });
}

bot.onText(/\/start/, (msg) => {
    sendStartMenu(msg.chat.id);
});

// কোনো ইউজার মেসেজ দিলে মেনু মনে করিয়ে দেওয়া
bot.on('message', (msg) => {
    if (msg.text !== '/start') {
        sendStartMenu(msg.chat.id);
    }
});
