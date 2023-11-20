import { z } from 'zod';

const userNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).refine((value) => value[0] === value[0].toUpperCase(), {
    message: 'First name must start with an uppercase letter',
  }),
  middleName: z.string().optional(),
  lastName: z.string().regex(/^[a-zA-Z]+$/, { message: 'Last name must only contain letters' }),
});

const guardianValidationSchema = z.object({
  fatherName: z.string(),
  fatherOccuption: z.string(),
  fatherContactNo: z.string(),
  motherName: z.string(),
  motherOccuption: z.string(),
  motherContactNo: z.string(),
});

const localGuardianValidationSchema = z.object({
  name: z.string(),
  occuption: z.string(),
  contactNo: z.string(),
  address: z.string(),
});

export const studentValidatoinSchema = z.object({
  id: z.string(),
  password: z.string().max(20),
  name: userNameValidationSchema,
  gender: z.enum(['Male', 'Female', 'Other']),
  email: z.string().email(),
  contactNo: z.string(),
  emergancyContactNo: z.string(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  presentAddress: z.string(),
  permanentAddress: z.string(),
  guardian: guardianValidationSchema,
  localGuardian: localGuardianValidationSchema,
  profileImg: z.string(),
  isActive: z.enum(['Active', 'Blocked']).default('Active'),
});

export default studentValidatoinSchema;