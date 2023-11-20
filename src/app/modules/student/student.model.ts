import { Schema, model } from "mongoose";
import validator from 'validator';
import { StudentModel, TGuardian, TLocalGuardian, TStudent, TUserName } from "./student.interface";
import bcrypt from 'bcrypt'

const userNameSchema = new Schema<TUserName>({
    firstName: {
        type: String,
        required: [true, 'First Name is required'],
        maxlength: [20, "First Name can't be more than 20 chracter"],
        trim: true,
        validate: {
            validator: function (value: string) {
                const firstName = value.charAt(0).toUpperCase() + value.slice(1);
                return firstName === value;
            },
            message: '{VALUE} is not in Captlize fromate'
        }
    },
    middleName: { type: String, trim: true },
    lastName: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value: string) => validator.isAlpha(value),
            message: '{VALUE} is not valid'
        }
    },
});

const guardianSchema = new Schema<TGuardian>({
    fatherName: { type: String, required: true },
    fatherOccuption: { type: String, required: true },
    fatherContactNo: { type: String, required: true },
    motherName: { type: String, required: true },
    motherOccuption: { type: String, required: true },
    motherContactNo: { type: String, required: true },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
    name: { type: String, required: true },
    occuption: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true }
})

const studenSchema = new Schema<TStudent, StudentModel>({
    id: { type: String, required: true, unique: true },
    password: { type: String, required: [true, 'Password is required'], maxlength: [20, 'password can not be more than 20 chrecters'] },
    name: { type: userNameSchema, required: true },
    gender: {
        type: String,
        enum: {
            values: ["Male", "Female", "Other"],
            message: "{VALUE} is not valid"
        },
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) => validator.isEmail(value),
            message: '{VALUE} is not a valid email type'
        }
    },
    contactNo: { type: String, required: true },
    emergancyContactNo: { type: String, required: true },
    bloodGroup: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: { type: guardianSchema, required: true },
    localGuardian: { type: localGuardianSchema, required: true },
    profileImg: { type: String, required: true },
    isActive: { type: String, enum: ["Active", "Blocked"], default: "Active" },
    isDeleted: { type: Boolean, default: false }
});


// Query Middleware/ Hook
studenSchema.pre('find', async function (next) {
    this.find({ isDeleted: { $ne: true } })
    next()
})

studenSchema.pre('findOne', async function (next) {
    this.findOne({ isDeleted: { $ne: true } });
    next();
})

studenSchema.pre('aggregate', async function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
    next();
})

// Pre save Middleware/ hook
studenSchema.pre('save', async function (next) {
    // hasing password save into DB
    const bcrypt_salt_rounds = 12
    const user = this;

    user.password = await bcrypt.hash(user.password, bcrypt_salt_rounds)

    next();
})

// Post save Middleware/ hook
studenSchema.post('save', function (doc, next) {
    doc.password = '';

    next();
})


// CREATE CUSTOM STATIC METHOD
studenSchema.statics.isExistsUser = async function (id: string) {
    const existingUser = await Student.findOne({ id });
    return existingUser;
}

/*** CREATE CUSTOM INSTANCE METHOD
// studenSchema.methods.isExistsUser = async function (id: string) {
//     const existingUser = await Student.findOne({ id: id });
//     return existingUser;
// }

 *****/

export const Student = model<TStudent>('Student', studenSchema);