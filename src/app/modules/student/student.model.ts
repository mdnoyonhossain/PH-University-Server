import { Schema, model } from "mongoose";
import validator from 'validator';
import { TGuardian, TLocalGuardian, TStudent, TStudentModel, TUserName } from "./student.interface";

const userNameSchema = new Schema<TUserName>({
    firstName: {
        type: String,
        required: [true, 'First Name is required'],
        maxlength: [20, "First Name can't be more than 20 chracter"],
        trim: true,
        validate: {
            validator: function (value: string) {
                const firstName = value.charAt(0).toUpperCase() + value.slice(1);
                return firstName === value;
            },
            message: '{VALUE} is not in Captlize fromate'
        }
    },
    middleName: { type: String, trim: true },
    lastName: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value: string) => validator.isAlpha(value),
            message: '{VALUE} is not valid'
        }
    },
});

const guardianSchema = new Schema<TGuardian>({
    fatherName: { type: String, required: true },
    fatherOccuption: { type: String, required: true },
    fatherContactNo: { type: String, required: true },
    motherName: { type: String, required: true },
    motherOccuption: { type: String, required: true },
    motherContactNo: { type: String, required: true },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
    name: { type: String, required: true },
    occuption: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true }
})

const studenSchema = new Schema<TStudent, TStudentModel>({
    id: {
        type: String,
        required: [true, 'ID is required'],
        unique: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'User id is required'],
        unique: true,
        ref: 'User',
    },
    name: { type: userNameSchema, required: true },
    gender: {
        type: String,
        enum: {
            values: ["Male", "Female", "Other"],
            message: "{VALUE} is not valid"
        },
        required: true
    },
    dateOfBirth: { type: Date },
    email: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) => validator.isEmail(value),
            message: '{VALUE} is not a valid email type'
        }
    },
    contactNo: { type: String, required: true },
    emergancyContactNo: { type: String, required: true },
    bloodGroup: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: { type: guardianSchema, required: true },
    localGuardian: { type: localGuardianSchema, required: true },
    admissionSemester: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicSemester',
    },
    profileImg: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    academicDepartment: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicDepartment',
    }
},
    {
        toJSON: {
            virtuals: true
        }
    }
);


// virtual
studenSchema.virtual('fullName').get(function () {
    return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

// Query Middleware/ Hook
studenSchema.pre('find', async function (next) {
    this.find({ isDeleted: { $ne: true } })
    next()
});

studenSchema.pre('findOne', async function (next) {
    this.findOne({ isDeleted: { $ne: true } });
    next();
});

studenSchema.pre('aggregate', async function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
    next();
})

// CREATE CUSTOM STATIC METHOD
studenSchema.statics.isExistsUser = async function (id: string) {
    const existingUser = await Student.findOne({ id });
    return existingUser;
}

export const Student = model<TStudent, TStudentModel>('Student', studenSchema);