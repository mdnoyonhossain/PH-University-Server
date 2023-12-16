import { z } from "zod";
import { Days } from "./OfferedCourse.constant";

const timeStringValidationSchema = z.string().refine((time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
    return regex.test(time);
}, { message: 'Invalid Time format, expected "HH:MM" in 24 hours format' });

const createOfferedCourseValidationSchema = z.object({
    body: z.object({
        semesterRegistration: z.string(),
        academicFaculty: z.string(),
        academicDepartment: z.string(),
        course: z.string(),
        faculty: z.string(),
        maxCapacity: z.number(),
        section: z.number(),
        days: z.array(z.enum([...Days] as [string, ...string[]])),
        startTime: timeStringValidationSchema,
        endTime: timeStringValidationSchema,
    }).refine((body) => {
        // start time: 10:30 => 1970-01-01T10:30
        // end time: 12:30 => 1970-01-01T12:30

        const start = new Date(`1970-01-01T${body.startTime}:00`);
        const end = new Date(`1970-01-01T${body.endTime}:00`);

        return end > start;
    }, { message: 'Start time should be before End time !' })
});


const updateOfferedCourseValidationSchema = z.object({
    body: z.object({
        faculty: z.string(),
        maxCapacity: z.number(),
        days: z.array(z.enum([...Days] as [string, ...string[]])),
        startTime: timeStringValidationSchema,
        endTime: timeStringValidationSchema,
    })
});

export const OfferedCourseValidations = {
    createOfferedCourseValidationSchema,
    updateOfferedCourseValidationSchema
}