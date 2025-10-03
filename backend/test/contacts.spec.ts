import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Contacts', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'c1@example.com', password: 'password123', name: 'C1' });
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'c1@example.com', password: 'password123' });
    token = login.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('uploads multiple contacts', async () => {
    const res = await request(app.getHttpServer())
      .post('/contacts/upload')
      .set('Authorization', `Bearer ${token}`)
      .send({ contacts: [{ name: 'Alice', phone: '+155501' }, { name: 'Bob', phone: '+155502' }] })
      .expect(201);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });
});



