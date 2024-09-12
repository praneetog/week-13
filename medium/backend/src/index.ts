import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    JWT_SECRET: string
	}
}>().basePath('/api/v1');

//Middleware
app.use('/api/v1/blog/*', async (c, next) => {
	const header = c.req.header('Authorization');
	if (!header) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	const token = header.split(' ')[1];

  //In Hono, 'verify' is used to verify the JWT
	const response = await verify(token, c.env.JWT_SECRET);
	if (response.id) {
		c.status(403);
		return c.json({ error: "unauthorized" });
	}
	await next()
})

app.post('/user/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password,
    },
  })

  //In Hono, 'sign' is used to generate JWT
  const token = await sign({ id: user.id }, c.env.JWT_SECRET)

  return c.json({
    jwt: token
  })
})

app.post('/user/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();
	const user = await prisma.user.findUnique({
		where: {
			email: body.email,
      password: body.password
		}
	});

  if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({
    jwt
  });
})

app.post('/blog', (c) => {
  return c.text('Hello Hono!')
})

app.put('/blog', (c) => {
  return c.text('Hello Hono!')
})

app.get('/blog/:id', (c) => {
  return c.text('Hello Hono!')
})

app.get('/blog/bulk', (c) => {
  return c.text('Hello Hono!')
})

export default app
