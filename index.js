const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const fs = require('fs');
const path = require('path');

const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});

const IMG_BASE = "https://raw.githubusercontent.com/Zoha742/eshopbot/main/products/";
const WEB_APP_URL = "https://eshopbot.onrender.com"; // আপনার Render URL এখানে দিন

// --- PRODUCT DATABASE (নাম ও দাম এখানে পরিবর্তন করবেন) ---
const productInfo = {
    "shirt/casual/": [{name: "Casual Shirt 1", price: "12"}, {name: "Casual Shirt 2", price: "10"}, {name: "Casual Shirt 3", price: "15"}, {name: "Casual Shirt 4", price: "13"}, {name: "Casual Shirt 5", price: "11"}, {name: "Casual Shirt 6", price: "14"}],
    "shirt/formal/": [{name: "Formal Shirt 1", price: "18"}, {name: "Formal Shirt 2", price: "16"}, {name: "Formal Shirt 3", price: "20"}, {name: "Formal Shirt 4", price: "17"}, {name: "Formal Shirt 5", price: "19"}, {name: "Formal Shirt 6", price: "22"}],
    "tshirts/printed/": [{name: "Printed Tee 1", price: "8"}, {name: "Printed Tee 2", price: "7"}, {name: "Printed Tee 3", price: "9"}, {name: "Printed Tee 4", price: "8"}, {name: "Printed Tee 5", price: "10"}, {name: "Printed Tee 6", price: "7"}],
    "pants/jeans/": [{name: "Jeans 1", price: "25"}, {name: "Jeans 2", price: "22"}, {name: "Jeans 3", price: "28"}, {name: "Jeans 4", price: "24"}, {name: "Jeans 5", price: "26"}, {name: "Jeans 6", price: "30"}],
    "panjabi/easy/": [{name: "Easy Panjabi 1", price: "20"}, {name: "Easy Panjabi 2", price: "18"}, {name: "Easy Panjabi 3", price: "22"}, {name: "Easy Panjabi 4", price: "21"}, {name: "Easy Panjabi 5", price: "19"}, {name: "Easy Panjabi 6", price: "23"}],
    "accessories/belt/": [{name: "Leather Belt 1", price: "15"}, {name: "Belt 2", price: "12"}, {name: "Belt 3", price: "14"}, {name: "Belt 4", price: "13"}, {name: "Belt 5", price: "16"}, {name: "Belt 6", price: "11"}]
};

// --- MAIN MENU ---
function mainMenu(chatId) {
    const keyboard = [
        [{ text: "🛍️ Open Premium Store", web_app: { url: WEB_APP_URL } }], 
        [{ text: "👕 T-SHIRTS", callback_data: 'm_tshirt' }, { text: "👔 SHIRTS", callback_data: 'm_shirt' }],
        [{ text: "👖 PANTS", callback_data: 'm_pant' }, { text: "🕌 PANJABI", callback_data: 'm_panjabi' }],
        [{ text: "🧒 JUNIOR", callback_data: 'm_junior' }, { text: "⌚ ACCESSORIES", callback_data: 'm_acc' }],
        [{ text: "🔥 HOT DEALS", callback_data: 'm_hot' }]
    ];
    bot.sendMessage(chatId, "✨ *Welcome to Premium eShop*\nPlease select a category or open the store:", {
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: keyboard }
    });
}

// --- INITIAL GALLERY (গ্যালারিতে ১ ও ২ নম্বর ছবি এবং Cart/Fav বাটন) ---
function sendInitialGallery(chatId, folderPath) {
    const info = productInfo[folderPath] || [];
    const p1 = info[0] || { name: "Product", price: "0" };
    const p2 = info[1] || { name: "Product", price: "0" };

    const media = [
        { type: 'photo', media: IMG_BASE + folderPath + "1.jpg", caption: `✨ *${p1.name}*\n💰 Price: $${p1.price}`, parse_mode: "Markdown" },
        { type: 'photo', media: IMG_BASE + folderPath + "2.jpg", caption: `✨ *${p2.name}*\n💰 Price: $${p2.price}`, parse_mode: "Markdown" }
    ];

    bot.sendMediaGroup(chatId, media).then(() => {
        bot.sendMessage(chatId, "Choose an action for these items:", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "❤️ Favorite", callback_data: `fav_item` }, { text: "🛒 Add to Cart", callback_data: `cart_item` }],
                    [{ text: "🖼 See More (Full Gallery)", callback_data: 'see_more_' + folderPath }],
                    [{ text: "⬅️ Back", callback_data: 'main_menu' }]
                ]
            }
        });
    });
}

