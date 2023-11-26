import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EditUSerDto {
	@IsEmail()
	@IsOptional()
	email?: string;

	@IsString()
	@IsOptional()
	firstName?: string;

	@IsString()
	@IsOptional()
	lastName?: string;
}