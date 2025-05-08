const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ProductService = {
  getAll: async ({ page = 1, limit = 8, category } = {}) => {
    const skip = (page - 1) * limit;
    const filter = category ? { category } : {};

    return prisma.product.findMany({
      where: filter,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  getAllWithPagination: async ({ page = 1, limit = 8, category } = {}) => {
    const skip = (page - 1) * limit;
    const filter = category ? { category } : {};

    const [products, totalItems] = await Promise.all([
      prisma.product.findMany({
        where: filter,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          price: true,
          category: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.product.count({ where: filter }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      products,
      totalItems,
      totalPages,
    };
  },

  create: async (data) => {
    return prisma.product.create({ data });
  },

  getById: async (id) => {
    return prisma.product.findUnique({ where: { id } });
  },

  update: async (id, data) => {
    return prisma.product.update({
      where: { id },
      data,
    });
  },

  delete: async (id) => {
    return prisma.product.delete({ where: { id } });
  },

  count: async ({ category } = {}) => {
    const filter = category ? { category } : {};
    return prisma.product.count({
      where: filter,
    });
  },
};

module.exports = ProductService;
