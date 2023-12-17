import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistration } from "./semesterRegistration.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { RegistrationStatus } from "./semesterRegistration.constant";

const createSemesterRegistrationIntoDB = async (paylaod: TSemesterRegistration) => {
    // check if the semester is exist
    const isAcademicSemesterExists = await AcademicSemester.findById(paylaod?.academicSemester);
    if (!isAcademicSemesterExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'This Academic Semester Not Found !')
    }

    // check if ther any registered semester that is already 'UPCOMING'/'ONGOING'
    const isThereAnyUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
        $or: [{ status: RegistrationStatus.UPCOMING }, { status: RegistrationStatus.ONGOING }]
    });
    if (isThereAnyUpcomingOrOngoingSemester) {
        throw new AppError(httpStatus.BAD_REQUEST, `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} Register Semester !`);
    }

    // check if the semester is already registered!
    const isSemesterRegistrationExists = await SemesterRegistration.findOne({ academicSemester: paylaod?.academicSemester });
    if (isSemesterRegistrationExists) {
        throw new AppError(httpStatus.CONFLICT, 'This Semester is Already Exists !');
    }

    const result = await SemesterRegistration.create(paylaod);
    return result;
}

const getAllSemesterRegistrationFromDB = async (query: Record<string, unknown>) => {
    const semesterRegistrationQuery = new QueryBuilder(SemesterRegistration.find().populate('academicSemester'), query).filter().sort().paginate().fields();
    const result = await semesterRegistrationQuery.modelQuery;
    return result;
}

const getSingleSemesterRegistrationFromDB = async (id: string) => {
    const result = await SemesterRegistration.findById(id);
    return result;
}

const updateSemesterRegistrationIntoDB = async (id: string, paylaod: Partial<TSemesterRegistration>) => {
    // check if the semester is already registred!
    const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
    if (!isSemesterRegistrationExists) {
        throw new AppError(httpStatus.BAD_REQUEST, 'This Semester is not found !');
    }

    // if the requested semester registred is ended, we will not update anything
    const currentSemesterStatus = isSemesterRegistrationExists?.status;
    if (currentSemesterStatus === RegistrationStatus.ENDED) {
        throw new AppError(httpStatus.BAD_REQUEST, `This semester is already ${currentSemesterStatus}`)
    }

    // UPCOMING --> ONGOING --> ENDED
    if (currentSemesterStatus === RegistrationStatus.UPCOMING && paylaod?.status === RegistrationStatus.ENDED) {
        throw new AppError(httpStatus.BAD_REQUEST, `You can not directly change status from ${currentSemesterStatus} to ${paylaod?.status}`);
    }

    if (currentSemesterStatus === RegistrationStatus.ONGOING && paylaod?.status === RegistrationStatus.UPCOMING) {
        throw new AppError(httpStatus.BAD_REQUEST, `You can not directly change status from ${currentSemesterStatus} to ${paylaod?.status}`);
    }

    const result = await SemesterRegistration.findByIdAndUpdate(id, paylaod, { new: true, runValidators: true });
    return result;
}

export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationFromDB,
    getSingleSemesterRegistrationFromDB,
    updateSemesterRegistrationIntoDB
}