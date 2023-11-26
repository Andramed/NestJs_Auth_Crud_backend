import { Injectable } from '@nestjs/common';
import { User, Bookmark, Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService
	){}

	async signin(dto: AuthDto){
		console.log(dto);
		// search user by email
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})
		// if user does not exist throw exception
		if (!user) {
			throw new ForbiddenException('Email incorect')
		}
		//compare password
		const pswMatches = await argon.verify(user.hash, dto.password)
		//if password incorrect throw exception
		if (!pswMatches) {
			throw new ForbiddenException('Password incorect')
		}
		// if email ok, and password ok return user
		return this.signToken(user.id, user.email);
	}

	async signup(dto: AuthDto){
		console.log(dto);
		// we need to generate hash for password:
		const hash = await argon.hash(dto.password);
		// save the new user in db
		try {
			const user = await this.prisma.user.create({
				data: {
					email: dto.email,
					hash
				}
			})
			delete user.hash
			//retrun the saved user
			return this.signToken(user.id, user.email);
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException('Credentials taken');
					
				}
			}
			throw error;
		}
	}

	async signToken(userId: number, email: string): Promise<object> {
		const payload = {
			sub: userId, 
			email, 
		}
		const token = await this.jwt.signAsync(payload, {
			expiresIn: '15m', 
			secret: this.config.get('JWT_SECRET')
		})
		return {
			acces_token: token
		}
	}
}