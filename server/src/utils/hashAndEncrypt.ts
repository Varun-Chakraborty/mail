import bcrypt from 'bcrypt';
import crypto, { randomBytes } from 'crypto';

const sha256 = (data: string) => crypto.createHash('sha256').update(data).digest('hex');

export async function hashPassword(password: string) {
	return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string) {
	return await bcrypt.compare(password, hashedPassword);
}

export function hashToken(token: string) {
	return sha256(token);
}

export function verifyToken(token: string, hashedToken: string) {
	return sha256(token) === hashedToken;
}

function getKey(key: string) {
	return crypto.createHash('sha256').update(key).digest();
}

export function encryptToken(token: string) {
	const iv = randomBytes(16);
	const cipher = crypto.createCipheriv('aes-256-cbc', getKey(process.env.ENCRYPTION_SECRET!), iv);
	const encrypted = Buffer.concat([cipher.update(token), cipher.final()]);
	return { iv: iv.toString('hex'), encrypted: encrypted.toString('hex') };
}

export function decryptToken(token: { iv: string; encrypted: string }) {
	const iv = Buffer.from(token.iv, 'hex');
	const encrypted = Buffer.from(token.encrypted, 'hex');
	const decipher = crypto.createDecipheriv(
		'aes-256-cbc',
		getKey(process.env.ENCRYPTION_SECRET!),
		iv,
	);
	const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
	return decrypted.toString();
}
