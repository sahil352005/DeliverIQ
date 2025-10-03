import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Messages', () => {
  let app: INestApplication;
  let token: string;
  let contactId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'm1@example.com', password: 'password123', name: 'M1' });
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'm1@example.com', password: 'password123' });
    token = login.body.token;

    const contacts = await request(app.getHttpServer())
      .post('/contacts/upload')
      .set('Authorization', `Bearer ${token}`)
      .send({ contacts: [{ name: 'Alice', phone: '+155501' }, { name: 'Bob', phone: '+155502' }] });
    contactId = contacts.body[0].id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('sends a bulk message and fetches its status', async () => {
    const send = await request(app.getHttpServer())
      .post('/messages/send')
      .set('Authorization', `Bearer ${token}`)
      .send({ contactIds: [contactId], content: 'Hello!' })
      .expect(201);
    expect(Array.isArray(send.body)).toBe(true);
    const messageId = send.body[0].id;
    const status = await request(app.getHttpServer()).get(`/messages/status/${messageId}`).expect(200);
    expect(status.body.id).toBe(messageId);
    expect(status.body.status).toBeDefined();
  });
});


