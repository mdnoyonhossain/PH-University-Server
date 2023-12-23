import { Types } from "mongoose"

export type TCoursemarks = {
    classTest1: number;
    midTerm: number;
    classTest2: number;
    finalTerm: number;
}

export type TGrade = 'A' | 'B' | 'C' | 'D' | 'F' | 'NA';

export type TEnrolledCourse = {
    semesterRegistration: Types.ObjectId;
    academicSemester: Types.ObjectId;
    academicFaculty: Types.ObjectId;
    academicDepartment: Types.ObjectId;
    offeredCourse: Types.ObjectId;
    course: Types.ObjectId;
    student: Types.ObjectId;
    faculty: Types.ObjectId;
    isEnrolled: boolean;
    courseMarks: TCoursemarks;
    grade: TGrade;
    gradePoints: number;
    isCompleted: boolean;
}