const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});
const ADMIN_ID = 1391942702; 

// মেইন মেনু ফাংশন (আপনার স্ক্রিনশটের মতো লেআউট)
function mainMenu(chatId, userId) {
    const keyboard = [
        [{ text: "🕌 PANJABI", callback_data: 'm_panjabi' }, { text: "👔 SHIRTS", callback_data: 'm_shirt' }],
        [{ text: "👖 PANTS", callback_data: 'm_pant' }, { text: "🧒 JUNIOR", callback_data: 'm_junior' }],
        [{ text: "⌚ ACCESSORIES", callback_data: 'm_acc' }, { text: "🔥 HOT DEALS", callback_data: 'hot_deals' }]
    ];

    // অ্যাডমিন সিকিউরিটি
    if (userId === ADMIN_ID) {
        keyboard.push([{ text: "⚙️ Admin Panel", callback_data: 'admin_panel' }]);
    }

    bot.sendMessage(chatId, "🍎 *Welcome to Premium eShop*\nনিচের মেনু থেকে ক্যাটাগরি বেছে নিন:", {
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
    // ১. Panjabi সাব-মেনু
    else if (data === 'm_panjabi') {
        bot.sendMessage(chatId, "🕌 *PANJABI COLLECTION*", {
            reply_markup: { inline_keyboard: [
                [{ text: "✨ Easy Design Panjabi", callback_data: 'p_easy' }],
                [{ text: "💎 Easy Karchupi Panjabi", callback_data: 'p_kar' }],
                [{ text: "🕌 Kabli Panjabi Set", callback_data: 'p_kabli' }],
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
    // ৩. Junior সাব-মেনু
    else if (data === 'm_junior') {
        bot.sendMessage(chatId, "🧒 *JUNIOR COLLECTION*", {
            reply_markup: { inline_keyboard: [
                [{ text: "👦 Boys Full Shirt", callback_data: 'j_bfull' }, { text: "👦 Boys Half Shirt", callback_data: 'j_bhalf' }],
                [{ text: "👕 Boys Polo T-Shirt", callback_data: 'j_bpolo' }, { text: "👕 Boys T-Shirt", callback_data: 'j_bt' }],
                [{ text: "🕌 Boys Panjabi", callback_data: 'j_bp' }],
                [{ text: "👧 Girls T-Shirt", callback_data: 'j_gt' }, { text: "👗 Girls Frock", callback_data: 'j_gf' }],
                backBtn
            ]}
        });
    }
    // ৪. Pants সাব-মেনু
    else if (data === 'm_pant') {
        bot.sendMessage(chatId, "👖 *PANTS COLLECTION*", {
            reply_markup: { inline_keyboard: [
                [{ text: "👖 Gabardine Pants", callback_data: 'pn_gab' }],
                [{ text: "👖 Jeans", callback_data: 'pn_jean' }],
                [{ text: "👔 Formal Pants", callback_data: 'pn_formal' }],
                [{ text: "🩳 Pajama / Shorts / Trousers", callback_data: 'pn_others' }],
                backBtn
            ]}
        });
    }
    // ৫. Accessories সাব-মেনু
    else if (data === 'm_acc') {
        bot.sendMessage(chatId, "⌚ *ACCESSORIES*", {
            reply_markup: { inline_keyboard: [
                [{ text: "🎗️ Belt", callback_data: 'a_belt' }],
                [{ text: "👔 Easy Tie", callback_data: 'a_tie' }],
                [{ text: "🩲 Men's Underwear", callback_data: 'a_und' }],
                backBtn
            ]}
        });
    }
});

bot.onText(/\/start/, (msg) => {
    mainMenu(msg.chat.id, msg.from.id);
});

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is Live!');
}).listen(process.env.PORT || 3000);
