const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// আপনার বট টোকেনটি এখানে বসান
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

// বাটন ক্লিক হ্যান্ডলার
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const backBtn = [{ text: "⬅️ Back to Main Menu", callback_data: 'main_menu' }];

    if (data === 'main_menu') {
        mainMenu(chatId);
    } else if (data === 'm_panjabi') {
        bot.sendMessage(chatId, "🕌 *Panjabi Collection*\n১. Easy Design\n২. Easy Karchupi\n৩. Kabli Set", { 
            reply_markup: { inline_keyboard: [[{ text: "✨ Easy Design", callback_data: 'p_easy' }], backBtn] } 
        });
    } else if (data === 'user_profile') {
        bot.sendMessage(chatId, `👤 *User Profile*\nName: ${query.from.first_name}\nID: ${query.from.id}`, { 
            reply_markup: { inline_keyboard: [[{ text: "📦 Orders", callback_data: 'u_ord' }], backBtn] } 
        });
    }
});

// কমান্ডস
bot.onText(/\/start/, (msg) => mainMenu(msg.chat.id));

// Render Port সচল রাখা (এখানে শুধু একবার সার্ভার তৈরি করা হয়েছে)
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is Live!');
}).listen(process.env.PORT || 3000);

console.log("Bot is running perfectly...");
