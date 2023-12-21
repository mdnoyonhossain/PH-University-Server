import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt'
import { TUser, UserModel } from "./user.interface";
import config from "../../config";
import { UserStatus } from "./user.constant";

const userSchema = new Schema<TUser, UserModel>({
    id: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: 0 },
    needsPasswordChange: { type: Boolean, default: true },
    passwordChangedAt: { type: Date },
    role: { type: String, enum: ['admin', 'student', 'faculty'] },
    status: { type: String, enum: UserStatus, default: 'in-progress' },
    isDeleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    }
);

// pre save middleware / Hook
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
    next()
});

// post save middleware / hook
userSchema.post('save', async function (doc, next) {
    doc.password = '';
    next();
});

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
    return await User.findOne({ id: id }).select('+password');
}

userSchema.statics.isPasswordMatched = async function (plainTextPassword, hashedPassword) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
}

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (passwordChangedTimestamp: Date, jwtIssuedTimestamp: number) {
    const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
}


export const User = model<TUser, UserModel>('User', userSchema);