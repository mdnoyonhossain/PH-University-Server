export type UserName = {
    firstName: string;
    middleName: string;
    lastName: string;
}

export type Guardian = {
    fatherName: string;
    fatherOccuption: string;
    fatherContactNo: string;
    motherName: string;
    motherOccuption: string;
    motherContactNo: string;
}

export type LocalGuardian = {
    name: string;
    occuption: string;
    contactNo: string;
    address: string;
}

export type Student = {
    id: string;
    name: UserName,
    gender: "Male" | "Female";
    dateOfBirth?: string;
    email: string;
    contactNo: string;
    emergancyContactNo: string;
    bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "0-";
    presentAddress: string;
    permanentAddress: string;
    guardian: Guardian;
    localGuardian: LocalGuardian;
    profileImg: string;
    isActive: "Active" | "Blocked";
}