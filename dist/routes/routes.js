"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const paletteRoutes_1 = __importDefault(require("./paletteRoutes"));
const router = express_1.default.Router();
exports.default = () => {
    (0, authRoutes_1.default)(router);
    (0, paletteRoutes_1.default)(router);
    return router;
};
