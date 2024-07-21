import { z } from 'zod';

export const userZodSchema = z
  .object({
    cpf: z
      .string({
        required_error: 'Cpf is required',
      })
      .nullable(),
    email: z
      .string({
        required_error: 'E-mail is required',
      })
      .email({
        message: 'Invalid email address',
      }),
    full_name: z
      .string({
        required_error: 'Full name is required',
      })
      .nullable(),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .nullable(),

    type_user: z
      .string({
        required_error: 'type user is required',
      })
      .nullable(),
  })
  .required({
    cpf: true,
    email: true,
    full_name: true,
    password: true,
    type_user: true,
  });

export type userZodValidateType = z.infer<typeof userZodSchema>;
