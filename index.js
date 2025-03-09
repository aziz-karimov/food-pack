require('dotenv').config();
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy');

const bot = new Bot(process.env.BOT_API_KEY);

bot.api.setMyCommands([
    { command: 'start', description: 'Запуск бота' },
]);

bot.api.setMyDescription(
    "Этот бот поможет вам узнать больше о компании FoodPack, ознакомиться с продукцией, получить контакты и задать вопросы."
);

// Главное меню
bot.command('start', async (ctx) => {
    try {
        const keyboard = new Keyboard()
            .text('О компании').text('Наша продукция').row()
            .text('Контакты').text('Вопросы и предложения')
            .resized();

        await ctx.reply('🚀 Добро пожаловать в FoodPackBot! 🍽', {
            reply_markup: keyboard,
        });
    } catch (error) {
        console.error('Ошибка в команде /start:', error);
    }
});

// Обработчик кнопки "О компании"
bot.hears('О компании', async (ctx) => {
    try {
        const aboutText = `
📌 **ООО «PLAST TECH SOLUTION»**  
Мы производим одноразовую пластиковую посуду **FOOD PACK**.  
📅 На рынке с **2018 года**  
✅ Высокое качество и конкурентные цены!  
🔗 Подробнее: [foodpack.uz](https://foodpack.uz/)
        `;
        await ctx.reply(aboutText, { parse_mode: 'Markdown' });
    } catch (error) {
        console.error('Ошибка в обработке "О компании":', error);
    }
});

// Обработчик кнопки "Контакты"
bot.hears('Контакты', async (ctx) => {
    try {
        const contactInfo = `
📅 Рабочие часы: Пн-Сб, 09:00 - 17:00  
📞 Телефон: +998981159900, +998771159900  
📍 Адрес: г. Ташкент, Янгихаётский район, Южная пром. зона, Файзли МСГ
        `;
        await ctx.reply(contactInfo);

        const latitude = 41.181827;
        const longitude = 69.239896;
        await ctx.replyWithLocation(latitude, longitude);
    } catch (error) {
        console.error('Ошибка в обработке "Контакты":', error);
    }
});

// Обработчик кнопки "Наша продукция"
bot.hears('Наша продукция', async (ctx) => {
    try {
        const productsKeyboard = new InlineKeyboard()
            .url('🍽️ Одноразовая посуда', 'https://foodpack.uz/product-category/odnorazovaya-posuda/').row()
            .url('📦 Пластиковые контейнера', 'https://foodpack.uz/product-category/plastikovye-kontejnery/').row()
            .url('🛍️ Пакеты и упаковка', 'https://foodpack.uz/product-category/pakety-i-upakovochnye-materialy/').row()
            .url('📄 Бумажная продукция', 'https://foodpack.uz/product-category/bumazhnaya-produkcziya/').row()
            .url('🧼 Уборка и гигиена', 'https://foodpack.uz/product-category/uborka-i-gigiena/');

        await ctx.reply('Выберите категорию продукции:', {
            reply_markup: productsKeyboard,
        });
    } catch (error) {
        console.error('Ошибка в обработке "Наша продукция":', error);
    }
});

// Обработчик кнопки "Вопросы и предложения"
bot.hears('Вопросы и предложения', async (ctx) => {
    try {
        const contactPerson = `
📩 *Для вопросов и предложений:*  
👤 *Менеджер:* [FOOD PACK](https://t.me/foodpackuz)  
📞 *Телефон:* +998981159900  
        `;

        await ctx.reply(contactPerson, { parse_mode: 'Markdown' }); // MarkdownV2 НЕ нужен
    } catch (error) {
        console.error('Ошибка в обработке "Вопросы и предложения":', error);
    }
});

// Обработчик неизвестных сообщений
bot.on('message', async (ctx) => {
    if (ctx.message.text) { // Проверяем, есть ли текст в сообщении
        await ctx.reply('Ошибка! Используйте кнопки или /start');
    }
});

// Обработчик ошибок (Оставляем только ОДИН)
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`🚨 Ошибка при обработке update ${ctx.update.update_id}:`, err);

    const e = err.error;
    if (e instanceof GrammyError) {
        console.error('❌ Ошибка Telegram API:', e.description);
    } else if (e instanceof HttpError) {
        console.error('⚠️ Ошибка сети:', e);
    } else {
        console.error('🛑 Неизвестная ошибка:', e);
    }
});

// Запуск бота
bot.start();
