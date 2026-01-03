import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().positive()),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),
  CORS_ORIGIN: z.string(),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    throw new Error(`Environment validation failed: ${result.error.message}`);
  }
  
  return result.data;
};

export const env = parseEnv();
