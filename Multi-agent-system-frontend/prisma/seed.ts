import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Encryption helper (must match the logic used in the app)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

function encrypt(text: string): string {
  const iv = crypto.randomBytes(12);
  let keyHex = ENCRYPTION_KEY.replace(/['"]/g, '').trim();
  const key = Buffer.from(keyHex, 'hex');
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 12);

  console.log('Clearing existing data...');
  await prisma.projectMember.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.studentProfile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Creating users...');
  
  // 1. Admin
  await prisma.user.create({
    data: {
      email: encrypt('admin@yandex-society.ru'),
      passwordHash,
      name: 'Администратор Центра',
      role: 'ADMIN',
    },
  });

  // 2. Students
  const studentData = [
    { name: 'Александр Волков', email: 'volkov@phystech.edu', uni: 'МФТИ', bio: 'Специализируюсь на Computer Vision.' },
    { name: 'Екатерина Соколова', email: 'sokolova@hse.ru', uni: 'ВШЭ', bio: 'NLP-исследователь, интересуюсь анализом текстов.' },
    { name: 'Максим Белов', email: 'belov@itmo.ru', uni: 'ИТМО', bio: 'Backend-разработчик на Python и Go.' },
  ];

  const students = [];
  for (const s of studentData) {
    const user = await prisma.user.create({
      data: {
        email: encrypt(s.email),
        passwordHash,
        name: s.name,
        role: 'STUDENT',
        profile: {
          create: {
            university: s.uni,
            course: 3,
            skills: { python: 9, ml: 7, pytorch: 8 },
            bio: s.bio,
          }
        }
      }
    });
    students.push(user);
  }

  console.log('Creating applications and projects...');

  const apps = [
    {
      projectName: "ИИ для мониторинга популяций диких животных",
      direction: "ECOLOGY" as const,
      description: "Система автоматического распознавания животных на снимках с фотоловушек в заповедниках России.",
      score: 4.8,
      status: "APPROVED" as const
    },
    {
      projectName: "Детекция патологий зрения у детей",
      direction: "HEALTHCARE" as const,
      description: "Мобильное приложение для предварительного скрининга зрения с использованием нейросетей.",
      score: 4.5,
      status: "APPROVED" as const
    },
    {
      projectName: "Платформа для обучения слабослышащих студентов",
      direction: "EDUCATION" as const,
      description: "Инструмент для перевода лекций в реальном времени на жестовый язык с помощью 3D-аватаров.",
      score: 4.2,
      status: "PENDING" as const
    }
  ];

  for (const app of apps) {
    const createdApp = await prisma.application.create({
      data: {
        projectName: app.projectName,
        direction: app.direction,
        geography: "Вся Россия",
        description: app.description,
        taskDescription: "Требуется разработка и обучение модели, интеграция с облачным SDK.",
        currentStage: "Прототип",
        teamDescription: "Группа экспертов из НКО и 2 разработчика.",
        dataAvailable: "Есть размеченный датасет (10к+ объектов)",
        yandexTechs: "Yandex Cloud, Vision API, DataSphere",
        openSource: true,
        plannedDuration: "6 месяцев",
        contactName: "Игорь Степанов",
        contactEmail: encrypt('stepanov@projects.ru'),
        status: app.status,
        score: {
          overall: app.score,
          criteria: { social: 5, tech: 4.5, science: 4.8, practicality: 4, scalability: 5 }
        }
      }
    });

    if (app.status === "APPROVED") {
      await prisma.project.create({
        data: {
          applicationId: createdApp.id,
          name: app.projectName,
          status: "ACTIVE",
          startDate: new Date(),
          endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          members: {
            create: [
              { userId: students[0].id, memberRole: "CV Engineer", isApproved: true },
              { userId: students[1].id, memberRole: "Data Scientist", isApproved: true },
            ]
          },
          tasks: {
            create: [
              { title: "Подготовка инфраструктуры в облаке", status: "DONE", priority: "HIGH" },
              { title: "Препроцессинг исходных данных", status: "IN_PROGRESS", priority: "CRITICAL" },
              { title: "Обучение первой итерации модели", status: "TODO", priority: "HIGH" },
            ]
          }
        }
      });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
