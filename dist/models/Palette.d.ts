import mongoose from "mongoose";
export declare const Palette: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    colorModel: "hsl" | "oklch";
    brandColor: string;
    colorScheme: "analogous" | "complementary" | "triad" | "split-complementary" | "square";
    colors: string[];
    firstContrast: "increase" | "decrease";
    secondContrast: "increase" | "decrease";
    wcagLevel: "aa" | "aaa";
    colorSeparation: number;
    creator: mongoose.Types.ObjectId;
    private: boolean;
    likes: mongoose.Types.ObjectId[];
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    colorModel: "hsl" | "oklch";
    brandColor: string;
    colorScheme: "analogous" | "complementary" | "triad" | "split-complementary" | "square";
    colors: string[];
    firstContrast: "increase" | "decrease";
    secondContrast: "increase" | "decrease";
    wcagLevel: "aa" | "aaa";
    colorSeparation: number;
    creator: mongoose.Types.ObjectId;
    private: boolean;
    likes: mongoose.Types.ObjectId[];
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    colorModel: "hsl" | "oklch";
    brandColor: string;
    colorScheme: "analogous" | "complementary" | "triad" | "split-complementary" | "square";
    colors: string[];
    firstContrast: "increase" | "decrease";
    secondContrast: "increase" | "decrease";
    wcagLevel: "aa" | "aaa";
    colorSeparation: number;
    creator: mongoose.Types.ObjectId;
    private: boolean;
    likes: mongoose.Types.ObjectId[];
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
    name: string;
    colorModel: "hsl" | "oklch";
    brandColor: string;
    colorScheme: "analogous" | "complementary" | "triad" | "split-complementary" | "square";
    colors: string[];
    firstContrast: "increase" | "decrease";
    secondContrast: "increase" | "decrease";
    wcagLevel: "aa" | "aaa";
    colorSeparation: number;
    creator: mongoose.Types.ObjectId;
    private: boolean;
    likes: mongoose.Types.ObjectId[];
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    colorModel: "hsl" | "oklch";
    brandColor: string;
    colorScheme: "analogous" | "complementary" | "triad" | "split-complementary" | "square";
    colors: string[];
    firstContrast: "increase" | "decrease";
    secondContrast: "increase" | "decrease";
    wcagLevel: "aa" | "aaa";
    colorSeparation: number;
    creator: mongoose.Types.ObjectId;
    private: boolean;
    likes: mongoose.Types.ObjectId[];
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    colorModel: "hsl" | "oklch";
    brandColor: string;
    colorScheme: "analogous" | "complementary" | "triad" | "split-complementary" | "square";
    colors: string[];
    firstContrast: "increase" | "decrease";
    secondContrast: "increase" | "decrease";
    wcagLevel: "aa" | "aaa";
    colorSeparation: number;
    creator: mongoose.Types.ObjectId;
    private: boolean;
    likes: mongoose.Types.ObjectId[];
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=Palette.d.ts.map