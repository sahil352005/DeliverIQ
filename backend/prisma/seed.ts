/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  const password = await bcrypt.hash('password123', 10);
  const [u1, u2] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'user1@example.com' },
      update: {},
      create: { email: 'user1@example.com', name: 'User One', password },
    }),
    prisma.user.upsert({
      where: { email: 'user2@example.com' },
      update: {},
      create: { email: 'user2@example.com', name: 'User Two', password },
    }),
  ]);

  const makeContacts = async (ownerId: string) => {
    const contacts = Array.from({ length: 8 }).map((_, i) => ({
      ownerId,
      name: `Contact ${i + 1}`,
      phone: `+1555000${(i + 1).toString().padStart(3, '0')}`,
    }));
    await prisma.contact.createMany({ data: contacts });
    return prisma.contact.findMany({ where: { ownerId } });
  };

  const [c1, c2] = await Promise.all([makeContacts(u1.id), makeContacts(u2.id)]);

  // seed some messages
  const seedMessages = async (userId: string, contacts: { id: string }[]) => {
    for (const contact of contacts.slice(0, 5)) {
      await prisma.message.create({
        data: { senderId: userId, contactId: contact.id, content: 'Hello from seed', status: 'PENDING' as any },
      });
    }
  };
  await seedMessages(u1.id, c1);
  await seedMessages(u2.id, c2);

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


