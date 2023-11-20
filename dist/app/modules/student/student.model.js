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
exports.Student = void 0;
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const userNameSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is required'],
        maxlength: [20, "First Name can't be more than 20 chracter"],
        trim: true,
        // validate: {
        //     validator: function (value: string) {
        //         const firstName = value.charAt(0).toUpperCase() + value.slice(1);
        //         return firstName === value;
        //     },
        //     message: '{VALUE} is not in Captlize fromate'
        // }
    },
    middleName: { type: String, trim: true },
    lastName: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value) => validator_1.default.isAlpha(value),
            message: '{VALUE} is not valid'
        }
    },
});
const guardianSchema = new mongoose_1.Schema({
    fatherName: { type: String, required: true },
    fatherOccuption: { type: String, required: true },
    fatherContactNo: { type: String, required: true },
    motherName: { type: String, required: true },
    motherOccuption: { type: String, required: true },
    motherContactNo: { type: String, required: true },
});
const localGuardianSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    occuption: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true }
});
const studenSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
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
            validator: (value) => validator_1.default.isEmail(value),
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
    isActive: { type: String, enum: ["Active", "Blocked"], default: "Active" }
});
// CREATE CUSTOM STATIC METHOD
studenSchema.statics.isExistsUser = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield exports.Student.findOne({ id });
        return existingUser;
    });
};
/*** CREATE CUSTOM INSTANCE METHOD
// studenSchema.methods.isExistsUser = async function (id: string) {
//     const existingUser = await Student.findOne({ id: id });
//     return existingUser;
// }

 *****/
exports.Student = (0, mongoose_1.model)('Student', studenSchema);
