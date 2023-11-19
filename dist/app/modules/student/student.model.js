"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModal = void 0;
const mongoose_1 = require("mongoose");
const userNameSchema = new mongoose_1.Schema({
    firstName: { type: String, required: [true, 'First Name is required'] },
    middleName: { type: String },
    lastName: { type: String, required: true },
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
    email: { type: String, required: true },
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
exports.StudentModal = (0, mongoose_1.model)('Student', studenSchema);
