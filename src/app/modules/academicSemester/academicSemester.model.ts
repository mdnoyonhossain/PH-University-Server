import { Schema, model } from "mongoose";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemesterCode, AcademicSemesterName, Months } from "./academicSemester.constant";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const academicSemesterSchema = new Schema<TAcademicSemester>({
    name: { type: String, enum: AcademicSemesterName, required: true },
    code: { type: String, enum: AcademicSemesterCode, required: true },
    year: { type: String, required: true },
    startMonth: { type: String, enum: Months, required: true },
    endMonth: { type: String, enum: Months, required: true }
},
    {
        timestamps: true
    }
);

academicSemesterSchema.pre('save', async function (next) {
    const isSemesterExists = await AcademicSemester.findOne({
        name: this.name,
        year: this.year
    });

    if (isSemesterExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Semester is Already Exists');
    }

    next();
});

academicSemesterSchema.pre('findOneAndUpdate', async function (next) {
    const query = this.getQuery();
    const isSemesterExists = await AcademicSemester.findOne(query);

    if (!isSemesterExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'This Semester dose not Exists!');
    }

    next()
})

export const AcademicSemester = model<TAcademicSemester>('AcademicSemester', academicSemesterSchema)