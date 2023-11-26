import * as pactum from 'pactum';
import {Test} from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { EditUSerDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';
import { inspect } from 'util';

describe("App e2e", () => {
	let app : INestApplication;
	let prisma: PrismaService
	beforeAll( async () => {
		const moduleRef = await Test.createTestingModule(
			{
				imports: [AppModule],
			}
		).compile();
		app = moduleRef.createNestApplication();
		app.useGlobalPipes(new ValidationPipe({
			whitelist: true
		  }));
		await app.init();
		await app.listen(3333);

		prisma = app.get(PrismaService);
		await prisma.cleanDb();
		pactum.request.setBaseUrl('http://localhost:3333');
		
	});

	afterAll(() => {
		app.close();
		
	})
	
	describe('Auth', () => {
		const dto: AuthDto = {
			email: 'test1@email.com',
			password: 'password1'
		}
		describe('Signup', () => {

			//excpetions
			it('email incorect forma', () => {
				return pactum.spec().post('/auth/signup')
				.withBody(dto.password)
				.expectStatus(400)
			})
			it('throw error with password empty', () => {
				return pactum.spec().post('/auth/signup')
				.withBody(dto.email)
				.expectStatus(400)
			});
			it('throw error no body provided', () => {
				return pactum.spec().post('/auth/signup')
				.expectStatus(400)
			})
			it('sign up', ()=> {
				return pactum.spec().post('/auth/signup')
				.withBody(dto)
				.expectStatus(201);
			});
		})
		describe('Signin', () => {
			let accesToken: string
			//excpetions
			it('throw error with email empty', () => {
				return pactum.spec().post('/auth/signin')
				.withBody(dto.password)
				.expectStatus(400)
			})
			it('throw error with password empty', () => {
				return pactum.spec().post('/auth/signin')
				.withBody(dto.email)
				.expectStatus(400)
			});
			it('throw error no body provided', () => {
				return pactum.spec().post('/auth/signin')
				.expectStatus(400)
			})
			it('sign in', () => {
				return pactum.spec().post('/auth/signin')
				.withBody(dto)
				.expectStatus(200)
				.stores('token', 'acces_token')
			})

		})

	})
	
	describe('User', () => {
		describe('Give user current', () => {
			it('Shoul be obtained curent user', () => {
				return pactum.spec()
					.get('/users/me')
					.withHeaders({
						'Authorization': `Bearer $S{token}`,
						'Accept': 'application/json'
					})
					.expectStatus(200);
			});
		});
	
		describe('Edit user', () => {
			it('should edit user', () => {
			  const dto: EditUSerDto = {
				firstName: 'testUser',
				email: 'testUser@mail.com',
			  };
			  return pactum.spec()
					.patch('/users')
					.withHeaders({
						'Authorization': `Bearer $S{token}`,
						'Accept': 'application/json'
					})
					.withBody(dto)
					.expectStatus(200)
					.expectBodyContains(dto.firstName)
					.expectBodyContains(dto.email);
			});
		  });
		});
	
	describe('Bookmarks', () => {
		describe('Get empty bookmarks', () => {
			it('Should get bookmarks', () => {
				return pactum
					.spec()
					.get('/bookmark')
					.withHeaders({
						'Authorization': `Bearer $S{token}`,
						'Accept': 'application/json'
					})
					.expectStatus(200)
					.expectBody([]); 
			})
		})
		
		describe('Create bookmarks', () => {
			const dto: CreateBookmarkDto = {
				title: "First bookmark",
				link: 'https://www.youtube.com/watch?v=GHTA143_b-s&t=1217s'
			}
			it('It should create a bookmark', () => {
				return pactum
					.spec()
					.post('/bookmark')
					.withHeaders({
						'Authorization': `Bearer $S{token}`,
						'Accept': 'application/json'
					})
					.withBody(dto)
					.expectStatus(201)
					.stores('bookId', 'id');
					
			})
		})
		describe('Get  bookmarks', () => {
			it('Should get bookmarks', () => {
				return pactum
					.spec()
					.get('/bookmark')
					.withHeaders({
						'Authorization': `Bearer $S{token}`,
						'Accept': 'application/json'
					})
					.expectStatus(200)
					.expectJsonLength(1); 
			})
		})

		describe('Get bookmarks by id', () => {
			it('should get bokmar by id', () => {
				return pactum
					.spec()
					.get('/bookmark')
					.withPathParams('id', `$S{bookId}`)
					.withHeaders({
						'Authorization': `Bearer $S{token}`,
						'Accept': 'application/json'
					})
					.expectStatus(200).inspect();
			})
		})

		describe('Edit bookmarks', () => {
			const editDto: EditBookmarkDto = {
				title: 'Changet title',
				description: 'descriptioms',
				link: 'link after editing'
			}
			it('should be edited bookmark by id', () => {
				return pactum
					.spec()
					.patch('/bookmark/{id}')
					.withPathParams('id', `$S{bookId}`)
					.withHeaders({
						'Authorization': `Bearer $S{token}`,
						'Accept': 'application/json'
					})
					.withBody(editDto)
					.expectStatus(200)
					

			})
		})
		describe('Delete bookmarks', () => {
			it('Should delete bookmark', () => {
				return pactum
					.spec()
					.delete('/bookmark/{id}')
					.withPathParams('id', `$S{bookId}`)
					.withHeaders({
						'Authorization': `Bearer $S{token}`,
						'Accept': 'application/json'
					})
					.expectStatus(204);
			})

			it('Should be empty bookmarks', () => {
				return pactum
					.spec()
					.get('/bookmark')
					.withHeaders({
						'Authorization': `Bearer $S{token}`,
						'Accept': 'application/json'
					})
					.expectStatus(200)
					.expectJsonLength(0); 
			})
		})

	})



	

})
