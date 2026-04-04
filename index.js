const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});
const ADMIN_ID = 1391942702; 

const IMG_BASE = "https://raw.githubusercontent.com/Zoha742/eshopbot/main/products/";

// --- প্রোডাক্ট ডাটাবেস (এখানে আপনি নাম ও দাম পরিবর্তন করতে পারবেন) ---
const productInfo = {
    "shirt/casual/": [
        { name: "Premium Casual Shirt", price: "12" }, // 1.jpg
        { name: "Slim Fit Casual", price: "10" },      // 2.jpg
        { name: "Vintage Denim", price: "15" },        // 3.jpg
        { name: "Oxford Blue Shirt", price: "13" },    // 4.jpg
        { name: "Checkered Casual", price: "11" },     // 5.jpg
        { name: "Summer Breeze", price: "14" }         // 6.jpg
    ],
    "tshirts/printed/": [
        { name: "Graphic Printed Tee", price: "8" },
        { name: "Urban Streetwear", price: "9" },
        { name: "Minimalist Art", price: "7" },
        { name: "Retro Vibe Tee", price: "10" },
        { name: "Abstract Design", price: "8" },
        { name: "Classic Print", price: "7" }
    ]
    // এভাবে অন্য ফোল্ডারের জন্যও ডাটা যোগ করতে পারবেন
};

// ১. মেইন মেনু
function mainMenu(chatId, userId) {
    const keyboard = [
        [{ text: "👕 T-SHIRTS", callback_data: 'm_tshirt' }, { text: "👔 SHIRTS", callback_data: 'm_shirt' }],
        [{ text: "👖 PANTS", callback_data: 'm_pant' }, { text: "🕌 PANJABI", callback_data: 'm_panjabi' }],
        [{ text: "🧒 JUNIOR", callback_data: 'm_junior' }, { text: "⌚ ACCESSORIES", callback_data: 'm_acc' }],
        [{ text: "🔥 HOT DEALS", callback_data: 'm_hot' }]
    ];
    if (userId === ADMIN_ID) keyboard.push([{ text: "⚙️ Admin Panel", callback_data: 'admin_panel' }]);

    bot.sendMessage(chatId, "🍎 *Welcome to Premium eShop*\nনিচের মেনু থেকে ক্যাটাগরি বেছে নিন:", {
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: keyboard }
    });
}

// ২. শুরুর গ্যালারি (১ এবং ২ নম্বর ছবি + নাম ও দাম)
function sendInitialGallery(chatId, folderPath, title) {
    const info = productInfo[folderPath] || [];
    
    // ১ নম্বর ছবির তথ্য
    const p1 = info[0] || { name: "Premium Item", price: "0" };
    const cap1 = `✨ *${p1.name}*\n💰 Price: $${p1.price}`;

    // ২ নম্বর ছবির তথ্য
    const p2 = info[1] || { name: "Premium Item", price: "0" };
    const cap2 = `✨ *${p2.name}*\n💰 Price: $${p2.price}`;

    const media = [
        { type: 'photo', media: IMG_BASE + folderPath + "1.jpg", caption: cap1, parse_mode: "Markdown" },
        { type: 'photo', media: IMG_BASE + folderPath + "2.jpg", caption: cap2, parse_mode: "Markdown" }
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

// ৩. "See More" ফাংশন (১ থেকে ৬ পর্যন্ত নাম ও দামসহ)
async function sendFullGallery(chatId, folderPath) {
    bot.sendMessage(chatId, "⌛ ফুল গ্যালারি লোড হচ্ছে...");
    const info = productInfo[folderPath] || [];
    
    for (let i = 1; i <= 6; i++) {
        let imageUrl = `${IMG_BASE}${folderPath}${i}.jpg`;
        const item = info[i-1] || { name: "Premium Product", price: "0" };
        const caption = `✨ *${item.name}*\n💰 Price: $${item.price}`;

        try {
            await bot.sendPhoto(chatId, imageUrl, { caption: caption, parse_mode: "Markdown" });
        } catch (error) {
            break; 
        }
    }
    bot.sendMessage(chatId, "✅ সবগুলো ছবি দেখানো হয়েছে।", {
        reply_markup: { inline_keyboard: [[{ text: "⬅️ Back", callback_data: 'main_menu' }]] }
    });
}

// ৪. বাটন হ্যান্ডলার (বাকি অংশ আগের মতোই)
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const backBtn = [{ text: "⬅️ Back", callback_data: 'main_menu' }];

    if (data === 'main_menu') mainMenu(chatId, query.from.id);
    else if (data.startsWith('see_more_')) sendFullGallery(chatId, data.replace('see_more_', ''));
    
    // শার্ট ক্যাটাগরি টেস্ট
    else if (data === 'm_shirt') {
        bot.sendMessage(chatId, "👔 *SHIRT COLLECTION*", {
            reply_markup: { inline_keyboard: [
                [{ text: "👕 Casual Shirt", callback_data: 'sub_s_casual' }],
                [{ text: "👔 Formal Shirt", callback_data: 'sub_s_formal' }],
                backBtn
            ]}
        });
    }
    else if (data === 'sub_s_casual') sendInitialGallery(chatId, "shirt/casual/", "Casual Shirts");
    else if (data === 'sub_s_formal') sendInitialGallery(chatId, "shirt/formal/", "Formal Shirts");

    // বাকি ক্যাটাগরিগুলো (Printed, Polo ইত্যাদি) এখানে আগের মতো যোগ করে নিন
});

bot.onText(/\/start|\/shop/, (msg) => mainMenu(msg.chat.id, msg.from.id));
http.createServer((req, res) => { res.writeHead(200); res.end('Bot is Active!'); }).listen(process.env.PORT || 3000);
