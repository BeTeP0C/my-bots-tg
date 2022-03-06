const telegramApi = require("node-telegram-bot-api")
const token = "5291922466:AAGJ7LwuCl5rbFMG-N5fYpr0kmV75JG7CxU";
const bot = new telegramApi(token, {polling: true});
const {gameOptions, againOptions} = require('./options.js');
const chats = {};

const startGames = async (chatId) => {
    await bot.sendMessage(chatId, "Я загадал число от 1 до 10, попробуй отгадать");
    await  bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/6b6/819/6b6819f7-d7b1-356a-ba76-e07759a8b31c/4.webp");
    const randomNumber = Math.floor(Math.random() * 10);

    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = async () => {
    await bot.setMyCommands([
        {command: "/start", description: "Начальное приветствие"},
        {command: "/info", description: "Информация о пользователе"},
        {command: "/game", description: "Начинает игру - угадай число"},
    ])

    bot.on("message", async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === "/start") {
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/9a5/3d6/9a53d66b-53c8-3ccb-a3dd-75fa64c18322/192/20.webp")
            return bot.sendMessage(chatId, "Добро пожаловать");
        }

        if (text === "/info") {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
        }

        if (text === "/game") {
            return startGames(chatId);
        }

        return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз!");
    });

    bot.on("callback_query", async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === "/again") {
            return startGames(chatId);
        }

        console.log(data, chats[chatId]);

        if (data == chats[chatId]) {
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/6b6/819/6b6819f7-d7b1-356a-ba76-e07759a8b31c/192/24.webp");
            return bot.sendMessage(chatId, `Ехху ты угадал, это была цифра ${chats[chatId]}, поздравляю`, againOptions);
        } else {
            return bot.sendMessage(chatId, `К сожелению ты не угадал, бот загадывал ${chats[chatId]}`, againOptions);
        }

    });
};

start();