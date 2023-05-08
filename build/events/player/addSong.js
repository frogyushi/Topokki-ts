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
const player_1 = require("../../app/player");
exports.default = new player_1.PlayerEvent({
    name: 'addSong',
    callback: (app, queue, song) => __awaiter(void 0, void 0, void 0, function* () {
        const queueLength = queue.songs.length - 1;
        const embedFields = [
            {
                name: 'Artist',
                value: song.uploader.name,
                inline: true,
            },
            {
                name: 'Duration',
                value: song.formattedDuration,
                inline: true,
            },
            {
                name: 'Estimate time of playback',
                value: queue.formattedCurrentTime,
                inline: true,
            },
            {
                name: 'Position',
                value: queueLength ? queueLength.toString() : '-',
                inline: true,
            }
        ];
        const embed = new discord_js_1.default.EmbedBuilder()
            .setAuthor({ name: 'Added to Queue' })
            .setTitle(song.name)
            .setTimestamp()
            .setColor('#1E1F22')
            .addFields(embedFields);
        queue.textChannel.send({ embeds: [embed] });
    })
});
