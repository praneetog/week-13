import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

//Middleware
blogRouter.use("/*", async (c, next) => {
  const header = c.req.header("Authorization");
  if (!header) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }

  //In Hono, 'verify' is used to verify the JWT
  const user = (await verify(header, c.env.JWT_SECRET)) as { id: string };

  if (user) {
    c.set("userId", user.id);
    await next();
  } else {
    c.status(403);
    return c.json({
      error: "unauthorized",
    });
  }
});

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: authorId,
    },
  });

  return c.json({
    id: post.id,
  });
});

blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const post = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return c.text("updated post");
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const posts = await prisma.post.findMany({});

  return c.json({
    posts,
  });
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });

    return c.json({
      post,
    });
  } catch (e) {
    c.status(411);
    return c.json({
      message: "Some error occured while finding post",
    });
  }
});
