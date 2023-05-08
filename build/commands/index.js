"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const echo_1 = __importDefault(require("./echo"));
const clear_1 = __importDefault(require("./clear"));
const play_1 = __importDefault(require("./play"));
exports.default = {
    clear: clear_1.default,
    echo: echo_1.default,
    play: play_1.default,
};
