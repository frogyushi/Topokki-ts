"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app/app");
const discord_js_1 = require("discord.js");
exports.default = new app_1.Command({
    data: new discord_js_1.SlashCommandBuilder()
        .setName('echo')
        .setDescription('Repeats a given message in the same channel')
        .addStringOption(option => option
        .setName('message')
        .setDescription('Provide a message')
        .setRequired(true))
        .addBooleanOption(option => option
        .setName('hidden')
        .setDescription('Set reply to be anonymous')),
    callback: (app, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const options = interaction.options;
        const message = options.getString('message');
        const hidden = options.getBoolean('hidden') || false;
        if (hidden) {
            yield interaction.deferReply();
            yield interaction.deleteReply();
            yield interaction.channel.send(message);
        }
        yield interaction.reply(message);
    })
});
