import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt'
import { TUser } from "./user.interface";
import config from "../../config";

const userSchema = new Schema<TUser>({
    id: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    needsPasswordChange: { type: Boolean, default: true },
    role: { type: String, enum: ['admin', 'student', 'faculty'] },
    status: { type: String, enum: ['in-progress', 'blocked'], default: 'in-progress' },
    isDeleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    }
);

// pre save middleware / Hook
userSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
    next()
});

// post save middleware / hook
userSchema.post('save', async function(doc, next){
    doc.password = '';
    next();
})


export const User = model<TUser>('User', userSchema);