// --- FULL GALLERY (১ থেকে ৬ নম্বর ছবি সিরিয়ালি আসবে) ---
async function sendFullGallery(chatId, folderPath) {
    const info = productInfo[folderPath] || [];
    bot.sendMessage(chatId, "⌛ Loading full collection...");
    for (let i = 1; i <= 6; i++) {
        let imageUrl = `${IMG_BASE}${folderPath}${i}.jpg`;
        const item = info[i-1] || { name: "Premium Item", price: "0" };
        try { 
            await bot.sendPhoto(chatId, imageUrl, { 
                caption: `✨ *${item.name}*\n💰 Price: $${item.price}`, 
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: [[{ text: "❤️ Fav", callback_data: `fav_item` }, { text: "🛒 Cart", callback_data: `cart_item` }]] }
            }); 
        } catch (e) { break; }
    }
    bot.sendMessage(chatId, "✅ Gallery Complete.", { reply_markup: { inline_keyboard: [[{ text: "⬅️ Back", callback_data: 'main_menu' }]] } });
}

// --- BUTTON INTERACTION LOGIC ---
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    // পপআপ মেসেজ লজিক (Favorite/Cart)
    if (data === 'cart_item') {
        return bot.answerCallbackQuery(query.id, { text: "🛒 Added to your Profile Cart!", show_alert: true });
    }
    if (data === 'fav_item') {
        return bot.answerCallbackQuery(query.id, { text: "❤️ Added to Favorites!", show_alert: false });
    }

    if (data === 'main_menu') mainMenu(chatId);
    else if (data.startsWith('see_more_')) sendFullGallery(chatId, data.replace('see_more_', ''));
    
    // ক্যাটাগরি হ্যান্ডলার
    else if (data === 'm_shirt') {
        bot.sendMessage(chatId, "👔 *SHIRT COLLECTION*", {
            reply_markup: { inline_keyboard: [
                [{ text: "👕 Casual Shirt", callback_data: 'sub_s_casual' }],
                [{ text: "👔 Formal Shirt", callback_data: 'sub_s_formal' }],
                [{ text: "⬅️ Back", callback_data: 'main_menu' }]
            ]}
        });
    }
    else if (data === 'sub_s_casual') sendInitialGallery(chatId, "shirt/casual/");
    else if (data === 'sub_s_formal') sendInitialGallery(chatId, "shirt/formal/");

    else if (data === 'm_tshirt') {
        bot.sendMessage(chatId, "👕 *T-SHIRT COLLECTION*", {
            reply_markup: { inline_keyboard: [[{ text: "🎨 Printed T-Shirt", callback_data: 'sub_t_print' }], [{ text: "⬅️ Back", callback_data: 'main_menu' }]]}
        });
    }
    else if (data === 'sub_t_print') sendInitialGallery(chatId, "tshirts/printed/");

    else if (data === 'm_pant') {
        bot.sendMessage(chatId, "👖 *PANTS COLLECTION*", {
            reply_markup: { inline_keyboard: [[{ text: "👖 Jeans", callback_data: 'sub_p_jeans' }], [{ text: "⬅️ Back", callback_data: 'main_menu' }]]}
        });
    }
    else if (data === 'sub_p_jeans') sendInitialGallery(chatId, "pants/jeans/");

    else if (data === 'm_panjabi') {
        bot.sendMessage(chatId, "🕌 *PANJABI COLLECTION*", {
            reply_markup: { inline_keyboard: [[{ text: "✨ Easy Panjabi", callback_data: 'sub_pj_easy' }], [{ text: "⬅️ Back", callback_data: 'main_menu' }]]}
        });
    }
    else if (data === 'sub_pj_easy') sendInitialGallery(chatId, "panjabi/easy/");

    else if (data === 'm_acc') {
        bot.sendMessage(chatId, "⌚ *ACCESSORIES*", {
            reply_markup: { inline_keyboard: [[{ text: "🎗️ Belts", callback_data: 'sub_a_belt' }], [{ text: "⬅️ Back", callback_data: 'main_menu' }]]}
        });
    }
    else if (data === 'sub_a_belt') sendInitialGallery(chatId, "accessories/belt/");
});

bot.onText(/\/start/, (msg) => mainMenu(msg.chat.id));

// --- SERVER FOR MINI APP (Web View) ---
http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) { res.writeHead(500); return res.end("Error"); }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    } else {
        res.writeHead(200); res.end('Bot is Active!');
    }
}).listen(process.env.PORT || 3000);
