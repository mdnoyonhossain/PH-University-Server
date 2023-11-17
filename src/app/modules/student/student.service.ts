import { Student } from "./student.interface";
import { StudentModal } from "./student.model";

const createStudentIntoDB = async (student: Student) => {
    const result = await StudentModal.create(student);
    return result;
}

const getAllStudentFromDB = async () => {
    const result = await StudentModal.find();
    return result;
}

const getSingleStudentFromDB = async (id: string) => {
    const result = await StudentModal.findOne({id: id});
    return result;
}

export const StudentServices = {
    createStudentIntoDB,
    getAllStudentFromDB,
    getSingleStudentFromDB
}