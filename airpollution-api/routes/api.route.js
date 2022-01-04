const router = require("express").Router();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
router.get("/", async (req, res, next) => {
  console.log("yEHOOOOOOO");
  res.json(1000);
});

router.get("/prisma", async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
