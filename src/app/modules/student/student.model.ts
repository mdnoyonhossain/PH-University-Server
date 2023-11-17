import { Schema, model } from "mongoose";
import { Guardian, LocalGuardian, Student, UserName } from "./student.interface";

const userNameSchema = new Schema<UserName>({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
});

const guardianSchema = new Schema<Guardian>({
    fatherName: { type: String, required: true },
    fatherOccuption: { type: String, required: true },
    fatherContactNo: { type: String, required: true },
    motherName: { type: String, required: true },
    motherOccuption: { type: String, required: true },
    motherContactNo: { type: String, required: true },
});

const localGuardianSchema = new Schema<LocalGuardian>({
    name: { type: String, required: true },
    occuption: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true }
})

const studenSchema = new Schema<Student>({
    id: { type: String },
    name: userNameSchema,
    gender: ["Male", "Female"],
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    emergancyContactNo: { type: String, required: true },
    bloodGroup: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: guardianSchema,
    localGuardian: localGuardianSchema,
    profileImg: { type: String, required: true },
    isActive: ["Active", "Blocked"]
});

const Student = model<Student>('Student', studenSchema);