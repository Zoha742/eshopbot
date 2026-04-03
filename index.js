const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// আপনার টোকেন এবং অ্যাডমিন আইডি
const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});
const ADMIN_ID = 1391942702; // আপনার ইউজার আইডি এখানে বসানো হয়েছে

// মেইন মেনু ফাংশন (iOS Glass Look Style)
function mainMenu(chatId, userId) {
    const keyboard = [
        [{ text: "⚪️ 𝗠𝗔𝗜𝗡 𝗦𝗛𝗢𝗣", callback_data: 'm_tshirt' }], // T-Shirts এর বদলে Shop All
        [{ text: "🕌 𝗣𝗔𝗡𝗝𝗔𝗕𝗜", callback_data: 'm_panjabi' }, { text: "👔 𝗦𝗛𝗜𝗥𝗧𝗦", callback_data: 'm_shirt' }],
        [{ text: "👖 𝗣𝗔𝗡𝗧𝗦", callback_data: 'm_pant' }, { text: "🧒 𝗝𝗨𝗡𝗜𝗢𝗥", callback_data: 'm_junior' }],
        [{ text: "⌚ 𝗔𝗖𝗖𝗘𝗦𝗦𝗢𝗥𝗜𝗘𝗦", callback_data: 'm_acc' }, { text: "🔥 𝗛𝗢𝗧 𝗗𝗘𝗔𝗟𝗦", callback_data: 'hot_deals' }]
    ];

    // সিকিউরিটি: শুধুমাত্র আপনার আইডিতে অ্যাডমিন প্যানেল দেখাবে
    if (userId === ADMIN_ID) {
        keyboard.push([{ text: "🔐 𝗔𝗗𝗠𝗜𝗡 𝗣𝗔𝗡𝗘𝗟", callback_data: 'admin_panel' }]);
    }

    bot.sendMessage(chatId, " *Premium e-Store*\nSelect a category to explore:", {
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: keyboard }
    });
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const data = query.data;
    const backBtn = [{ text: "🔙 Back to Menu", callback_data: 'main_menu' }];

    if (data === 'main_menu') {
        mainMenu(chatId, userId);
    } 
    
    // Shirts সাব-মেনু (আপনার দেওয়া লিস্ট অনুযায়ী)
    else if (data === 'm_shirt') {
        bot.sendMessage(chatId, "👔 *SHIRT COLLECTION*", {
            reply_markup: { inline_keyboard: [
                [{ text: "🔹 Casual Shirt", callback_data: 's_casual' }],
                [{ text: "🔹 Formal Shirt", callback_data: 's_formal' }],
                [{ text: "🔹 Half Shirt", callback_data: 's_half' }],
                backBtn
            ]}
        });
    }

    // Accessories সাব-মেনু
    else if (data === 'm_acc') {
        bot.sendMessage(chatId, "⌚ *ACCESSORIES*", {
            reply_markup: { inline_keyboard: [
                [{ text: "▫️ Belt", callback_data: 'a_belt' }],
                [{ text: "▫️ Easy Tie", callback_data: 'a_tie' }],
                [{ text: "▫️ Men's Underwear", callback_data: 'a_und' }],
                backBtn
            ]}
        });
    }

    // অ্যাডমিন প্যানেল সিকিউরিটি ফিক্স
    else if (data === 'admin_panel') {
        if (userId === ADMIN_ID) {
            bot.sendMessage(chatId, "🔓 *Welcome Master!* অ্যাডমিন কন্ট্রোল প্যানেলে আপনাকে স্বাগতম।");
        } else {
            // অন্য কেউ ক্লিক করলে এই মেসেজটি পপ-আপ হবে
            bot.answerCallbackQuery(query.id, { 
                text: "⚠️ Access Denied! This section is for the owner only.", 
                show_alert: true 
            });
        }
    }
});

bot.onText(/\/start/, (msg) => {
    mainMenu(msg.chat.id, msg.from.id);
});

// Render সার্ভার সচল রাখা
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is Live!');
}).listen(process.env.PORT || 3000);
