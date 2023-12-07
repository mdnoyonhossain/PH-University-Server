"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseFaculty = exports.Course = void 0;
const mongoose_1 = require("mongoose");
const preRequisiteCoursesSchema = new mongoose_1.Schema({
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course'
    },
    isDeleted: { type: Boolean, default: false }
});
const courseSchema = new mongoose_1.Schema({
    title: { type: String, unique: true, required: true, trim: true },
    prefix: { type: String, required: true, trim: true },
    code: { type: Number, required: true, trim: true },
    credits: { type: Number, required: true, trim: true },
    isDeleted: { type: Boolean, default: false },
    preRequisiteCourse: [preRequisiteCoursesSchema]
});
exports.Course = (0, mongoose_1.model)('Course', courseSchema);
// Course Faculty Schema
const courseFacultySchema = new mongoose_1.Schema({
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        unique: true,
        required: true,
    },
    faculties: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Faculty'
        }]
});
exports.CourseFaculty = (0, mongoose_1.model)('CourseFaculty', courseFacultySchema);
