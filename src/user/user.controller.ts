import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import {Request} from 'express'
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUSerDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {

	constructor(private userService: UserService){}

	@UseGuards(JwtGuard)
	@Get('me')
	getMe(@GetUser() user: User){
		console.log(user);
		
		return user;
	}

	@UseGuards(JwtGuard)
	@Patch()
	getMeUSer(
		@GetUser() user: User,
		@Body() editDto: EditUSerDto
		
	){
		console.log(user.id, 'idul userului');
		console.log('message from cotroler patch');
		
		
		return this.userService.editUser(user.id, editDto)
	}
}

