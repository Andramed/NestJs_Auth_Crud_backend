import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUSerDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
	constructor (
		private prisma: PrismaService,
	) {}
	
	async editUser(userId:number, dto: EditUSerDto) { 
		const user = await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				...dto
			}
		})
		console.log(userId, 'user id');
		console.log(dto);
		
		
		delete user.hash
		return user
		
	}

}
