"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentValidations = exports.createStudentValidatoinSchema = void 0;
const zod_1 = require("zod");
const userNameValidationSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(20).refine((value) => value[0] === value[0].toUpperCase(), {
        message: 'First name must start with an uppercase letter',
    }),
    middleName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().regex(/^[a-zA-Z]+$/, { message: 'Last name must only contain letters' }),
});
const guardianValidationSchema = zod_1.z.object({
    fatherName: zod_1.z.string(),
    fatherOccuption: zod_1.z.string(),
    fatherContactNo: zod_1.z.string(),
    motherName: zod_1.z.string(),
    motherOccuption: zod_1.z.string(),
    motherContactNo: zod_1.z.string(),
});
const localGuardianValidationSchema = zod_1.z.object({
    name: zod_1.z.string(),
    occuption: zod_1.z.string(),
    contactNo: zod_1.z.string(),
    address: zod_1.z.string(),
});
exports.createStudentValidatoinSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().max(20),
        student: zod_1.z.object({
            name: userNameValidationSchema,
            gender: zod_1.z.enum(['Male', 'Female', 'Other']),
            dateOfBirth: zod_1.z.string().optional(),
            email: zod_1.z.string().email(),
            contactNo: zod_1.z.string(),
            emergancyContactNo: zod_1.z.string(),
            bloodGroup: zod_1.z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
            presentAddress: zod_1.z.string(),
            permanentAddress: zod_1.z.string(),
            guardian: guardianValidationSchema,
            localGuardian: localGuardianValidationSchema,
            admissionSemester: zod_1.z.string(),
            profileImg: zod_1.z.string(),
        })
    })
});
exports.StudentValidations = {
    createStudentValidatoinSchema: exports.createStudentValidatoinSchema
};
