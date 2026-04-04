const express = require('express');
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, ''))); // HTML ফাইল সার্ভ করার জন্য

// MongoDB কানেকশন
const mongoURI = "YOUR_MONGODB_ATLAS_CONNECTION_STRING"; 
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log("DB Error:", err));

// ইউজার স্কিমা (ডেটাবেজে যা জমা থাকবে)
const userSchema = new mongoose.Schema({
    tgId: String,
    name: String,
    address: String,
    orders: Array
});
const User = mongoose.model('User', userSchema);

// টেলিগ্রাম বট সেটআপ
const token = 'YOUR_BOT_TOKEN';
const bot = new TelegramBot(token, {polling: true});

// মেইন মেনু কিবোর্ড
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome to eShop365! 🛍️\nনিচের বাটন থেকে শপিং শুরু করুন।", {
        reply_markup: {
            keyboard: [
                [{ text: "🚀 Open eShop365", web_app: { url: "https://your-render-app.onrender.com" } }],
                [{ text: "🟢 Fiverr Shop" }, { text: "🤖 AI Support" }]
            ],
            resize_keyboard: true
        }
    });
});

// অর্ডার রিসিভ করার API
app.post('/save-order', async (req, res) => {
    try {
        const { tgId, name, address, order } = req.body;
        let user = await User.findOne({ tgId });
        if (!user) {
            user = new User({ tgId, name, address, orders: [order] });
        } else {
            user.address = address;
            user.orders.push(order);
        }
        await user.save();
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
