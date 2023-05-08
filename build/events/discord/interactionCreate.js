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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const app_1 = require("../../app/app");
exports.default = new app_1.AppEvent({
    name: 'interactionCreate',
    callback: (app, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        if (!(interaction instanceof discord_js_1.default.CommandInteraction) ||
            !interaction.isCommand()) {
            return;
        }
        const command = app.commands.get(interaction.commandName);
        const guild = interaction.guild;
        if (!command ||
            !guild ||
            !interaction.member) {
            return;
        }
        try {
            yield command.callback(app, interaction);
        }
        catch (err) {
            console.error(err);
        }
    })
});
