const prisma = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
  image: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
  },
  userLike: {
    findFirst: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  dailyTask: {
    findUnique: jest.fn(),
  },
};

export { prisma };
