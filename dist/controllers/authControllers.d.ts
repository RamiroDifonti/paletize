import express from 'express';
export declare const getUsers: () => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: import("mongoose").Types.ObjectId[];
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
    savedPalettes: import("mongoose").Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
})[], import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: import("mongoose").Types.ObjectId[];
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
    savedPalettes: import("mongoose").Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: import("mongoose").Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
}, "find", {}>;
export declare const getUsersByEmail: (email: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: import("mongoose").Types.ObjectId[];
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
    savedPalettes: import("mongoose").Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: import("mongoose").Types.ObjectId[];
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
    savedPalettes: import("mongoose").Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: import("mongoose").Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
}, "findOne", {}>;
export declare const getUsersByUsername: (username: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: import("mongoose").Types.ObjectId[];
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
    savedPalettes: import("mongoose").Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: import("mongoose").Types.ObjectId[];
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
    savedPalettes: import("mongoose").Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: import("mongoose").Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
}, "findOne", {}>;
export declare const getUserById: (id: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: import("mongoose").Types.ObjectId[];
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
    savedPalettes: import("mongoose").Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: import("mongoose").Types.ObjectId[];
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
    savedPalettes: import("mongoose").Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: import("mongoose").Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
}, "findOne", {}>;
export declare const createUser: (values: Record<string, any>) => Promise<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: import("mongoose").Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const deleteUserById: (id: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: import("mongoose").Types.ObjectId[];
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
    savedPalettes: import("mongoose").Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: import("mongoose").Types.ObjectId[];
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
    savedPalettes: import("mongoose").Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: import("mongoose").Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
}, "findOneAndDelete", {}>;
export declare const updateUserById: (id: string, values: Record<string, any>) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: import("mongoose").Types.ObjectId[];
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
    savedPalettes: import("mongoose").Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: import("mongoose").Types.ObjectId[];
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
    savedPalettes: import("mongoose").Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    savedPalettes: import("mongoose").Types.ObjectId[];
    authentication?: {
        password: string;
        salt?: string | null | undefined;
    } | null | undefined;
}, "findOneAndUpdate", {}>;
export declare const login: (req: express.Request, res: express.Response) => Promise<void>;
export declare const register: (req: express.Request, res: express.Response) => Promise<void>;
export declare const protectedSession: (req: express.Request, res: express.Response) => Promise<void>;
export declare const logout: (_req: express.Request, res: express.Response) => Promise<void>;
export declare const apiProfile: (req: express.Request, res: express.Response) => Promise<void>;
export declare const updateProfile: (req: express.Request, res: express.Response) => Promise<void>;
export declare const changeEmail: (req: express.Request, res: express.Response) => Promise<void>;
export declare const changePassword: (req: express.Request, res: express.Response) => Promise<void>;
export declare const getProfile: (_req: express.Request, res: express.Response) => Promise<void>;
export declare const getLogin: (_req: express.Request, res: express.Response) => Promise<void>;
export declare const getIndex: (_req: express.Request, res: express.Response) => Promise<void>;
export declare const getAccount: (_req: express.Request, res: express.Response) => Promise<void>;
//# sourceMappingURL=authControllers.d.ts.map