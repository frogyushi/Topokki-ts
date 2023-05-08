"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ready_1 = __importDefault(require("./discord/ready"));
const interactionCreate_1 = __importDefault(require("./discord/interactionCreate"));
const addSong_1 = __importDefault(require("./player/addSong"));
exports.default = {
    ready: ready_1.default,
    interactionCreate: interactionCreate_1.default,
    addSong: addSong_1.default,
};
