const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// টোকেন এবং অ্যাডমিন আইডি (আপনার দেওয়া তথ্য অনুযায়ী)
const token = '8624381226:AAEdlqEKTrzwIPuq1aSPIuPEfb-3GmI0nOI';
const ADMIN_CHAT_ID = '22446688'; 

const bot = new TelegramBot(token, { polling: true });

// Render বা অন্য হোস্টিং-এ সচল রাখার জন্য সার্ভার সেটআপ
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('eShop365 Bot is Running! 🚀');
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// /start কমান্ড দিলে শপ ওপেন বাটন আসবে
bot.onText(/\/start/, (msg) => {
    const opts = {
        reply_markup: {
            inline_keyboard: [[
                { 
                    text: "🛒 Open eShop365 Shop", 
                    web_app: { url: "https://zoha742.github.io/eshopbot/index.html" } 
                }
            ]]
        }
    };
    bot.sendMessage(msg.chat.id, "Welcome to eShop365! 🛍️\nনিচের বাটনটি ক্লিক করে আমাদের শপ ওপেন করুন এবং শপিং শুরু করুন।", opts);
});

// Mini App থেকে আসা অর্ডার হ্যান্ডেল করা
bot.on('message', async (msg) => {
    // শুধুমাত্র Web App থেকে আসা ডেটা চেক করবে
    if (msg.web_app_data && msg.web_app_data.data) {
        try {
            const data = JSON.parse(msg.web_app_data.data);
            
            // আইটেম লিস্ট তৈরি (ইমেজ বাটন এবং ডিটেইলস সহ)
            let itemsText = data.items.map((item, index) => 
                `${index + 1}. 📦 **${item.title}**\n   🎨 Color: ${item.color}\n   💰 Price: $${item.price}.00`
            ).join('\n\n');

            const adminReport = `🚨 **নতুন অর্ডার এলার্ট!** 🚨\n\n` +
                `👤 **ক্রেতা:** ${data.addr.name}\n` +
                `🆔 **টেলিগ্রাম ID:** \`${msg.from.id}\`\n\n` +
                `🛒 **অর্ডার বিবরণ:**\n${itemsText}\n\n` +
                `📍 **ঠিকানা:** ${data.addr.a}\n` +
                `💵 **মোট বিল:** $${data.total}.00`;

            // অ্যাডমিনকে অর্ডার পাঠানো
            await bot.sendMessage(ADMIN_CHAT_ID, adminReport, { parse_mode: 'Markdown' });

            // কাস্টমারকে কনফার্মেশন পাঠানো
            await bot.sendMessage(msg.chat.id, "✅ আপনার অর্ডারটি সফলভাবে রেকর্ড করা হয়েছে! আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবে। ধন্যবাদ।");

        } catch (error) {
            console.error("Order Data Error:", error);
            bot.sendMessage(msg.chat.id, "⚠️ অর্ডার প্রসেস করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
        }
    }
});

// এরর হ্যান্ডলিং (বট যেন ক্র্যাশ না করে)
bot.on("polling_error", (err) => console.log(err));

console.log("eShop365 Bot is active and waiting for orders... 🚀");
