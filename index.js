const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});
const ADMIN_ID = 1391942702; 

// আপনার দেওয়া পজিশন অনুযায়ী মেইন মেনু
function mainMenu(chatId, userId) {
    const keyboard = [
        [{ text: "👕 T-SHIRTS", callback_data: 'm_tshirt' }, { text: "👔 SHIRTS", callback_data: 'm_shirt' }],
        [{ text: "👖 PANTS", callback_data: 'm_pant' }, { text: "🕌 PANJABI", callback_data: 'm_panjabi' }],
        [{ text: "🧒 JUNIOR", callback_data: 'm_junior' }, { text: "⌚ ACCESSORIES", callback_data: 'm_acc' }],
        [{ text: "🔥 HOT DEALS", callback_data: 'hot_deals' }]
    ];

    if (userId === ADMIN_ID) {
        keyboard.push([{ text: "⚙️ Admin Panel", callback_data: 'admin_panel' }]);
    }

    bot.sendMessage(chatId, "🍎 *Welcome to Premium eShop*\nআপনার পছন্দের ক্যাটাগরি বেছে নিন:", {
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: keyboard }
    });
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const data = query.data;
    const backBtn = [{ text: "⬅️ Back", callback_data: 'main_menu' }];

    if (data === 'main_menu') {
        mainMenu(chatId, userId);
    } 
    // ১. T-Shirts সাব-মেনু
    else if (data === 'm_tshirt') {
        bot.sendMessage(chatId, "👕 *T-SHIRT COLLECTION*", {
            reply_markup: { inline_keyboard: [
                [{ text: "🎨 Printed T-Shirt", callback_data: 't_print' }],
                [{ text: "👕 Polo T-Shirt", callback_data: 't_polo' }],
                backBtn
            ]}
        });
    }
    // ২. Shirts সাব-মেনু
    else if (data === 'm_shirt') {
        bot.sendMessage(chatId, "👔 *SHIRT COLLECTION*", {
            reply_markup: { inline_keyboard: [
                [{ text: "👕 Casual Shirt", callback_data: 's_casual' }],
                [{ text: "👔 Formal Shirt", callback_data: 's_formal' }],
                [{ text: "👕 Half Shirt", callback_data: 's_half' }],
                backBtn
            ]}
        });
    }
    // অন্যান্য সাব-মেনু (Pants, Panjabi, Junior, Accessories) আগের মতোই থাকবে...
});

// মেনু বাটন কমান্ড ফিক্স (আপনার রিকোয়েস্ট অনুযায়ী)
bot.onText(/\/start|\/shop/, (msg) => {
    mainMenu(msg.chat.id, msg.from.id);
});

// সার্ভার রান রাখা
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is Active!');
}).listen(process.env.PORT || 3000);
