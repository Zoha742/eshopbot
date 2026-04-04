const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const fs = require('fs');
const path = require('path');

const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});

const IMG_BASE = "https://raw.githubusercontent.com/Zoha742/eshopbot/main/products/";

// 1. Main Menu with Mini App Button
function mainMenu(chatId) {
    const keyboard = [
        [{ text: "🛍️ Open Premium Store", web_app: { url: 'https://eshopbot.onrender.com' } }], 
        [{ text: "👕 T-SHIRTS", callback_data: 'm_tshirt' }, { text: "👔 SHIRTS", callback_data: 'm_shirt' }],
        [{ text: "👖 PANTS", callback_data: 'm_pant' }, { text: "🕌 PANJABI", callback_data: 'm_panjabi' }],
        [{ text: "🧒 JUNIOR", callback_data: 'm_junior' }, { text: "⌚ ACCESSORIES", callback_data: 'm_acc' }],
        [{ text: "🔥 HOT DEALS", callback_data: 'm_hot' }]
    ];
    bot.sendMessage(chatId, "✨ *Welcome to Premium eShop*\nClick 'Open Store' for a modern shopping experience or browse categories below:", {
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: keyboard }
    });
}

// 2. Button Interaction Handlers (English)
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === 'm_shirt') {
        bot.sendMessage(chatId, "👔 *SHIRT COLLECTION*\nPlease use the 'Open Store' button above for the full gallery or select a type:", {
            reply_markup: { inline_keyboard: [
                [{ text: "👕 Casual Shirt", callback_data: 'sub_s_casual' }],
                [{ text: "⬅️ Back", callback_data: 'main_menu' }]
            ]}
        });
    } else if (data === 'main_menu') {
        mainMenu(chatId);
    }
    // আপনি চাইলে অন্য সব ক্যাটাগরির লজিক এখানে আগের মতো যোগ করতে পারেন
});

bot.onText(/\/start/, (msg) => mainMenu(msg.chat.id));

// 3. Server for Mini App
http.createServer((req, res) => {
    if (req.url === '/') {
        // এটি আপনার index.html ফাইলটি লোড করবে
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("Error loading index.html");
                return;
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    } else {
        res.writeHead(200);
        res.end('Bot is Live!');
    }
}).listen(process.env.PORT || 3000);
