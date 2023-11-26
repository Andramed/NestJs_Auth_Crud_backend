import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {

	constructor(private prisma: PrismaService){}

	async createBookmark(
		userId: number,
		bookmarkDto: CreateBookmarkDto
	){
		const bookmark = await this.prisma.bookmark.create(
			{
				data: {
					userId: userId,
					...bookmarkDto
				}
			}
		)	
		return bookmark
	}
	
	getAllBokmark(userId: number){
		console.log(userId, 'user Id from the service');
		return this.prisma.bookmark.findMany({
			where: {
				userId,
			}
		});
	}

	async getBookkmarkById(
		userId: number, 
		bookmarkId: number
		){
			const foundedBookmark = await this.prisma.bookmark.findFirst({
				where: {
					id: bookmarkId,
					userId
				}
			})
			return foundedBookmark
	}

	async editBookmarkById(
		userId: number, 
		editDto: EditBookmarkDto, 
		bookmarkId: number
	){
		const bookmark = await this.prisma.bookmark.findUnique({
			where: {
				id: bookmarkId,
			}
		})
		if (!bookmark || bookmark.userId !== userId) {
			throw new ForbiddenException('acces to ressurce dennied')	
		}

		const editedBookamrk = await this.prisma.bookmark.update({
			where: {
				id: bookmarkId
			},
			data: {
				...editDto
			}
		})
		return editedBookamrk;
	}

	async deleteBookmarkById(
		userId: number,
		bookmarkId: number
	){

		console.log({
			userIdFromDelete: userId,
			bokmarkIdFromDelete: bookmarkId
		});
		

		const bookmark = await this.prisma.bookmark.findUnique({
			where: {
				id: bookmarkId
			}
		})
		if (!bookmark || bookmark.userId !== userId) {
			throw new ForbiddenException('acces denied to delete this bookmark')
		}
		console.log(bookmark);
		
		const deletedBookmark = await this.prisma.bookmark.delete({
			where: {
				id: bookmarkId
			}
		});

		return deletedBookmark.title
	}
}
