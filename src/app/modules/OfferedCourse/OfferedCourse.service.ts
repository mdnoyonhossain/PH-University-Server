import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { TOfferedCourse } from "./OfferedCourse.interface";
import { OfferedCourse } from "./OfferedCourse.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Course } from "../Course/course.model";
import { Faculty } from "../Faculty/faculty.model";
import { hasTimeConflict } from "./OfferedCourse.utils";

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const { semesterRegistration, academicFaculty, academicDepartment, course, faculty, section, days, startTime, endTime } = payload;

    // check if the semester registred id is exists!
    const isSemesterRegistrationExists = await SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistrationExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration Not Found !');
    }

    // academic Semester
    const academicSemester = isSemesterRegistrationExists.academicSemester;

    // check if the academic Faculty id is exists!
    const isAcademicFacultyExists = await AcademicFaculty.findById(academicFaculty);
    if (!isAcademicFacultyExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty Not Found !');
    }

    // check if the academic Department id is exists!
    const isAcademicDepartmentExists = await AcademicDepartment.findById(academicDepartment);
    if (!isAcademicDepartmentExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Academic Department Not Found !');
    }

    // check if the Course id is exists!
    const isCourseExists = await Course.findById(course);
    if (!isCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Academic Department Not Found !');
    }

    // check if the faculty id is exists!
    const isFacultyExists = await Faculty.findById(faculty);
    if (!isFacultyExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty Not Found !');
    }

    // check if the department is belont to the faculty
    const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({ academicFaculty, _id: academicDepartment });
    if (!isDepartmentBelongToFaculty) {
        throw new AppError(httpStatus.BAD_REQUEST, `This ${isAcademicDepartmentExists.name} is not belong to this ${isAcademicFacultyExists.name}`)
    }

    const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection = await OfferedCourse.findOne({ semesterRegistration, course, section });
    if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
        throw new AppError(httpStatus.BAD_REQUEST, `Offered course with same section is already exists !`)
    }

    // get the schedules of the facultyies
    const assignedSchedules = await OfferedCourse.find({ semesterRegistration, faculty, days: { $in: days } }).select('days startTime endTime');

    const newSchedule = {
        days,
        startTime,
        endTime
    }

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(httpStatus.CONFLICT, `This Faculty is not available at that time! Choose other time or day`);
    }

    const result = await OfferedCourse.create({ ...payload, academicSemester });
    return result;
}

const updateOfferedCourseIntoDB = async (id: string, payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>) => {
    const { faculty, days, startTime, endTime } = payload;

    // check Offered Course
    const isOfferedCourseExists = await OfferedCourse.findById(id);
    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered Course Not Found!');
    }

    // check faculty
    const isFacultyExists = await Faculty.findById(faculty);
    if (!isFacultyExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty Not Found!');
    }

    const semesterRegistration = isOfferedCourseExists.semesterRegistration;

    // check semester status 'UPCOMING'
    const semesterRegistrationStatus = await SemesterRegistration.findById(semesterRegistration);
    if(semesterRegistrationStatus?.status !== 'UPCOMING'){
        throw new AppError(httpStatus.BAD_REQUEST, `You can not update this Offered Course as it is ${semesterRegistrationStatus?.status}`)
    }

    // get the schedules of the facultyies
    const assignedSchedules = await OfferedCourse.find({ semesterRegistration, faculty, days: { $in: days } }).select('days startTime endTime');

    const newSchedule = {
        days,
        startTime,
        endTime
    }

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(httpStatus.CONFLICT, `This Faculty is not available at that time! Choose other time or day`);
    }

    const result = await OfferedCourse.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    return result;
}

export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    updateOfferedCourseIntoDB
}