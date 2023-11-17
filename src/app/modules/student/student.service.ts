import { Student } from "./student.interface";
import { StudentModal } from "./student.model";

const createStudentIntoDB = async (student: Student) => {
    const result = await StudentModal.create(student);
    return result;
}

export const StudentServices = {
    createStudentIntoDB
}