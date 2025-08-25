// scripts/seed.ts
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const hashedPassword = await bcrypt.hash('admin@123', 12)

  const adminUser = await prisma.user.upsert({
    where: { email: 'patrick@damaface.com.br' },
    update: {},
    create: {
      email: 'admin@clinica.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  console.log('Usuário admin criado:', adminUser)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })