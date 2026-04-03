const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// আপনার বট টোকেনটি এখানে বসান
const token = 'YOUR_BOT_TOKEN_HERE';
const bot = new TelegramBot(token, {polling: true});

// Render Port (ফ্রি সার্ভার সচল রাখার জন্য)
http.createServer((req, res) => { res.writeHead(200); res.end('Bot is Live!'); }).listen(process.env.PORT || 3000);

// --- মেনু ফাংশনগুলো ---

// ১. মেইন মেনু (iOS Style)
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

// ২. সাব-ক্যাটাগরি হ্যান্ডলার
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    // ক্যাটাগরি অনুযায়ী বাটন সাজানো
    const backBtn = [{ text: "⬅️ Back to Main Menu", callback_data: 'main_menu' }];

    if (data === 'main_menu') {
        mainMenu(chatId);
    } 
    
    // Panjabi Section
    else if (data === 'm_panjabi') {
        const panjabiOpt = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "✨ Easy Design Panjabi", callback_data: 'p_easy' }],
                    [{ text: "💎 Easy Karchupi Panjabi", callback_data: 'p_kar' }],
                    [{ text: "🕌 Kabli Panjabi Set", callback_data: 'p_kabli' }],
                    backBtn
                ]
            }
        };
        bot.sendMessage(chatId, "🕌 *Panjabi Collection*\nআপনার পছন্দের স্টাইলটি বেছে নিন:", { parse_mode: "Markdown", ...panjabiOpt });
    }

    // T-Shirts Section
    else if (data === 'm_tshirt') {
        const tshirtOpt = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🎨 Printed T-Shirt", callback_data: 't_print' }],
                    [{ text: "👕 Polo T-Shirt", callback_data: 't_polo' }],
                    backBtn
                ]
            }
        };
        bot.sendMessage(chatId, "👕 *T-Shirt Collection*", { parse_mode: "Markdown", ...tshirtOpt });
    }

    // Junior Section
    else if (data === 'm_junior') {
        const juniorOpt = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "👦 Boys Full Shirt", callback_data: 'j_bfull' }, { text: "👦 Boys Half Shirt", callback_data: 'j_bhalf' }],
                    [{ text: "👕 Boys Polo", callback_data: 'j_bpolo' }, { text: "👕 Boys T-Shirt", callback_data: 'j_bt' }],
                    [{ text: "🕌 Boys Panjabi", callback_data: 'j_bp' }],
                    [{ text: "👧 Girls T-Shirt", callback_data: 'j_gt' }, { text: "👗 Girls Frock", callback_data: 'j_gf' }],
                    backBtn
                ]
            }
        };
        bot.sendMessage(chatId, "🧒 *Junior Collection*", { parse_mode: "Markdown", ...juniorOpt });
    }

    // User Profile (আপনার রিকোয়েস্ট অনুযায়ী)
    else if (data === 'user_profile') {
        const profileOpt = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📦 Orders", callback_data: 'u_ord' }, { text: "🛒 Cart", callback_data: 'u_cart' }],
                    [{ text: "📍 Shipping/Billing Address", callback_data: 'u_addr' }],
                    [{ text: "⚙️ Account Details", callback_data: 'u_acc' }],
                    backBtn
                ]
            }
        };
        bot.sendMessage(chatId, `👤 *User Profile*\n\nName: ${query.from.first_name}\nUser ID: ${query.from.id}`, { parse_mode: "Markdown", ...profileOpt });
    }
});

// স্টার্ট কমান্ড
bot.onText(/\/start/, (msg) => {
    mainMenu(msg.chat.id);
});

console.log("Bot is running perfectly...");

const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is Live!');
}).listen(process.env.PORT || 3000);
