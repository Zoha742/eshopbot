const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});
const ADMIN_ID = 1391942702; 

// Replace with your Render Live Link (e.g., https://eshopbot.onrender.com)
const WEB_APP_URL = "https://eshopbot.onrender.com"; 

// 1. Main Menu with Mini App Button
function mainMenu(chatId, userId) {
    const keyboard = [
        [{ text: "🛍️ Open Store (Mini App)", web_app: { url: WEB_APP_URL } }],
        [{ text: "👕 T-SHIRTS", callback_data: 'm_tshirt' }, { text: "👔 SHIRTS", callback_data: 'm_shirt' }],
        [{ text: "👖 PANTS", callback_data: 'm_pant' }, { text: "🕌 PANJABI", callback_data: 'm_panjabi' }],
        [{ text: "🧒 JUNIOR", callback_data: 'm_junior' }, { text: "⌚ ACCESSORIES", callback_data: 'm_acc' }],
        [{ text: "🔥 HOT DEALS", callback_data: 'm_hot' }]
    ];
    if (userId === ADMIN_ID) keyboard.push([{ text: "⚙️ Admin Panel", callback_data: 'admin_panel' }]);

    bot.sendMessage(chatId, "✨ *Welcome to Premium eShop*\nUse the Store button for a better experience or browse categories below:", {
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: keyboard }
    });
}

// 2. Interaction Handlers
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === 'main_menu') mainMenu(chatId, query.from.id);
    
    // ক্যাটাগরি মেসেজগুলো ইংরেজিতে হবে
    else if (data === 'm_shirt') {
        bot.sendMessage(chatId, "👔 *SHIRT COLLECTION*\nSelect a type:", {
            reply_markup: { inline_keyboard: [
                [{ text: "👕 Casual", callback_data: 'sub_s_casual' }],
                [{ text: "👔 Formal", callback_data: 'sub_s_formal' }],
                [{ text: "⬅️ Back", callback_data: 'main_menu' }]
            ]}
        });
    }
});

bot.onText(/\/start|\/shop/, (msg) => mainMenu(msg.chat.id, msg.from.id));

// 3. Serve index.html so it works as a Mini App
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    } else {
        res.writeHead(200);
        res.end('Bot is Live!');
    }
}).listen(process.env.PORT || 3000);
