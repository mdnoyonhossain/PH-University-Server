import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (jwtPayload: { userId: string, role: string }, secrete: string, expiresIn: string) => {
    return jwt.sign(jwtPayload, secrete, { expiresIn });
}

export const verifyToken = (token: string, secrete: string) => {
    return jwt.verify(token, secrete) as JwtPayload;
}