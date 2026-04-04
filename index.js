const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const token = 'YOUR_BOT_TOKEN';
const bot = new TelegramBot(token, {polling: true});

// Render Port Binding
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome to eShop365! 🛍️\nনিচের বাটন থেকে শপিং করুন বা সাপোর্ট নিন।", {
        reply_markup: {
            keyboard: [
                [{ text: "🚀 Open eShop365 Shop", web_app: { url: "https://your-render-url.com" } }],
                [{ text: "🟢 Fiverr Shop" }, { text: "🤖 AI Support" }]
            ],
            resize_keyboard: true
        }
    });
});

bot.on('message', (msg) => {
    if (msg.text === "🟢 Fiverr Shop") {
        bot.sendMessage(msg.chat.id, "Visit our Fiverr: https://fiverr.com/zoha742");
    }
    if (msg.text === "🤖 AI Support") {
        bot.sendMessage(msg.chat.id, "How can I help you today? I know everything about our products!");
    }
});
