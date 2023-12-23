import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constant";
import { TCourse, TCourseFaculty } from "./course.interface";
import { Course, CourseFaculty } from "./course.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createCourseIntoDB = async (payload: TCourse) => {
    const result = await Course.create(payload);
    return result;
}

const getAllCourseFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(Course.find().populate('preRequisiteCourse.course'), query).search(CourseSearchableFields).filter().sort().paginate().fields()

    const meta = await courseQuery.countTotal();
    const result = await courseQuery.modelQuery;

    return {
        meta,
        result
    }
}

const getSingleCourseFromDB = async (id: string) => {
    const result = await Course.findById(id).populate('preRequisiteCourse.course');
    return result;
}

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourse, ...courseRemainingData } = payload;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // steep:1 Basic Course Info Update
        const updateBasicCourseInfo = await Course.findByIdAndUpdate(id, courseRemainingData, { new: true, runValidators: true, session });

        if (!updateBasicCourseInfo) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Faild to update course');
        }

        // check if there is any pre requisite course to update
        if (preRequisiteCourse && preRequisiteCourse.length > 0) {
            const deletePreRequisite = preRequisiteCourse.filter(element => element.course && element.isDeleted);
            const deletePullPreRequisiteId = deletePreRequisite.map(element => element.course);

            const deletePreRequisiteCourses = await Course.findByIdAndUpdate(
                id,
                {
                    $pull: { preRequisiteCourse: { course: { $in: deletePullPreRequisiteId } } }
                },
                { new: true, runValidators: true, session }
            );

            if (!deletePreRequisiteCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Faild to update Course')
            }

            // filter out the new course fields
            const newPreRequisite = preRequisiteCourse?.filter(elm => elm.course && !elm.isDeleted);

            const newPreRequisiteCourse = await Course.findByIdAndUpdate(
                id,
                {
                    $addToSet: { preRequisiteCourse: { $each: newPreRequisite } }
                },
                { new: true, runValidators: true, session }
            );

            if (!newPreRequisiteCourse) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Faild to update Course')
            }

            const result = await Course.findById(id).populate('preRequisiteCourse.course');
            return result;
        }

        await session.commitTransaction();
        await session.endSession();

    } catch (err) {
        await session.abortTransaction();
        await session.endSession()
        throw new AppError(httpStatus.BAD_REQUEST, 'Faild to update course');
    }
}

const assignFacultyWithCourseIntoDB = async (id: string, payload: Partial<TCourseFaculty>) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            course: id,
            $addToSet: { faculties: { $each: payload } }
        },
        {
            upsert: true,
            new: true,
            runValidators: true
        }
    );

    return result
}

const removeFacultyWithCourseFromDB = async (id: string, payload: Partial<TCourseFaculty>) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            $pull: { faculties: { $in: payload } }
        },
        { new: true }
    );

    return result;
}

const deleteCourseIntoDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
    return result;
}

export const CourseServices = {
    createCourseIntoDB,
    getAllCourseFromDB,
    getSingleCourseFromDB,
    updateCourseIntoDB,
    assignFacultyWithCourseIntoDB,
    removeFacultyWithCourseFromDB,
    deleteCourseIntoDB
}