"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./utils/config");
const routes_1 = __importDefault(require("./routes/routes"));
const app = (0, express_1.default)();
// middlewares
app.use((0, cors_1.default)({
    credentials: true,
}));
// activar archivos estaticos y estilos
app.use(express_1.default.static(path_1.default.join(__dirname, "../client"))); // HTML
app.use('/css', express_1.default.static(path_1.default.join(__dirname, '../client')));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)()); // cookies
app.use(body_parser_1.default.json()); // transforma req.boy a formato .json
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/', (0, routes_1.default)());
const server = http_1.default.createServer(app);
server.listen({
    port: config_1.PORT,
    host: '0.0.0.0',
}, () => {
    console.log(`Server running on port ${config_1.PORT}`);
});
mongoose_1.default.Promise = Promise;
mongoose_1.default.connect(config_1.MONGO_URI);
mongoose_1.default.connection.on('error', (error) => console.log(error));
