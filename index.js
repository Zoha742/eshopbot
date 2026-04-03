const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// আপনার দেওয়া টোকেন
const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});

// মেইন মেনু ফাংশন (iOS Style)
function mainMenu(chatId) {
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🕌 PANJABI", callback_data: 'm_panjabi' }, { text: "👕 T-SHIRTS", callback_data: 'm_tshirt' }],
                [{ text: "👔 SHIRTS", callback_data: 'm_shirt' }, { text: "🧒 JUNIOR", callback_data: 'm_junior' }],
                [{ text: "👖 PANTS", callback_data: 'm_pant' }, { text: "⌚ ACCESSORIES", callback_data: 'm_acc' }],
                [{ text: "👤 User Profile", callback_data: 'user_profile' }, { text: "⚙️ Admin Panel", callback_data: 'admin_panel' }]
            ]
        }
    };
    bot.sendMessage(chatId, "🍎 *Welcome to Premium eShop*", { parse_mode: "Markdown", ...options });
}

// বাটন ক্লিক হ্যান্ডলার
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const backBtn = [{ text: "⬅️ Back to Main Menu", callback_data: 'main_menu' }];

    if (data === 'main_menu') {
        mainMenu(chatId);
    } 
    // 1. Panjabi
    else if (data === 'm_panjabi') {
        bot.sendMessage(chatId, "🕌 *Panjabi Collection*", {
            reply_markup: { inline_keyboard: [
                [{ text: "✨ Easy Design Panjabi", callback_data: 'p_easy' }],
                [{ text: "💎 Easy Karchupi Panjabi", callback_data: 'p_kar' }],
                [{ text: "🕌 Kabli Panjabi Set", callback_data: 'p_kabli' }],
                backBtn
            ]}
        });
    }
    // 2. T-Shirts
    else if (data === 'm_tshirt') {
        bot.sendMessage(chatId, "👕 *T-Shirt Collection*", {
            reply_markup: { inline_keyboard: [
                [{ text: "🎨 Printed T-Shirt", callback_data: 't_print' }],
                [{ text: "👕 Polo T-Shirt", callback_data: 't_polo' }],
                backBtn
            ]}
        });
    }
    // 3. Junior Section
    else if (data === 'm_junior') {
        bot.sendMessage(chatId, "🧒 *Junior Collection*", {
            reply_markup: { inline_keyboard: [
                [{ text: "👦 Boys Full Shirt", callback_data: 'j_bfull' }, { text: "👦 Boys Half Shirt", callback_data: 'j_bhalf' }],
                [{ text: "👕 Boys Polo", callback_data: 'j_bpolo' }, { text: "👕 Boys T-Shirt", callback_data: 'j_bt' }],
                [{ text: "🕌 Boys Panjabi", callback_data: 'j_bp' }],
                [{ text: "👧 Girls T-Shirt", callback_data: 'j_gt' }, { text: "👗 Girls Frock", callback_data: 'j_gf' }],
                backBtn
            ]}
        });
    }
    // 4. Pants Section
    else if (data === 'm_pant') {
        bot.sendMessage(chatId, "👖 *Pants Collection*", {
            reply_markup: { inline_keyboard: [
                [{ text: "👖 Gabardine Pants", callback_data: 'pn_gab' }],
                [{ text: "👖 Jeans", callback_data: 'pn_jean' }],
                [{ text: "👔 Formal Pants", callback_data: 'pn_formal' }],
                [{ text: "🩳 Pajama / Shorts / Trousers", callback_data: 'pn_others' }],
                backBtn
            ]}
        });
    }
    // 5. User Profile
    else if (data === 'user_profile') {
        bot.sendMessage(chatId, `👤 *User Profile*\n\nName: ${query.from.first_name}\nUser ID: ${query.from.id}`, {
            reply_markup: { inline_keyboard: [
                [{ text: "📦 Orders", callback_data: 'u_ord' }, { text: "🛒 Cart", callback_data: 'u_cart' }],
                [{ text: "📍 Shipping Address", callback_data: 'u_ship' }],
                [{ text: "⚙️ Account Details", callback_data: 'u_acc' }],
                backBtn
            ]}
        });
    }
});

// স্টার্ট কমান্ড
bot.onText(/\/start/, (msg) => {
    mainMenu(msg.chat.id);
});

// Render সার্ভার সচল রাখা
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is Live!');
}).listen(process.env.PORT || 3000);

console.log("Bot is running perfectly...");
