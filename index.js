const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});
const ADMIN_ID = 1391942702; 

const IMG_BASE = "https://raw.githubusercontent.com/Zoha742/eshopbot/main/products/";

// ১. মেইন মেনু
function mainMenu(chatId, userId) {
    const keyboard = [
        [{ text: "👕 T-SHIRTS", callback_data: 'm_tshirt' }, { text: "👔 SHIRTS", callback_data: 'm_shirt' }],
        [{ text: "👖 PANTS", callback_data: 'm_pant' }, { text: "🕌 PANJABI", callback_data: 'm_panjabi' }],
        [{ text: "🧒 JUNIOR", callback_data: 'm_junior' }, { text: "⌚ ACCESSORIES", callback_data: 'm_acc' }],
        [{ text: "🔥 HOT DEALS", callback_data: 'm_hot' }]
    ];
    if (userId === ADMIN_ID) keyboard.push([{ text: "⚙️ Admin Panel", callback_data: 'admin_panel' }]);

    bot.sendMessage(chatId, "🍎 *Welcome to Premium eShop*\nক্যাটাগরি বেছে নিন:", {
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: keyboard }
    });
}

// ২. গ্যালারি ফাংশন
function sendGallery(chatId, folderPath, title, subData) {
    const media = [
        { type: 'photo', media: IMG_BASE + folderPath + "1.jpg", caption: `✨ *${title}*` },
        { type: 'photo', media: IMG_BASE + folderPath + "2.jpg" }
    ];
    bot.sendMediaGroup(chatId, media).then(() => {
        bot.sendMessage(chatId, "সব আইটেম দেখতে নিচে ক্লিক করুন:", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🖼 View All Items", callback_data: 'all_' + subData }],
                    [{ text: "⬅️ Back", callback_data: 'main_menu' }]
                ]
            }
        });
    });
}

// ৩. বাটন হ্যান্ডলার
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const backBtn = [{ text: "⬅️ Back", callback_data: 'main_menu' }];

    if (data === 'main_menu') mainMenu(chatId, query.from.id);

    // --- T-SHIRTS ---
    else if (data === 'm_tshirt') {
        bot.sendMessage(chatId, "👕 *T-SHIRT COLLECTION*", {
            reply_markup: { inline_keyboard: [
                [{ text: "🎨 Printed T-Shirt", callback_data: 'sub_t_print' }],
                [{ text: "👕 Polo T-Shirt", callback_data: 'sub_t_polo' }],
                backBtn
            ]}
        });
    }
    else if (data === 'sub_t_print') sendGallery(chatId, "tshirts/printed/", "Printed T-Shirts", "tprint");
    else if (data === 'sub_t_polo') sendGallery(chatId, "tshirts/polo/", "Polo T-Shirts", "tpolo");

    // --- SHIRTS ---
    else if (data === 'm_shirt') {
        bot.sendMessage(chatId, "👔 *SHIRT COLLECTION*", {
            reply_markup: { inline_keyboard: [
                [{ text: "👕 Casual Shirt", callback_data: 'sub_s_casual' }],
                [{ text: "👔 Formal Shirt", callback_data: 'sub_s_formal' }],
                [{ text: "👕 Half Shirt", callback_data: 'sub_s_half' }],
                backBtn
            ]}
        });
    }
    else if (data === 'sub_s_casual') sendGallery(chatId, "shirts/casual/", "Casual Shirts", "scasual");
    else if (data === 'sub_s_formal') sendGallery(chatId, "shirts/formal/", "Formal Shirts", "sformal");
    else if (data === 'sub_s_half') sendGallery(chatId, "shirts/half/", "Half Shirts", "shalf");

    // --- PANTS ---
    else if (data === 'm_pant') {
        bot.sendMessage(chatId, "👖 *PANTS COLLECTION*", {
            reply_markup: { inline_keyboard: [
                [{ text: "👖 Gabardine", callback_data: 'sub_p_gab' }],
                [{ text: "👖 Jeans", callback_data: 'sub_p_jean' }],
                [{ text: "👔 Formal", callback_data: 'sub_p_formal' }],
                backBtn
            ]}
        });
    }
    else if (data === 'sub_p_gab') sendGallery(chatId, "pants/gabardine/", "Gabardine Pants", "pgab");
    else if (data === 'sub_p_jean') sendGallery(chatId, "pants/jeans/", "Jeans Pants", "pjean");
    else if (data === 'sub_p_formal') sendGallery(chatId, "pants/formal/", "Formal Pants", "pformal");

    // --- PANJABI ---
    else if (data === 'm_panjabi') {
        bot.sendMessage(chatId, "🕌 *PANJABI COLLECTION*", {
            reply_markup: { inline_keyboard: [
                [{ text: "✨ Easy Design", callback_data: 'sub_pj_easy' }],
                [{ text: "🕌 Kabli Set", callback_data: 'sub_pj_kabli' }],
                backBtn
            ]}
        });
    }
    else if (data === 'sub_pj_easy') sendGallery(chatId, "panjabi/easy/", "Easy Panjabi", "pjeasy");
    else if (data === 'sub_pj_kabli') sendGallery(chatId, "panjabi/kabli/", "Kabli Panjabi Set", "pjkabli");

    // --- JUNIOR ---
    else if (data === 'm_junior') {
        bot.sendMessage(chatId, "🧒 *JUNIOR COLLECTION*", {
            reply_markup: { inline_keyboard: [
                [{ text: "👦 Boys Collection", callback_data: 'sub_j_boys' }],
                [{ text: "👧 Girls Collection", callback_data: 'sub_j_girls' }],
                backBtn
            ]}
        });
    }
    else if (data === 'sub_j_boys') sendGallery(chatId, "junior/boys/", "Boys Collection", "jboys");
    else if (data === 'sub_j_girls') sendGallery(chatId, "junior/girls/", "Girls Collection", "jgirls");

    // --- ACCESSORIES (৩টি বাটন যোগ করা হয়েছে) ---
    else if (data === 'm_acc') {
        bot.sendMessage(chatId, "⌚ *ACCESSORIES COLLECTION*", {
            reply_markup: { inline_keyboard: [
                [{ text: "🎗️ Belt", callback_data: 'sub_a_belt' }],
                [{ text: "👔 Easy Tie", callback_data: 'sub_a_tie' }],
                [{ text: "🩲 Men's Underwear", callback_data: 'sub_a_und' }],
                backBtn
            ]}
        });
    }
    else if (data === 'sub_a_belt') sendGallery(chatId, "accessories/belt/", "Premium Belts", "abelt");
    else if (data === 'sub_a_tie') sendGallery(chatId, "accessories/tie/", "Formal Ties", "atie");
    else if (data === 'sub_a_und') sendGallery(chatId, "accessories/underwear/", "Men's Underwear", "aund");

    // --- HOT DEALS ---
    else if (data === 'm_hot') {
        sendGallery(chatId, "hotdeals/", "HOT DEALS 🔥", "hot");
    }
});

bot.onText(/\/start|\/shop/, (msg) => mainMenu(msg.chat.id, msg.from.id));

http.createServer((req, res) => { res.writeHead(200); res.end('Bot is Active!'); }).listen(process.env.PORT || 3000);
