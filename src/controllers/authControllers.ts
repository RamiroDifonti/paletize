import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { SALT_ROUNDS } from '../utils/config';
import { User } from '../models/User';
import { JWT_SECRET } from '../utils/config';

export const getUsers = () => User.find();
export const getUsersByEmail = (email: string) => User.findOne({ email });
export const getUsersByUsername = (username: string) => User.findOne({ username });
export const getUserBySessionToken = (sessionToken: string) => User.findOne({
    'authentication.sessionToken': sessionToken
});
export const getUserById = (id: string) => User.findById(id);
export const createUser = (values: Record<string, any>) => new User(values)
    .save().then((user) => user.toObject());
export const deleteUserById = (id: string) => User.findByIdAndDelete(id);
export const updateUserById = (id: string, values: Record<string, any>) =>
    User.findByIdAndUpdate(id, values);

export const login = async (req: express.Request, res: express.Response): Promise <void> => {
    try {
        const { email, password } = req.body;


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
                username: user.username,
                email: user.email,
                savedPalettes: user.savedPalettes
            },
            JWT_SECRET,
            { 
                expiresIn: '1h' 
            });

        const isValidPassword = await bcrypt.compare(password, user.authentication.password);
        if (!isValidPassword) {
            res.status(401).json({ message: 'Contraseña o email incorrecta' });
            return;
        }

        await user.save();
        // Devolver el json sin el bloque de autenticación
        res
            .cookie('sessionToken', token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000
            })
            .send({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email
            });
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
        const newUser = createUser({
            firstName,
            lastName,
            username,
            email,
            authentication: {
                password: hashedPassword,
                salt
            }
        });
        newUser.then((user) => {
            res.status(201).json(user);
        });
        return;
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
}

export const protectedSession = async (req: express.Request, res: express.Response): Promise <void> => {
    const token = req.cookies.sessionToken;
    // if (!token) {
    //     res.status(401).json({message: 'Unauthorized'});
    //     return;
    // }
    try {
        if (!JWT_SECRET) {
            res.status(500).json({ message: 'JWT_SECRET is not defined' });
            return;
        }
        const data = jwt.verify(token, JWT_SECRET);
        // res.render('protected', { data });
        res.send(data);
        return;
    } catch (e) {
        console.log(e);
        res.status(401).json({message: 'Unauthorized'});
        return;
    }
}

export const logout = async (_req: express.Request, res: express.Response): Promise <void> => {
    res.clearCookie('sessionToken');
    res.status(200).json({message: 'Logged out'});
    return;
}