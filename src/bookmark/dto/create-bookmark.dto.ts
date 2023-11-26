import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookmarkDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsOptional()
	decription? : string;
	
	@IsString()
	@IsNotEmpty()
	link: string;
}