import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { User } from '@prisma/client';


@UseGuards(JwtGuard)
@Controller('bookmark')


export class BookmarkController {
	constructor(private bookmarkService: BookmarkService) {}
	
	@Post()
	createBookmark(
		@GetUser() user: User,
		@Body() dto: CreateBookmarkDto
	){
		console.log(user, 'log from the controller');
		
		return this.bookmarkService.createBookmark(
			user.id, dto
		)	
	}
	
	
	@Get()
	getAllBokmark(
		@GetUser() user: User,
	){
		console.log(user.id, 'from controller');
		
		return this.bookmarkService.getAllBokmark(user.id)
	}

	@Get(':id')
	getBookkmarkById(
		@GetUser() user: User,
		@Param('id', ParseIntPipe) bokmarkId: number,

	){
		return this.bookmarkService.deleteBookmarkById(
			user.id, bokmarkId
		)
	}

	@Patch(':id')
	editBookmarkById(
		@GetUser() user: User,
		@Body() editDto: EditBookmarkDto,
		@Param('id', ParseIntPipe) bookmarkId: number

	){
		return this.bookmarkService.editBookmarkById(
			user.id, editDto, bookmarkId
		)
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	deleteBookmarkById(
		@GetUser() user: User,
		@Param('id', ParseIntPipe) bokmarkId: number,
	){
		return this.bookmarkService.deleteBookmarkById(
			user.id, bokmarkId
		)
	}

	
}
