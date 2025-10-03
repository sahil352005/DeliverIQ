import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e-lite)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers a user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'password123', name: 'Tester' })
      .expect(201);
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.token).toBeDefined();
  });

  it('logs in a user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(201);
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.token).toBeDefined();
  });
});


