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
        .setName('clear')
        .setDescription('Clears a specified amount of messages in the current text channel')
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator |
        discord_js_1.PermissionFlagsBits.ManageMessages)
        .addNumberOption(option => option
        .setName('amount')
        .setDescription('Provide an amount')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)),
    callback: (app, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const options = interaction.options;
        const textChannel = interaction.channel;
        const amount = options.getNumber('amount');
        yield textChannel.bulkDelete(amount, true);
    })
});
