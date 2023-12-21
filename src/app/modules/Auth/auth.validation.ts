import { z } from "zod";

const loginUserValidationSchema = z.object({
    body: z.object({
        id: z.string({ required_error: 'Id is Required!' }),
        password: z.string({ required_error: 'Password is Required!' })
    })
});

const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({ required_error: 'Old Password is Required!' }),
        newPassword: z.string({ required_error: 'New Password is Required!' })
    })
});

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({ required_error: 'Refresh Token is Required!' })
    })
});

const forgetPasswordValidationSchema = z.object({
    body: z.object({
        id: z.string({ required_error: 'User id is Required' })
    })
});

const resetPasswordValidationSchema = z.object({
    body: z.object({
        id: z.string({ required_error: 'User id is Required!' }),
        newPassword: z.string({ required_error: 'User Password is Required' })
    })
});

export const AuthValidation = {
    loginUserValidationSchema,
    changePasswordValidationSchema,
    refreshTokenValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema
}