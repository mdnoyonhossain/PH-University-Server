/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model"
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateAdminId, generateFacultyId, generateStudentId } from "./user.utils";
import mongoose from "mongoose";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Faculty } from "../Faculty/faculty.model";
import { TFaculty } from "../Faculty/faculty.interface";
import { Admin } from "../Admin/admin.model";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";

const createStudentIntoDB = async (file: any, password: string, payload: TStudent) => {
    // create a user object
    const userData: Partial<TUser> = {};

    //if password is not given , use deafult password
    userData.password = password || (config.default_password as string);

    //set student role
    userData.role = 'student';
    // set studnet email
    userData.email = payload.email;

    // find academic semester info
    const admissionSemester = await AcademicSemester.findById(payload.admissionSemester);

    if (!admissionSemester) {
        throw new AppError(httpStatus.NOT_FOUND, 'Admission semester not found.');
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        //set manually generated it
        userData.id = await generateStudentId(admissionSemester);

        // send image to cloudinary
        const path = file?.path;
        const imageName = `${userData?.id}${payload?.name?.firstName}`;
        // send 
        const { secure_url } = await sendImageToCloudinary(path, imageName) as { secure_url: string };

        // create a user (transaction-1)
        const newUser = await User.create([userData], { session }); // array

        //create a student
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
        }

        // set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; //reference _id
        payload.profileImg = secure_url;

        const newStudent = await Student.create([payload], { session }); // (transaction-2)
        if (!newStudent) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
        }

        await session.commitTransaction();
        await session.endSession();

        return newStudent;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err)
    }
}

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
    // create a user object
    const userData: Partial<TUser> = {};

    //if password is not given , use deafult password
    userData.password = password || (config.default_password as string);

    //set student role
    userData.role = 'faculty';
    // set faculty email
    userData.email = payload.email;

    // find academic department info
    const academicDepartment = await AcademicDepartment.findById(
        payload.academicDepartment,
    );

    if (!academicDepartment) {
        throw new AppError(400, 'Academic department not found');
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        //set  generated id
        userData.id = await generateFacultyId();

        // create a user (transaction-1)
        const newUser = await User.create([userData], { session }); // array

        //create a faculty
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
        }
        // set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; //reference _id

        // create a faculty (transaction-2)

        const newFaculty = await Faculty.create([payload], { session });

        if (!newFaculty.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
        }

        await session.commitTransaction();
        await session.endSession();

        return newFaculty;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

const createAdminIntoDB = async (password: string, payload: TFaculty) => {
    // create a user object
    const userData: Partial<TUser> = {};

    //if password is not given , use deafult password
    userData.password = password || (config.default_password as string);

    //set student role
    userData.role = 'admin';
    // set admin email
    userData.email = payload.email;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        //set  generated id
        userData.id = await generateAdminId();

        // create a user (transaction-1)
        const newUser = await User.create([userData], { session });

        //create a admin
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
        }
        // set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; //reference _id

        // create a admin (transaction-2)
        const newAdmin = await Admin.create([payload], { session });

        if (!newAdmin.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
        }

        await session.commitTransaction();
        await session.endSession();

        return newAdmin;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

const getMe = async (userId: string, role: string) => {
    let result = null;

    if (role === 'admin') {
        result = await Admin.findOne({ id: userId }).populate('user');
    }
    if (role === 'student') {
        result = await Student.findOne({ id: userId }).populate('user');
    }
    if (role === 'faculty') {
        result = await Faculty.findOne({ id: userId }).populate('user');
    }

    return result;
}

const changeStatus = async (id: string, payload: { status: string }) => {
    const result = await User.findByIdAndUpdate(id, payload, { new: true });
    return result;
}

export const UserService = {
    createStudentIntoDB,
    createFacultyIntoDB,
    createAdminIntoDB,
    getMe,
    changeStatus
}