import { TStudent } from "./student.interface";
import { Student } from "./student.model";

const createStudentIntoDB = async (studentData: TStudent) => {
    const result = await Student.create(studentData);

    /*****  CUSTOM INSTANCE METHOD
    // const student = new Student(studentData);    
    // if(await student.isExistsUser(studentData.id)){
    //     throw new Error('User Already exists!')        
    // }
    // const result = await student.save(); // build in instace method
    *****/

    return result;
}

const getAllStudentFromDB = async () => {
    const result = await Student.find();
    return result;
}

const getSingleStudentFromDB = async (id: string) => {
    // const result = await Student.findOne({ id: id });
    const result = await Student.aggregate([
        { $match: { id: id } }
    ])
    return result;
}

const deleteStudentFromDB = async (id: string) => {
    const result = await Student.updateOne({ id: id }, { isDeleted: true });
    return result;
}

export const StudentServices = {
    createStudentIntoDB,
    getAllStudentFromDB,
    getSingleStudentFromDB,
    deleteStudentFromDB
}