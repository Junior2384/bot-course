const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');
const token = process.env.TOKEN;

const bot = new TelegramApi(token, {polling: true});

const chats = {};
const startGame = async (chatId) => {
    await bot.sendMessage(
        chatId,
        'Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать.',
    );
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
};

bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Получить информацию о пользователе'},
    {command: '/game', description: 'Игра: угадай цифру'},
]);

const start = async () => {
    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(
                chatId,
                'https://tlgrm.eu/_/stickers/08d/60b/08d60b98-9395-4bb3-b6ad-097263c76863/1.webp',
            );
            return bot.sendMessage(
                chatId,
                `Добро пожаловать на мой телеграм-канал New-Bot!`,
            );
        }

        if (text === '/info') {
            return bot.sendMessage(
                chatId,
                `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`,
            );
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!');
    });
};

bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
        return startGame(chatId);
    }

    if (data === chats[chatId].toString()) {
        await bot.sendMessage(
            chatId,
            `Поздравляю, ты угадал цифру ${data}`,
            againOptions,
        );
    } else {
        await bot.sendMessage(
            chatId,
            `К сожалению, ты не угадал, бот загадал цифру ${chats[chatId]}`,
            againOptions,
        );
    }
});

start();
