import mongoose from "mongoose";
import { Student } from "./student.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { TStudent } from "./student.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { studentSearchableField } from "./student.constant";


const getAllStudentFromDB = async (query: Record<string, unknown>) => {
    // const queryObj = { ...query };

    // const studentSearchAbleField = ['email', 'presentAddress', 'name.firstName'];
    // let searchTerm = '';

    // if (query?.searchTerm) {
    //     searchTerm = query?.searchTerm as string;
    // }

    // const searchQuery = Student.find({
    //     $or: studentSearchAbleField.map(field => ({
    //         [field]: { $regex: searchTerm, $options: 'i' }
    //     }))
    // });

    // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    // excludeFields.forEach(el => delete queryObj[el]); // query filter

    // const filterQuery = searchQuery.find(queryObj)
    //     .populate('admissionSemester').populate({
    //         path: 'academicDepartment',
    //         populate: 'academicFaculty'
    //     });

    // let sort = '-createdAt';
    // if (query?.sort) {
    //     sort = query?.sort as string;
    // }

    // const sortQuery = filterQuery.sort(sort);

    // let page = 1;
    // let limit = 1;
    // let skip = 0;

    // if (query?.limit) {
    //     limit = Number(query?.limit);
    // }

    // if (query.page) {
    //     page = Number(query?.page);
    //     skip = (page - 1) * limit
    // }

    // const paginateQuery = sortQuery.skip(skip);

    // const limitQuery = paginateQuery.limit(limit);

    // // fields limiting
    // let fields = '-__v';
    // if(query.fields){
    //     fields = (query.fields as string).split(',').join(' ');
    // }

    // const fieldQuery = await limitQuery.select(fields);

    // return fieldQuery;

    const studentQuery = new QueryBuilder(Student.find().populate('admissionSemester').populate({
        path: 'academicDepartment',
        populate: 'academicFaculty'
    }), query).search(studentSearchableField).filter().sort().paginate().fields();

    const result = await studentQuery.modelQuery;
    return result;
}

const getSingleStudentFromDB = async (id: string) => {
    const result = await Student.findById(id).populate('admissionSemester').populate({
        path: 'academicDepartment',
        populate: 'academicFaculty'
    });

    return result;
}

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
    const { name, guardian, localGuardian, ...remainingStudentData } = payload;

    const modifiedUpdateData: Record<string, unknown> = {
        ...remainingStudentData
    };

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdateData[`name.${key}`] = value;
        }
    }

    if (guardian && Object.keys(guardian).length) {
        for (const [key, value] of Object.entries(guardian)) {
            modifiedUpdateData[`guardian.${key}`] = value;
        }
    }

    if (localGuardian && Object.keys(localGuardian).length) {
        for (const [key, value] of Object.entries(localGuardian)) {
            modifiedUpdateData[`localGuardian.${key}`] = value;
        }
    }

    const result = await Student.findByIdAndUpdate(id, modifiedUpdateData, { new: true, runValidators: true });
    return result;
}

const deleteStudentFromDB = async (id: string) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // delete sutdent
        const deletedStudent = await Student.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });
        if (!deletedStudent) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
        }

        // get user _id from deletedStudent
        const userId = deletedStudent.user;

        // delete user
        const deletedUser = await User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true, session });
        if (!deletedUser) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
        }

        await session.commitTransaction();
        await session.endSession()

        return deletedStudent;
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error('Faield to delete Student')
    }
}

export const StudentServices = {
    getAllStudentFromDB,
    getSingleStudentFromDB,
    updateStudentIntoDB,
    deleteStudentFromDB
}