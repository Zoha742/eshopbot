// index.js এর ভেতরে মেনু ফাংশনটি এভাবে আপডেট করুন

function mainMenu(chatId) {
    bot.sendMessage(chatId, "🛍️ **Welcome to eShop365**\nChoose an option below:", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "👕 Categories", callback_data: 'show_categories' }],
                [{ text: "👤 My Profile", callback_data: 'user_profile' }],
                [{ text: "📞 Contact Support", callback_data: 'support' }]
            ]
        }
    });
}

bot.on('callback_query', (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;

    if (data === 'user_profile') {
        bot.editMessageText("👤 **USER PROFILE**\nName: ZOZO\nStatus: Active", {
            chat_id: chatId,
            message_id: query.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "💳 Payment Methods", callback_data: 'pay_options' }],
                    [{ text: "📦 My Orders", callback_data: 'my_orders' }],
                    [{ text: "⬅️ Back", callback_data: 'main_menu' }]
                ]
            }
        });
    }

    if (data === 'pay_options') {
        bot.answerCallbackQuery(query.id, { 
            text: "Please select a payment method from the buttons below.", 
            show_alert: false 
        });
        bot.editMessageText("💳 **SELECT PAYMENT METHOD**", {
            chat_id: chatId,
            message_id: query.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "💎 TON Wallet", callback_data: 'pay_ton' }],
                    [{ text: "💵 Local (Bkash/Rocket)", callback_data: 'pay_local' }],
                    [{ text: "⬅️ Back", callback_data: 'user_profile' }]
                ]
            }
        });
    }

    // পেমেন্ট ক্লিক করলে পপআপ আসবে
    if (data === 'pay_ton') {
        bot.answerCallbackQuery(query.id, { 
            text: "Connecting to TON Wallet...\nPlease confirm the transaction in your wallet app.", 
            show_alert: true 
        });
    }
});
