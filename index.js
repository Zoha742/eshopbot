const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// আপনার টোকেন এবং অ্যাডমিন আইডি
const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});
const ADMIN_ID = 1391942702; // শুধুমাত্র আপনি অ্যাডমিন প্যানেল দেখতে পাবেন

// মেইন মেনু ফাংশন (আপনার পছন্দের আগের স্টাইল)
function mainMenu(chatId, userId) {
    const keyboard = [
        [{ text: "🕌 PANJABI", callback_data: 'm_panjabi' }, { text: "🛍 SHOP ALL", callback_data: 'm_tshirt' }],
        [{ text: "👔 SHIRTS", callback_data: 'm_shirt' }, { text: "🧒 JUNIOR", callback_data: 'm_junior' }],
        [{ text: "👖 PANTS", callback_data: 'm_pant' }, { text: "⌚ ACCESSORIES", callback_data: 'm_acc' }],
        [{ text: "🔥 Hot Deals", callback_data: 'hot_deals' }]
    ];

    // সিকিউরিটি চেক: শুধুমাত্র অ্যাডমিন হলে বাটনটি দেখাবে
    if (userId === ADMIN_ID) {
        keyboard.push([{ text: "⚙️ Admin Panel", callback_data: 'admin_panel' }]);
    }

    bot.sendMessage(chatId, "🍎 *Welcome to Premium eShop*\nনিচের ক্যাটাগরি থেকে আপনার পছন্দের সেকশনটি বেছে নিন:", {
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: keyboard }
    });
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const data = query.data;
    const backBtn = [{ text: "⬅️ Back to Main Menu", callback_data: 'main_menu' }];

    if (data === 'main_menu') {
        mainMenu(chatId, userId);
    } 
    
    // ১. Shirts সাব-মেনু (আপনার দেওয়া লিস্ট অনুযায়ী)
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

    // ২. Accessories সাব-মেনু
    else if (data === 'm_acc') {
        bot.sendMessage(chatId, "⌚ *ACCESSORIES COLLECTION*", {
            reply_markup: { inline_keyboard: [
                [{ text: "🎗️ Belt", callback_data: 'a_belt' }],
                [{ text: "👔 Easy Tie", callback_data: 'a_tie' }],
                [{ text: "🩲 Men's Underwear", callback_data: 'a_und' }],
                backBtn
            ]}
        });
    }

    // অ্যাডমিন প্যানেল সিকিউরিটি লজিক
    else if (data === 'admin_panel') {
        if (userId === ADMIN_ID) {
            bot.sendMessage(chatId, "🔐 *Admin Dashboard*\nএখানে আপনার সব কন্ট্রোল থাকবে।");
        } else {
            bot.answerCallbackQuery(query.id, { 
                text: "❌ Access Denied! আপনি এই প্যানেলের মালিক নন।", 
                show_alert: true 
            });
        }
    }
    // অন্য ক্যাটাগরিগুলোর লজিক আগের মতোই চলবে...
});

bot.onText(/\/start/, (msg) => {
    mainMenu(msg.chat.id, msg.from.id);
});

// Render-এ বট লাইভ রাখার জন্য
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is Active!');
}).listen(process.env.PORT || 3000);
