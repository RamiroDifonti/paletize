"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SALT_ROUNDS = exports.JWT_SECRET = exports.MONGO_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
_a = process.env, _b = _a.PORT, exports.PORT = _b === void 0 ? 5000 : _b, _c = _a.MONGO_URI, exports.MONGO_URI = _c === void 0 ? "undefined" : _c, exports.JWT_SECRET = _a.JWT_SECRET;
exports.SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;
