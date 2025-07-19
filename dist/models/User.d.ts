import mongoose from "mongoose";
export declare const User: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: mongoose.Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: mongoose.Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: mongoose.Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: mongoose.Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: mongoose.Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: mongoose.Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=User.d.ts.map