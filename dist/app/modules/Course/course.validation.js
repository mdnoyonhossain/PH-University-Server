"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseValidations = void 0;
const zod_1 = require("zod");
const createpreRequisiteCoursesSchema = zod_1.z.object({
    course: zod_1.z.string(),
    isDeleted: zod_1.z.boolean().optional()
});
const createCourseValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string(),
        prefix: zod_1.z.string(),
        code: zod_1.z.number(),
        credits: zod_1.z.number(),
        idDeleted: zod_1.z.boolean().default(false).optional(),
        preRequisiteCourse: zod_1.z.array(createpreRequisiteCoursesSchema).optional()
    })
});
const updatePreRequisiteCoursesSchema = zod_1.z.object({
    course: zod_1.z.string(),
    isDeleted: zod_1.z.boolean().optional()
});
const updatePreateCourseValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        prefix: zod_1.z.string().optional(),
        code: zod_1.z.number().optional(),
        credits: zod_1.z.number().optional(),
        idDeleted: zod_1.z.boolean().default(false).optional(),
        preRequisiteCourse: zod_1.z.array(updatePreRequisiteCoursesSchema).optional()
    })
});
const facultyWithCourseValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        faculties: zod_1.z.array(zod_1.z.string())
    })
});
exports.CourseValidations = {
    createCourseValidationSchema,
    updatePreateCourseValidationSchema,
    facultyWithCourseValidationSchema
};
