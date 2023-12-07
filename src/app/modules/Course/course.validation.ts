import { z } from "zod";

const createpreRequisiteCoursesSchema = z.object({
    course: z.string(),
    isDeleted: z.boolean().optional()
})

const createCourseValidationSchema = z.object({
    body: z.object({
        title: z.string(),
        prefix: z.string(),
        code: z.number(),
        credits: z.number(),
        idDeleted: z.boolean().default(false).optional(),
        preRequisiteCourse: z.array(createpreRequisiteCoursesSchema).optional()
    })
});

const updatePreRequisiteCoursesSchema = z.object({
    course: z.string(),
    isDeleted: z.boolean().optional()
})

const updatePreateCourseValidationSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        prefix: z.string().optional(),
        code: z.number().optional(),
        credits: z.number().optional(),
        idDeleted: z.boolean().default(false).optional(),
        preRequisiteCourse: z.array(updatePreRequisiteCoursesSchema).optional()
    })
});

const facultyWithCourseValidationSchema = z.object({
    body: z.object({
        faculties: z.array(z.string())
    })
})

export const CourseValidations = {
    createCourseValidationSchema,
    updatePreateCourseValidationSchema,
    facultyWithCourseValidationSchema
}