const TelegramBot = require('node-telegram-bot-api');

// আপনার দেওয়া API টোকেন
const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';

// @userinfobot থেকে আপনার আইডিটি নিয়ে এখানে বসান (অর্ডার রিসিভ করার জন্য)
const ADMIN_CHAT_ID = '22446688'; 

const bot = new TelegramBot(token, { polling: true });

// বট স্টার্ট হলে শপ ওপেন করার বাটন
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome to eShop365! 🛍️\nনিচের বাটনটি ক্লিক করে শপিং শুরু করুন।", {
        reply_markup: {
            inline_keyboard: [[
                { 
                    text: "🚀 Open eShop365", 
                    web_app: { url: "https://your-render-app-url.com" } // আপনার Render URL এখানে দিন
                }
            ]]
        }
    });
});

// Mini App থেকে অর্ডারের ডেটা রিসিভ করার মেইন লজিক
bot.on('message', async (msg) => {
    if (msg.web_app_data) {
        try {
            const data = JSON.parse(msg.web_app_data.data);
            
            // প্রোডাক্ট লিস্ট সাজানো (Size এবং Color সহ)
            let itemsText = data.items.map((item, index) => {
                return `${index + 1}. 📦 **${item.title}**\n   📏 Size: ${item.size} | 🎨 Color: ${item.color}\n   💰 Price: $${item.price}.00`;
            }).join('\n\n');

            // অ্যাডমিনের (আপনার) জন্য রিপোর্ট
            const adminReport = `🚨 **নতুন অর্ডার এসেছে!** 🚨\n\n` +
                `👤 **ক্রেতার নাম:** ${data.addr.name}\n` +
                `🆔 **টেলিগ্রাম ID:** \`${data.user.id}\`\n` +
                `📞 **ইউজারনেম:** @${data.user.username || 'N/A'}\n\n` +
                `📦 **অর্ডার বিবরণ:**\n${itemsText}\n\n` +
                `📍 **ঠিকানা:** ${data.addr.a}\n` +
                `💵 **মোট বিল:** $${data.total}.00`;

            // ১. আপনাকে (অ্যাডমিনকে) অর্ডারের ডিটেইলস পাঠানো
            await bot.sendMessage(ADMIN_CHAT_ID, adminReport, { parse_mode: 'Markdown' });

            // ২. কাস্টমারকে কনফার্মেশন পাঠানো
            await bot.sendMessage(msg.chat.id, "✅ আপনার অর্ডারটি সফলভাবে রেকর্ড করা হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।");

        } catch (error) {
            console.error("Data Error:", error);
            bot.sendMessage(msg.chat.id, "❌ দুঃখিত, অর্ডার প্রসেস করতে সমস্যা হয়েছে।");
        }
    }
});

console.log("eShop365 Bot is running... 🚀");
