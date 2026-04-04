const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// আপনার দেওয়া টোকেন এবং অ্যাডমিন আইডি
const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const ADMIN_CHAT_ID = '22446688'; 

const bot = new TelegramBot(token, { polling: true });

// Render-এ সচল রাখার জন্য সার্ভার
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('eShop365 Bot is Running! 🚀'));
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// /start কমান্ড দিলে শপ ওপেন বাটন আসবে
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome to eShop365! 🛍️\nনিচের বাটনটি ক্লিক করে শপিং শুরু করুন।", {
        reply_markup: {
            inline_keyboard: [[
                { 
                    text: "🚀 Open eShop365", 
                    web_app: { url: "https://zoha742.github.io/eshopbot/index.html" } 
                }
            ]]
        }
    });
});

// Mini App থেকে আসা অর্ডার হ্যান্ডেল করা
bot.on('message', async (msg) => {
    if (msg.web_app_data) {
        try {
            const data = JSON.parse(msg.web_app_data.data);
            
            let itemsText = data.items.map((item, index) => 
                `${index + 1}. 📦 **${item.title}**\n   📏 Size: ${item.size} | 🎨 Color: ${item.color}\n   💰 Price: $${item.price}.00`
            ).join('\n\n');

            const adminReport = `🚨 **নতুন অর্ডার এলার্ট!** 🚨\n\n` +
                `👤 **ক্রেতা:** ${data.addr.name}\n` +
                `🆔 **ID:** \`${data.user.id}\`\n\n` +
                `📦 **অর্ডার বিবরণ:**\n${itemsText}\n\n` +
                `📍 **ঠিকানা:** ${data.addr.a}\n` +
                `💵 **মোট বিল:** $${data.total}.00`;

            // অ্যাডমিনকে (আপনাকে) অর্ডার পাঠানো
            await bot.sendMessage(ADMIN_CHAT_ID, adminReport, { parse_mode: 'Markdown' });

            // কাস্টমারকে কনফার্মেশন পাঠানো
            await bot.sendMessage(msg.chat.id, "✅ আপনার অর্ডারটি সফলভাবে রেকর্ড করা হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।");

        } catch (error) {
            console.error("Order Data Error:", error);
        }
    }
});

console.log("eShop365 Bot is running... 🚀");
