const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// আপনার বটের টোকেন এবং অ্যাডমিন আইডি
const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});
const ADMIN_ID = 1391942702; 

// GitHub ইমেজ বেস ইউআরএল
const IMG_BASE = "https://raw.githubusercontent.com/Zoha742/eshopbot/main/products/";

// ১. মেইন মেনু ফাংশন
function mainMenu(chatId, userId) {
    const keyboard = [
        [{ text: "👕 T-SHIRTS", callback_data: 'm_tshirt' }, { text: "👔 SHIRTS", callback_data: 'm_shirt' }],
        [{ text: "👖 PANTS", callback_data: 'm_pant' }, { text: "🕌 PANJABI", callback_data: 'm_panjabi' }],
        [{ text: "🧒 JUNIOR", callback_data: 'm_junior' }, { text: "⌚ ACCESSORIES", callback_data: 'm_acc' }],
        [{ text: "🔥 HOT DEALS", callback_data: 'm_hot' }]
    ];
    if (userId === ADMIN_ID) keyboard.push([{ text: "⚙️ Admin Panel", callback_data: 'admin_panel' }]);

    bot.sendMessage(chatId, "🍎 *Welcome to Premium eShop*", {
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: keyboard }
    });
}

// ২. শুরুর গ্যালারি ফাংশন (১ এবং ২ নম্বর ছবি দেখাবে)
function sendInitialGallery(chatId, folderPath, title) {
    const media = [
        { type: 'photo', media: IMG_BASE + folderPath + "1.jpg", caption: `✨ *${title}*` },
        { type: 'photo', media: IMG_BASE + folderPath + "2.jpg" }
    ];
    bot.sendMediaGroup(chatId, media).then(() => {
        bot.sendMessage(chatId, "বাকি সব আইটেম দেখতে নিচের বাটনে ক্লিক করুন:", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🖼 See More", callback_data: 'see_more_' + folderPath }],
                    [{ text: "⬅️ Back", callback_data: 'main_menu' }]
                ]
            }
        });
    });
}

// ৩. "See More" ফাংশন (১ থেকে ৬ পর্যন্ত সবগুলো ছবি পাঠাবে)
async function sendFullGallery(chatId, folderPath) {
    bot.sendMessage(chatId, "⌛ ফুল গ্যালারি লোড হচ্ছে (১-৬)...");
    
    for (let i = 1; i <= 6; i++) {
        let imageUrl = `${IMG_BASE}${folderPath}${i}.jpg`;
        try {
            await bot.sendPhoto(chatId, imageUrl, { caption: `Product ${i}` });
        } catch (error) {
            // যদি ফোল্ডারে ৬টির কম ছবি থাকে তবে লুপ থেমে যাবে
            break; 
        }
    }
    bot.sendMessage(chatId, "✅ সবগুলো ছবি দেখানো হয়েছে।", {
        reply_markup: { inline_keyboard: [[{ text: "⬅️ Back", callback_data: 'main_menu' }]] }
    });
}

// ৪. বাটন এবং কমান্ড হ্যান্ডলার
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const backBtn = [{ text: "⬅️ Back", callback_data: 'main_menu' }];

    if (data === 'main_menu') mainMenu(chatId, query.from.id);

    // See More বাটন ক্লিক করলে ১-৬ ছবি দেখাবে
    else if (data.startsWith('see_more_')) {
        const folder = data.replace('see_more_', '');
        sendFullGallery(chatId, folder);
    }

    // --- ক্যাটাগরি এবং সাব-মেনু লজিক ---
    
    // T-SHIRTS
    else if (data === 'm_tshirt') {
        bot.sendMessage(chatId, "👕 *T-SHIRT COLLECTION*", {
            reply_markup: { inline_keyboard: [
                [{ text: "🎨 Printed T-Shirt", callback_data: 'sub_t_print' }],
                [{ text: "👕 Polo T-Shirt", callback_data: 'sub_t_polo' }],
                backBtn
            ]}
        });
    }
    else if (data === 'sub_t_print') sendInitialGallery(chatId, "tshirts/printed/", "Printed T-Shirts");
    else if (data === 'sub_t_polo') sendInitialGallery(chatId, "tshirts/polo/", "Polo T-Shirts");

    // SHIRTS
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
    else if (data === 'sub_s_casual') sendInitialGallery(chatId, "shirt/casual/", "Casual Shirts");
    else if (data === 'sub_s_formal') sendInitialGallery(chatId, "shirt/formal/", "Formal Shirts");
    else if (data === 'sub_s_half') sendInitialGallery(chatId, "shirt/half/", "Half Shirts");

    // PANTS
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
    else if (data === 'sub_p_gab') sendInitialGallery(chatId, "pants/gabardine/", "Gabardine Pants");
    else if (data === 'sub_p_jean') sendInitialGallery(chatId, "pants/jeans/", "Jeans Pants");
    else if (data === 'sub_p_formal') sendInitialGallery(chatId, "pants/formal/", "Formal Pants");

    // PANJABI
    else if (data === 'm_panjabi') {
        bot.sendMessage(chatId, "🕌 *PANJABI COLLECTION*", {
            reply_markup: { inline_keyboard: [
                [{ text: "✨ Easy Design", callback_data: 'sub_pj_easy' }],
                [{ text: "🕌 Kabli Set", callback_data: 'sub_pj_kabli' }],
                backBtn
            ]}
        });
    }
    else if (data === 'sub_pj_easy') sendInitialGallery(chatId, "panjabi/easy/", "Easy Panjabi");
    else if (data === 'sub_pj_kabli') sendInitialGallery(chatId, "panjabi/kabli/", "Kabli Panjabi Set");

    // JUNIOR
    else if (data === 'm_junior') {
        bot.sendMessage(chatId, "🧒 *JUNIOR COLLECTION*", {
            reply_markup: { inline_keyboard: [
                [{ text: "👦 Boys Collection", callback_data: 'sub_j_boys' }],
                [{ text: "👧 Girls Collection", callback_data: 'sub_j_girls' }],
                backBtn
            ]}
        });
    }
    else if (data === 'sub_j_boys') sendInitialGallery(chatId, "junior/boys/", "Boys Collection");
    else if (data === 'sub_j_girls') sendInitialGallery(chatId, "junior/girls/", "Girls Collection");

    // ACCESSORIES
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
    else if (data === 'sub_a_belt') sendInitialGallery(chatId, "accessories/belt/", "Premium Belts");
    else if (data === 'sub_a_tie') sendInitialGallery(chatId, "accessories/tie/", "Formal Ties");
    else if (data === 'sub_a_und') sendInitialGallery(chatId, "accessories/underwear/", "Men's Underwear");

    // HOT DEALS
    else if (data === 'm_hot') sendInitialGallery(chatId, "hotdeals/", "HOT DEALS 🔥");
});

bot.onText(/\/start|\/shop/, (msg) => mainMenu(msg.chat.id, msg.from.id));

// Render সার্ভার সচল রাখার জন্য ছোট HTTP সার্ভার
http.createServer((req, res) => { res.writeHead(200); res.end('Bot is Live and Active!'); }).listen(process.env.PORT || 3000);
