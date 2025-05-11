import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { SALT_ROUNDS } from '../utils/config';
import { User } from '../models/User';
import { JWT_SECRET } from '../utils/config';
import path from 'path';


/// TODO mover esto
export const getUsers = () => User.find();
export const getUsersByEmail = (email: string) => User.findOne({ email });
export const getUsersByUsername = (username: string) => User.findOne({ username });
export const getUserById = (id: string) => User.findById(id);
export const createUser = (values: Record<string, any>) => new User(values)
    .save().then((user) => user.toObject());
export const deleteUserById = (id: string) => User.findByIdAndDelete(id);
export const updateUserById = (id: string, values: Record<string, any>) =>
    User.findByIdAndUpdate(id, values);
///

export const login = async (req: express.Request, res: express.Response): Promise <void> => {
    try {
        const {email, password } = req.body;

        const user = await getUsersByEmail(email).select('+authentication.salt +authentication.password');
        if (!user || !user.authentication) {
            res.status(404).json({ message: 'Email no encontrado' });
            return;
        }
        // Comprobar que la palabra secreta de JWT este definida
        if (!JWT_SECRET) {
            res.status(500).json({ message: 'JWT_SECRET is not defined' });
            return;
        }

        const token = jwt.sign(
            {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                savedPalettes: user.savedPalettes
            },
            JWT_SECRET,
            {
                expiresIn: '30d'
            });

        const isValidPassword = await bcrypt.compare(password, user.authentication.password);
        if (!isValidPassword) {
            res.status(401).json({ message: 'Contraseña o email incorrecta' });
            return;
        }

        await user.save();
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
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
}

export const register = async (req: express.Request, res: express.Response): Promise <void> => {
    const { firstName, lastName, username, email, password} = req.body
    try {
        // Verificar si el usuario o email está en uso
        const userByEmail = await getUsersByEmail(email);
        if (userByEmail) {
            res.status(400).json({message: 'El email ya está en uso'});
            return;
        }
        const userByUsername = await getUsersByUsername(username);
        if (userByUsername) {
            res.status(400).json({message: 'El nombre de usuario ya está en uso'});
            return;
        }
        // Generar un salt y hash
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Crear el usuario
        const newUser = await createUser({
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
        const token = jwt.sign(
            {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                username: newUser.username,
                email: newUser.email,
                savedPalettes: newUser.savedPalettes
            },
            process.env.JWT_SECRET!,
            { expiresIn: '30d' }
        );

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
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
}

export const protectedSession = async (req: express.Request, res: express.Response): Promise <void> => {
    const user = req.user;
    if (!user) {
        res.status(401).json({message: 'Unauthorized'});
        return;
    }
    res.send(user);
    return;
}

export const logout = async (_req: express.Request, res: express.Response): Promise <void> => {
    res.clearCookie('sessionToken');
    res.status(200).json({message: 'Logged out'});
    return;
}

export const apiProfile = async (req: express.Request, res: express.Response): Promise <void> => {
    try {
        const user = await User.findById(req.user.id); // Consultar desde la BD
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
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el perfil" });
    }
    return;
}

export const updateProfile = async (req: express.Request, res: express.Response): Promise <void> => {
    const { firstName, lastName, username } = req.body;
    if (firstName || lastName || username) {
        try {
            // Actualizar solo los campos que se envían
            const updatedUser = await User.findByIdAndUpdate(
                req.user.id, // ID del usuario a actualizar
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
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar el perfil" });
            return;
        }
    }
    res.status(400).json({ message: "Los campos son obligatorios" });
    return;
}

export const changeEmail = async (req: express.Request, res: express.Response): Promise <void> => {
    const { newEmail } = req.body;
    if (newEmail) {
        try {
            // Verificar si el correo ya está en uso (opcional)
            const existingUser = await User.findOne({ email: newEmail });
            if (existingUser) {
                res.status(400).json({ message: "El correo ya está en uso" });
                return;
            }
    
            // Actualizar solo el email del usuario por su ID
            const updatedUser = await User.findByIdAndUpdate(
                req.user.id, // ID del usuario a actualizar
                { email: newEmail }, // Solo actualizamos el email
                { new: true } // Devuelve el documento actualizado
            );
                
            if (!updatedUser) {
                throw new Error('Usuario no encontrado');
            }
            updatedUser.save();
            res.status(200).json({ message: "Correo actualizado correctamente" });
            return;
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar el correo" });
            return;
        }
    }
    res.status(400).json({ message: "El correo es obligatorio" });
    return;
}

export const changePassword = async (req: express.Request, res: express.Response): Promise <void> => {
    const {currentPassword, newPassword } = req.body;
    if (!currentPassword) {
        res.status(400).json({ message: "La contraseña actual es obligatoria" });
        return;
    }
    const user = await getUserById(req.user.id).select('+authentication.salt +authentication.password');
    if (!user || !user.authentication) {
        res.status(404).json({ message: 'Error al cambiar la contraseña. Usuario no encontrado' });
        return;
    }
    const isValidPassword = await bcrypt.compare(currentPassword, user.authentication.password);
    if (!isValidPassword) {
        res.status(400).json({ message: "La contraseña actual es incorrecta" });
        return;
    }
    if (newPassword) {
        try {
            const salt = await bcrypt.genSalt(SALT_ROUNDS);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.authentication.password = hashedPassword;
            user.authentication.salt = salt;
            user.save();
            res.status(200).json({ message: "Actualizado correctamente" });
            return;
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar la contraseña" });
            return;
        }
    }
    res.status(400).json({ message: "La nueva contraseña es obligatoria" });
    return;
    
}



export const getProfile = async (_req: express.Request, res: express.Response): Promise <void> => {
    res.sendFile(path.join(__dirname, "../../client/content/profile.html"));
    return;
}

export const getLogin = async (_req: express.Request, res: express.Response): Promise <void> => {
    res.sendFile(path.join(__dirname, "../../client/content/login.html"));
    return;
}

export const getIndex = async (_req: express.Request, res: express.Response): Promise <void> => {
    res.sendFile(path.join(__dirname, "../../client/content/index.html"));
    return;
}

export const getAccount = async (_req: express.Request, res: express.Response): Promise <void> => {
    res.sendFile(path.join(__dirname, "../../client/content/account.html"));
    return;
}