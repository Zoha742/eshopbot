const TelegramBot = require('node-telegram-bot-api');
const express = require('express'); // Render-এ পোর্ট বাইন্ডিংয়ের জন্য

const app = express();
const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const ADMIN_CHAT_ID = 'আপনার_চ্যাট_আইডি_এখানে_দিন'; // @userinfobot থেকে নিয়ে বসান

const bot = new TelegramBot(token, { polling: true });

// Render-এ অ্যাপটি সচল রাখার জন্য একটি ছোট সার্ভার
app.get('/', (req, res) => res.send('Bot is Running!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// /start কমান্ড
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome to eShop365! 🛍️\nনিচের বাটন থেকে শপ ওপেন করুন।", {
        reply_markup: {
            inline_keyboard: [[
                { 
                    text: "🚀 Open eShop365", 
                    web_app: { url: "https://your-render-app-url.com" } 
                }
            ]]
        }
    });
});

// Mini App থেকে আসা ডেটা হ্যান্ডেল করা
bot.on('message', async (msg) => {
    if (msg.web_app_data) {
        try {
            const data = JSON.parse(msg.web_app_data.data);
            
            // প্রোডাক্ট লিস্ট সাজানো
            let itemsText = data.items.map((i, index) => 
                `${index + 1}. 📦 **${i.title}**\n   📏 Size: ${i.size} | 🎨 Color: ${i.color}`
            ).join('\n\n');

            const report = `🚨 **নতুন অর্ডার এলার্ট!** 🚨\n\n` +
                `👤 **ক্রেতা:** ${data.addr.name}\n` +
                `🆔 **ID:** \`${data.user.id}\`\n\n` +
                `📦 **পণ্যসমূহ:**\n${itemsText}\n\n` +
                `📍 **ঠিকানা:** ${data.addr.a}\n` +
                `💵 **মোট বিল:** $${data.total}.00`;

            // ১. অ্যাডমিনকে জানানো
            await bot.sendMessage(ADMIN_CHAT_ID, report, { parse_mode: 'Markdown' });

            // ২. কাস্টমারকে কনফার্মেশন
            await bot.sendMessage(msg.chat.id, "✅ আপনার অর্ডারটি সফলভাবে রেকর্ড করা হয়েছে!");

        } catch (error) {
            console.error("Data Error:", error);
        }
    }
});
