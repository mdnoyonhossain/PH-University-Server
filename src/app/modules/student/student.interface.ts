import { Model } from "mongoose";

export type TUserName = {
    firstName: string;
    middleName?: string;
    lastName: string;
}

export type TGuardian = {
    fatherName: string;
    fatherOccuption: string;
    fatherContactNo: string;
    motherName: string;
    motherOccuption: string;
    motherContactNo: string;
}

export type TLocalGuardian = {
    name: string;
    occuption: string;
    contactNo: string;
    address: string;
}

export type TStudent = {
    id: string;
    name: TUserName,
    gender: "Male" | "Female" | "Other",
    dateOfBirth?: string;
    email: string;
    contactNo: string;
    emergancyContactNo: string;
    bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    presentAddress: string;
    permanentAddress: string;
    guardian: TGuardian;
    localGuardian: TLocalGuardian;
    profileImg: string;
    isActive: "Active" | "Blocked";
}

export type TStudentMethod = {
    isExistsUser(id: string): Promise<TStudent | null>
}

export type TStudentModel = Model<TStudent, Record<string, never>, TStudentMethod>