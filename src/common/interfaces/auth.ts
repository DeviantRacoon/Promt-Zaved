export type LoginForm = { email: string; password: string };

export type RegisterForm = {
  email: string;
  password: string;
  confirm: string;
  accept: boolean;
};

export type ForgotForm = { email: string };

export type User = {
  name: string;
  email: string;
  password: string;
};
