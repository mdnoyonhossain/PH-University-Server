"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicDepartmentValidations = void 0;
const zod_1 = require("zod");
const createAcademicDepartmentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            invalid_type_error: 'Academic Department must be string',
            required_error: 'Name is Required'
        }),
        academicFaculty: zod_1.z.string({
            invalid_type_error: 'Academic Faculty must be string',
            required_error: 'Faculty is Required'
        })
    })
});
const updateAcademicDepartmentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            invalid_type_error: 'Academic Department must be string',
            required_error: 'Name is Required'
        }).optional(),
        academicFaculty: zod_1.z.string({
            invalid_type_error: 'Academic Faculty must be string',
            required_error: 'Faculty is Required'
        }).optional()
    })
});
exports.AcademicDepartmentValidations = {
    createAcademicDepartmentValidationSchema,
    updateAcademicDepartmentValidationSchema
};
