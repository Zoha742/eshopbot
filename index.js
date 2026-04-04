const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// ১. আপনার বটের টোকেন (BotFather থেকে পাওয়া)
const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';

// ২. আপনার নিজের চ্যাট আইডি (অর্ডার রিসিভ করার জন্য)
// @userinfobot থেকে আপনার আইডিটি নিয়ে এখানে বসান
const ADMIN_CHAT_ID = 'আপনার_চ্যাট_আইডি_এখানে_দিন'; 

const bot = new TelegramBot(token, { polling: true });

// Render-এ পোর্ট বাইন্ডিং এবং সচল রাখার জন্য সার্ভার
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('eShop365 Bot is Live! 🚀'));
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// /start কমান্ড দিলে শপ ওপেন করার বাটন আসবে
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Welcome to eShop365! 🛍️\nনিচের বাটনটি ক্লিক করে আমাদের শপ ওপেন করুন এবং শপিং শুরু করুন।", {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "🚀 Open eShop365 Shop",
                        web_app: { url: "https://your-render-app-url.com" } // আপনার Render URL এখানে দিন
                    }
                ]
            ]
        }
    });
});

// Mini App থেকে আসা অর্ডার ডেটা হ্যান্ডেল করা
bot.on('message', async (msg) => {
    if (msg.web_app_data) {
        try {
            // Mini App থেকে পাঠানো JSON ডেটা পার্স করা
            const data = JSON.parse(msg.web_app_data.data);
            
            // প্রোডাক্ট লিস্ট সুন্দর করে সাজানো (Size, Color সহ)
            let itemsDetails = data.items.map((item, index) => {
                return `${index + 1}. 📦 **${item.title}**\n   📏 Size: ${item.size} | 🎨 Color: ${item.color}\n   💰 Price: $${item.price}.00`;
            }).join('\n\n');

            // অ্যাডমিনের (আপনার) জন্য ফুল অর্ডার রিপোর্ট
            const adminReport = `
🚨 **নতুন অর্ডার এলার্ট!** 🚨

👤 **কাস্টমার প্রোফাইল:**
- নাম: ${data.addr.name}
- আইডি: \`${data.user.id}\`
- ইউজারনেম: @${data.user.username || 'N/A'}

📦 **অর্ডারকৃত পণ্যসমূহ:**
${itemsDetails}

📍 **ডেলিভারি ঠিকানা:**
${data.addr.a}

💵 **মোট বিল:** $${data.total}.00
----------------------------
            `;

            // কাস্টমারের জন্য ছোট সামারি
            const customerMsg = `✅ **আপনার অর্ডারটি সফলভাবে রেকর্ড করা হয়েছে!**\n\n💰 মোট বিল: $${data.total}.00\n📍 ঠিকানা: ${data.addr.a}\n\nআমরা শীঘ্রই আপনার সাথে যোগাযোগ করব। ধন্যবাদ!`;

            // ১. আপনাকে (অ্যাডমিনকে) অর্ডারের ডিটেইলস পাঠানো
            await bot.sendMessage(ADMIN_CHAT_ID, adminReport, { parse_mode: 'Markdown' });

            // ২. কাস্টমারকে কনফার্মেশন মেসেজ পাঠানো
            await bot.sendMessage(msg.chat.id, customerMsg, { parse_mode: 'Markdown' });

        } catch (error) {
            console.error("ডেটা প্রসেসিং এরর:", error);
            bot.sendMessage(msg.chat.id, "❌ দুঃখিত, অর্ডারটি প্রসেস করার সময় একটি টেকনিক্যাল সমস্যা হয়েছে।");
        }
    }
});

console.log("eShop365 Bot is running successfully... 🚀");
