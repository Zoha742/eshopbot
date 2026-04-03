const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

const token = 'YOUR_BOT_TOKEN_HERE';
const bot = new TelegramBot(token, {polling: true});

// মেইন মেনু ফাংশন
function mainMenu(chatId) {
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🕌 PANJABI", callback_data: 'm_panjabi' }, { text: "👕 T-SHIRTS", callback_data: 'm_tshirt' }],
                [{ text: "👔 SHIRTS", callback_data: 'm_shirt' }, { text: "🧒 JUNIOR", callback_data: 'm_junior' }],
                [{ text: "👖 PANTS", callback_data: 'm_pant' }, { text: "⌚ ACCESSORIES", callback_data: 'm_acc' }],
                [{ text: "👤 Profile", callback_data: 'user_profile' }, { text: "⚙️ Admin", callback_data: 'admin_panel' }]
            ]
        }
    };
    bot.sendMessage(chatId, "🍎 *Premium eShop*\nনিচের ক্যাটাগরি থেকে আপনার পছন্দের সেকশনটি বেছে নিন:", { parse_mode: "Markdown", ...options });
}

// বাটন ক্লিক হ্যান্ডলার (সব ক্যাটাগরি এখানে)
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
    // 3. Shirts
    else if (data === 'm_shirt') {
        bot.sendMessage(chatId, "👔 *Shirt Collection*", {
            reply_markup: { inline_keyboard: [
                [{ text: "👕 Casual Shirt", callback_data: 's_casual' }],
                [{ text: "👔 Formal Shirt", callback_data: 's_formal' }],
                [{ text: "👕 Half Shirt", callback_data: 's_half' }],
                backBtn
            ]}
        });
    }
    // 4. Junior
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
    // 5. Pants
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
    // 6. Accessories
    else if (data === 'm_acc') {
        bot.sendMessage(chatId, "⌚ *Accessories*", {
            reply_markup: { inline_keyboard: [
                [{ text: "🎗️ Belt", callback_data: 'a_belt' }],
                [{ text: "👔 Easy Tie", callback_data: 'a_tie' }],
                [{ text: "🩲 Men's Underwear", callback_data: 'a_und' }],
                backBtn
            ]}
        });
    }
    // 7. User Profile
    else if (data === 'user_profile') {
        bot.sendMessage(chatId, `👤 *User Profile*\n\nName: ${query.from.first_name}\nID: ${query.from.id}\n\nএখানে আপনার অর্ডার ও অ্যাড্রেস থাকবে।`, {
            reply_markup: { inline_keyboard: [
                [{ text: "📦 Orders", callback_data: 'u_ord' }, { text: "🛒 Cart", callback_data: 'u_cart' }],
                [{ text: "📍 Shipping Address", callback_data: 'u_ship' }],
                backBtn
            ]}
        });
    }
});

bot.onText(/\/start/, (msg) => mainMenu(msg.chat.id));

// Render সার্ভার সচল রাখা
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is Live!');
}).listen(process.env.PORT || 3000);

console.log("Bot with all menus is running...");
