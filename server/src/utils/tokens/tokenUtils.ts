import jwt, { type SignOptions } from 'jsonwebtoken';

export function generateToken(data: any, secret: string, expiresIn: string) {
	const options: SignOptions = { expiresIn: expiresIn as `${number}D` };
	return jwt.sign(data, secret, options);
}

export function verifyToken(token: string, secret: string) {
	try {
		return jwt.verify(token, secret);
	} catch (error) {
		return null;
	}
}
