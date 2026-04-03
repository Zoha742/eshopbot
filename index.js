const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const bot = new TelegramBot(token, {polling: true});
const ADMIN_ID = 1391942702; 

// আপনার GitHub এর ইমেজ লিঙ্কের বেস ইউআরএল
const IMAGE_BASE = "https://raw.githubusercontent.com/Zoha742/eshopbot/main/products/";

function mainMenu(chatId, userId) {
    const keyboard = [
        [{ text: "👕 T-SHIRTS", callback_data: 'm_tshirt' }, { text: "👔 SHIRTS", callback_data: 'm_shirt' }],
        [{ text: "👖 PANTS", callback_data: 'm_pant' }, { text: "🕌 PANJABI", callback_data: 'm_panjabi' }],
        [{ text: "🧒 JUNIOR", callback_data: 'm_junior' }, { text: "⌚ ACCESSORIES", callback_data: 'm_acc' }],
        [{ text: "🔥 HOT DEALS", callback_data: 'hot_deals' }]
    ];

    if (userId === ADMIN_ID) {
        keyboard.push([{ text: "⚙️ Admin Panel", callback_data: 'admin_panel' }]);
    }

    bot.sendMessage(chatId, "🍎 *Welcome to Premium eShop*\nআপনার পছন্দের ক্যাটাগরি বেছে নিন:", {
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: keyboard }
    });
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const backBtn = [{ text: "⬅️ Back", callback_data: 'main_menu' }];

    if (data === 'main_menu') {
        mainMenu(chatId, query.from.id);
    } 

    // টি-শার্ট সেকশন (শুরুতে ২টি ছবি দেখাবে)
    else if (data === 'm_tshirt') {
        const media = [
            { type: 'photo', media: IMAGE_BASE + "tshirts/tshirt1.jpg", caption: "🔥 *Our Featured T-Shirts*" },
            { type: 'photo', media: IMAGE_BASE + "tshirts/tshirt2.jpg" }
        ];
        
        bot.sendMediaGroup(chatId, media).then(() => {
            bot.sendMessage(chatId, "সবগুলো আইটেম দেখতে নিচের বাটনে ক্লিক করুন:", {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🖼 View All T-Shirts", callback_data: 'view_all_t' }],
                        backBtn
                    ]
                }
            });
        });
    }

    // সব টি-শার্টের গ্যালারি (View All)
    else if (data === 'view_all_t') {
        const gallery = [
            { type: 'photo', media: IMAGE_BASE + "tshirts/tshirt1.jpg" },
            { type: 'photo', media: IMAGE_BASE + "tshirts/tshirt2.jpg" },
            { type: 'photo', media: IMAGE_BASE + "tshirts/tshirt3.jpg" },
            { type: 'photo', media: IMAGE_BASE + "tshirts/tshirt4.jpg" },
            { type: 'photo', media: IMAGE_BASE + "tshirts/tshirt5.jpg" },
            { type: 'photo', media: IMAGE_BASE + "tshirts/tshirt6.jpg" }
        ];
        bot.sendMediaGroup(chatId, gallery);
    }
    
    // বাকি সাব-মেনু লজিকগুলো এখানে একইভাবে যোগ হবে...
});

bot.onText(/\/start|\/shop/, (msg) => {
    mainMenu(msg.chat.id, msg.from.id);
});

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is Live!');
}).listen(process.env.PORT || 3000);
