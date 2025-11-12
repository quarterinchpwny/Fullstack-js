import { Hono } from "hono";
import { db } from "../db";
import { users } from "../db/schema/users";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use environment variable for production

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authRoute = new Hono()
  .post('/login', zValidator('json', loginSchema), async (c) => {
    const { email, password } = c.req.valid('json');

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((res) => res[0]);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    setCookie(c, 'token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    return c.json({ message: 'Logged in successfully', user: { id: user.id, email: user.email } });
  })
  .post('/register', zValidator('json', registerSchema), async (c) => {
    const { email, password } = c.req.valid('json');

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((res) => res[0]);

    if (existingUser) {
      return c.json({ error: 'User with this email already exists' }, 409);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const [newUser] = await db
      .insert(users)
      .values({ email, password: hashedPassword })
      .returning();

    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
    setCookie(c, 'token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    return c.json({ message: 'User registered successfully', user: { id: newUser.id, email: newUser.email } }, 201);
  })
  .get("/me", async (c) => {
    const token = getCookie(c, 'token');
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, decoded.userId))
        .limit(1)
        .then((res) => res[0]);

      if (!user) {
        return c.json({ error: 'User not found' }, 404);
      }
      return c.json({ user: { id: user.id, email: user.email } });
    } catch (error) {
      return c.json({ error: 'Invalid token' }, 401);
    }
  })
  .post("/logout", (c) => {
    deleteCookie(c, 'token', { path: '/' });
    return c.json({ message: "Logged out successfully" });
  });
