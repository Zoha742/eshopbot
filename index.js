const TelegramBot = require('node-telegram-bot-api');
const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});

const IMG_BASE = "https://raw.githubusercontent.com/Zoha742/eshopbot/main/products/";
const WEB_URL = "https://eshopbot.onrender.com";

// মেইন কিবোর্ড বাটন (Home & Back সহ)
const mainKeyboard = {
    reply_markup: {
        keyboard: [
            ['👕 T-Shirts', '👔 Shirts'],
            ['👖 Pants', '🕌 Panjabi'],
            ['🏠 Home', '⬅️ Back']
        ],
        resize_keyboard: true
    }
};

// ডাটাবেস এবং ইমেজ লজিক
const products = {
    "shirt/casual/": ["Casual 1", "Casual 2", "Casual 3", "Casual 4", "Casual 5", "Casual 6"],
    "tshirts/printed/": ["T-shirt 1", "T-shirt 2", "T-shirt 3", "T-shirt 4", "T-shirt 5", "T-shirt 6"]
};

bot.onText(/\/start|🏠 Home/, (msg) => {
    bot.sendMessage(msg.chat.id, "✨ **Welcome to eShop365**\nUse the buttons below to browse or click 'Open Store' for full experience.", mainKeyboard);
});

// বাটন ক্লিক হ্যান্ডলার
bot.on('message', (msg) => {
    const text = msg.text;
    if (text === '👕 T-Shirts') {
        sendGallery(msg.chat.id, "tshirts/printed/");
    } else if (text === '👔 Shirts') {
        sendGallery(msg.chat.id, "shirt/casual/");
    } else if (text === '⬅️ Back') {
        bot.sendMessage(msg.chat.id, "Returning to Home...", mainKeyboard);
    }
});

async function sendGallery(chatId, folder) {
    const names = products[folder] || [];
    bot.sendMessage(chatId, "⌛ Loading collection...");
    
    for (let i = 1; i <= 6; i++) {
        const imgUrl = `${IMG_BASE}${folder}${i}.jpg`;
        await bot.sendPhoto(chatId, imgUrl, {
            caption: `✨ **${names[i-1] || 'Premium Item'}**\n💰 Price: $15`,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "❤️ Fav", callback_data: `fav_${i}` }, { text: "🛒 Add Cart", callback_data: `cart_${i}` }],
                    [{ text: "🌐 View in Web", web_app: { url: `${WEB_URL}/#shop` } }] // সরাসরি ওয়েব ভিউ পপআপ
                ]
            }
        });
    }
}

// কার্ট এবং ফেভারিট পপআপ লজিক
bot.on('callback_query', (query) => {
    const action = query.data.split('_')[0];
    if (action === 'fav') {
        bot.answerCallbackQuery(query.id, { text: "❤️ Added to Favorites!", show_alert: false });
    } else if (action === 'cart') {
        bot.answerCallbackQuery(query.id, { text: "🛒 Added to your Profile Cart!", show_alert: true });
    }
});
