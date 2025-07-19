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
exports.getAccount = exports.getIndex = exports.getLogin = exports.getProfile = exports.changePassword = exports.changeEmail = exports.updateProfile = exports.apiProfile = exports.logout = exports.protectedSession = exports.register = exports.login = exports.updateUserById = exports.deleteUserById = exports.createUser = exports.getUserById = exports.getUsersByUsername = exports.getUsersByEmail = exports.getUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../utils/config");
const User_1 = require("../models/User");
const config_2 = require("../utils/config");
const path_1 = __importDefault(require("path"));
/// TODO mover esto
const getUsers = () => User_1.User.find();
exports.getUsers = getUsers;
const getUsersByEmail = (email) => User_1.User.findOne({ email });
exports.getUsersByEmail = getUsersByEmail;
const getUsersByUsername = (username) => User_1.User.findOne({ username });
exports.getUsersByUsername = getUsersByUsername;
const getUserById = (id) => User_1.User.findById(id);
exports.getUserById = getUserById;
const createUser = (values) => new User_1.User(values)
    .save().then((user) => user.toObject());
exports.createUser = createUser;
const deleteUserById = (id) => User_1.User.findByIdAndDelete(id);
exports.deleteUserById = deleteUserById;
const updateUserById = (id, values) => User_1.User.findByIdAndUpdate(id, values);
exports.updateUserById = updateUserById;
///
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield (0, exports.getUsersByEmail)(email).select('+authentication.salt +authentication.password');
        if (!user || !user.authentication) {
            res.status(404).json({ message: 'Email no encontrado' });
            return;
        }
        const isValidPassword = yield bcryptjs_1.default.compare(password, user.authentication.password);
        if (!isValidPassword) {
            res.status(401).json({ message: 'Contraseña o email incorrecta' });
            return;
        }
        // Comprobar que la palabra secreta de JWT este definida
        if (!config_2.JWT_SECRET) {
            res.status(500).json({ message: 'JWT_SECRET is not defined' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            savedPalettes: user.savedPalettes
        }, config_2.JWT_SECRET, {
            expiresIn: '30d'
        });
        yield user.save();
        // Devolver el json sin el bloque de autenticación
        const redirectTo = req.cookies.redirectAfterLogin || '/';
        res
            .clearCookie('redirectAfterLogin')
            .cookie('sessionToken', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
        })
            .redirect(redirectTo);
        return;
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, username, email, password } = req.body;
    try {
        // Verificar si el usuario o email está en uso
        const userByEmail = yield (0, exports.getUsersByEmail)(email);
        if (userByEmail) {
            res.status(400).json({ message: 'El email ya está en uso' });
            return;
        }
        const userByUsername = yield (0, exports.getUsersByUsername)(username);
        if (userByUsername) {
            res.status(400).json({ message: 'El usuario ya está en uso' });
            return;
        }
        // Generar un salt y hash
        const salt = yield bcryptjs_1.default.genSalt(config_1.SALT_ROUNDS);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Crear el usuario
        const newUser = yield (0, exports.createUser)({
            firstName,
            lastName,
            username,
            email,
            authentication: {
                password: hashedPassword,
                salt
            }
        });
        // Generar token JWT
        const token = jsonwebtoken_1.default.sign({
            id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            username: newUser.username,
            email: newUser.email,
            savedPalettes: newUser.savedPalettes
        }, process.env.JWT_SECRET, { expiresIn: '30d' });
        // Establecer cookie y redirigir
        const redirectTo = req.cookies.redirectAfterLogin || '/';
        res
            .clearCookie('redirectAfterLogin')
            .cookie('sessionToken', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
        })
            .redirect(redirectTo);
        return;
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.register = register;
const protectedSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    res.send(user);
    return;
});
exports.protectedSession = protectedSession;
const logout = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('sessionToken');
    res.status(200).json({ message: 'Logged out' });
    return;
});
exports.logout = logout;
const apiProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(req.user.id); // Consultar desde la BD
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }
        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            id: user._id,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener el perfil" });
    }
    return;
});
exports.apiProfile = apiProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, username } = req.body;
    if (firstName || lastName || username) {
        try {
            // Actualizar solo los campos que se envían
            const updatedUser = yield User_1.User.findByIdAndUpdate(req.user.id, // ID del usuario a actualizar
            { firstName, lastName, username }, // Campos a actualizar
            { new: true } // Devuelve el documento actualizado
            );
            if (!updatedUser) {
                throw new Error('Usuario no encontrado');
            }
            updatedUser.save();
            res.json({
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                username: updatedUser.username,
            });
            return;
        }
        catch (error) {
            res.status(500).json({ message: "Error al actualizar el perfil" });
            return;
        }
    }
    res.status(400).json({ message: "Los campos son obligatorios" });
    return;
});
exports.updateProfile = updateProfile;
const changeEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newEmail } = req.body;
    if (newEmail) {
        try {
            // Verificar si el correo ya está en uso (opcional)
            const existingUser = yield User_1.User.findOne({ email: newEmail });
            if (existingUser) {
                res.status(400).json({ message: "El correo ya está en uso" });
                return;
            }
            // Actualizar solo el email del usuario por su ID
            const updatedUser = yield User_1.User.findByIdAndUpdate(req.user.id, // ID del usuario a actualizar
            { email: newEmail }, // Solo actualizamos el email
            { new: true } // Devuelve el documento actualizado
            );
            if (!updatedUser) {
                throw new Error('Usuario no encontrado');
            }
            updatedUser.save();
            res.status(200).json({ message: "Correo actualizado correctamente" });
            return;
        }
        catch (error) {
            res.status(500).json({ message: "Error al actualizar el correo" });
            return;
        }
    }
    res.status(400).json({ message: "El correo es obligatorio" });
    return;
});
exports.changeEmail = changeEmail;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword) {
        res.status(400).json({ message: "La contraseña actual es obligatoria" });
        return;
    }
    const user = yield (0, exports.getUserById)(req.user.id).select('+authentication.salt +authentication.password');
    if (!user || !user.authentication) {
        res.status(404).json({ message: 'Error al cambiar la contraseña. Usuario no encontrado' });
        return;
    }
    const isValidPassword = yield bcryptjs_1.default.compare(currentPassword, user.authentication.password);
    if (!isValidPassword) {
        res.status(400).json({ message: "La contraseña actual es incorrecta" });
        return;
    }
    if (newPassword) {
        try {
            const salt = yield bcryptjs_1.default.genSalt(config_1.SALT_ROUNDS);
            const hashedPassword = yield bcryptjs_1.default.hash(newPassword, salt);
            user.authentication.password = hashedPassword;
            user.authentication.salt = salt;
            user.save();
            res.status(200).json({ message: "Actualizado correctamente" });
            return;
        }
        catch (error) {
            res.status(500).json({ message: "Error al actualizar la contraseña" });
            return;
        }
    }
    res.status(400).json({ message: "La nueva contraseña es obligatoria" });
    return;
});
exports.changePassword = changePassword;
const getProfile = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(path_1.default.join(__dirname, "../../client/content/profile.html"));
    return;
});
exports.getProfile = getProfile;
const getLogin = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(path_1.default.join(__dirname, "../../client/content/login.html"));
    return;
});
exports.getLogin = getLogin;
const getIndex = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(path_1.default.join(__dirname, "../../client/content/index.html"));
    return;
});
exports.getIndex = getIndex;
const getAccount = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(path_1.default.join(__dirname, "../../client/content/account.html"));
    return;
});
exports.getAccount = getAccount;
