import jwt from 'jsonwebtoken';

export const createToken = (jwtPayload: { userId: string, role: string }, secrete: string, expiresIn: string) => {
    return jwt.sign(jwtPayload, secrete, { expiresIn });
}