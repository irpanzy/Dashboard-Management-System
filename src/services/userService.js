const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const UserService = {
  getAll: async ({ page = 1, limit = 8, name } = {}) => {
    const skip = (page - 1) * limit;
    const filter = name ? { name } : {};

    return await prisma.user.findMany({
      where: filter,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  getAllWithPagination: async ({ page = 1, limit = 8, name } = {}) => {
    const skip = (page - 1) * limit;
    const filter = name ? { name } : {};

    const [users, totalItems] = await Promise.all([
      prisma.user.findMany({
        where: filter,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where: filter }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      users,
      totalItems,
      totalPages,
    };
  },

  create: async ({ name, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  },

  getById: async (id) => {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  update: async (id, { name, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  },

  delete: async (id) => {
    return await prisma.user.delete({
      where: { id },
    });
  },
};

module.exports = UserService;
