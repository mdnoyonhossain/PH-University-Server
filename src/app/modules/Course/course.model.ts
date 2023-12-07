import { Schema, model } from "mongoose";
import { TCourse, TCourseFaculty, TpreRequisiteCourses } from "./course.interface";

const preRequisiteCoursesSchema = new Schema<TpreRequisiteCourses>({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course'
    },
    isDeleted: { type: Boolean, default: false }
});

const courseSchema = new Schema<TCourse>({
    title: { type: String, unique: true, required: true, trim: true },
    prefix: { type: String, required: true, trim: true },
    code: { type: Number, required: true, trim: true },
    credits: { type: Number, required: true, trim: true },
    isDeleted: { type: Boolean, default: false },
    preRequisiteCourse: [preRequisiteCoursesSchema]
});

export const Course = model<TCourse>('Course', courseSchema);

// Course Faculty Schema
const courseFacultySchema = new Schema<TCourseFaculty>({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        unique: true,
        required: true,
    },
    faculties: [{
        type: Schema.Types.ObjectId,
        ref: 'Faculty'
    }]
});

export const CourseFaculty = model<TCourseFaculty>('CourseFaculty', courseFacultySchema);
