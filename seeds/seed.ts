import { PrismaClient } from '@prisma/client';
import { getUsersSeed } from './users';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.userModel.createMany({
    data: getUsersSeed(5)
  });

  console.dir({ users });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })