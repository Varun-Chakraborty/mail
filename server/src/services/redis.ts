import { Redis } from 'ioredis';

let redisClient: Redis | null = null;

async function ping(instance: Redis) {
	return await instance.ping();
}

export function getRedisClient() {
	if (!redisClient) {
		redisClient = new Redis({
			host: process.env.REDIS_HOST,
			port: 6379,
		});

		redisClient.on('error', (err) => {
			console.log('Redis Client Error', err);
		});

		ping(redisClient).then(() => {
			console.log('Connected to Redis');
		});
	}
	return redisClient;
}

export class RedisService {
	private redis: Redis;

	constructor() {
		this.redis = getRedisClient();
	}

	public async setResetToken(email: string, token: string) {
		await this.redis.set(`resetToken:${email}`, token);
		await this.redis.expire(`resetToken:${email}`, 60 * 15);
		if (await this.redis.exists(`reset:${email}`)) {
			await this.redis.incr(`reset:${email}`);
		} else {
			await this.redis.set(`reset:${email}`, 1);
			await this.redis.expire(`reset:${email}`, 60 * 15);
		}
		await this.redis.set(`resetRetry:${email}`, 0);
		await this.redis.expire(`resetRetry:${email}`, 60 * 15);
		return;
	}

	public async setVerficationToken(email: string, token: string) {
		await this.redis.set(`verificationToken:${email}`, token);
		await this.redis.expire(`verificationToken:${email}`, 60 * 15);
		if (await this.redis.exists(`verification:${email}`)) {
			await this.redis.incr(`verification:${email}`);
		} else {
			await this.redis.set(`verification:${email}`, 1);
			await this.redis.expire(`verification:${email}`, 60 * 15);
		}
		return;
	}

	public async getResetToken(email: string) {
		if (await this.redis.exists(`resetToken:${email}`)) {
			this.redis.incr(`resetRetry:${email}`);
		}
		return await this.redis.get(`resetToken:${email}`);
	}

	public async getVerificationToken(email: string) {
		return await this.redis.get(`verificationToken:${email}`);
	}

	public async getResetRequestCount(key: string) {
		const count = await this.redis.get(`reset:${key}`);
		return count ? parseInt(count) : 0;
	}

	public async getResetRetriesCount(key: string) {
		const count = await this.redis.get(`resetRetry:${key}`);
		return count ? parseInt(count) : 0;
	}

	public async getVerificationRequestCount(key: string) {
		const count = await this.redis.get(`verification:${key}`);
		return count ? parseInt(count) : 0;
	}

	public async deleteResetToken(email: string) {
		await this.redis.del(`resetToken:${email}`);
	}

	public async deleteResetRetriesCount(email: string) {
		await this.redis.del(`resetRetry:${email}`);
	}

	public async deleteVerificationToken(email: string) {
		await this.redis.del(`verificationToken:${email}`);
	}

	/**
	 *
	 * @param token
	 * @param duration In seconds
	 */
	public async setDumpedToken(token: string, duration: number) {
		await this.redis.set(`dumpedToken:${token}`, token);
		await this.redis.expire(`dumpedToken:${token}`, duration);
	}

	public async isTheTokenDumped(token: string) {
		return await this.redis.exists(`dumpedToken:${token}`);
	}
}
