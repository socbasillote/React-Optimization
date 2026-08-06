import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "../schemas/loginSchema";
import { useLogin } from "../hooks/useLogin";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login, isLoading } = useLogin();

  const onSubmit = async (values) => {
    await login(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>

        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />

        {errors.email && <FieldError>{errors.email.message}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>

        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />

        {errors.password && <FieldError>{errors.password.message}</FieldError>}
      </Field>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
