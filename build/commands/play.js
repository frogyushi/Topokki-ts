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
        .setName('play')
        .setDescription('Play audio in the voice channel the user is currently in')
        .addStringOption(option => option
        .setName('search_term')
        .setDescription('Play any audio or video content by providing a search term or a url')
        .setRequired(true)),
    callback: (app, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const options = interaction.options;
        const searchTerm = options.getString('search_term');
        app.player.play(interaction, searchTerm);
        interaction.reply(`Searching ${(0, discord_js_1.inlineCode)(searchTerm)}`);
    })
});
