"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { signupSchema } from "@/schemas/authSchemas";
import { zodErrorsToFieldMap } from "@/utils/formErrors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignupPage() {
  const router = useRouter();
  const signup = useAuthStore((state) => state.signup);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [hasHydrated, isAuthenticated, router]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      setErrors(zodErrorsToFieldMap(result.error));
      return;
    }

    setIsSubmitting(true);
    const response = signup(result.data);
    setIsSubmitting(false);

    if (!response.success) {
      setFormError(response.error);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-4 py-12" aria-label="Signup Section">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">Create an account</CardTitle>
          <CardDescription>
            Register to start managing your pets&apos; care records.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit} noValidate data-testid="signup-form">
          <CardContent className="space-y-4">
            <div aria-live="polite" aria-atomic="true">
              {formError && (
                <p className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
                  {formError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                data-testid="signup-name-input"
              />
              {errors.name && (
                <p id="name-error" className="text-sm font-medium text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                data-testid="signup-email-input"
              />
              {errors.email && (
                <p id="email-error" className="text-sm font-medium text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                data-testid="signup-password-input"
              />
              {errors.password && (
                <p id="password-error" className="text-sm font-medium text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                data-testid="signup-confirm-password-input"
              />
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="text-sm font-medium text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
              data-testid="signup-submit-btn"
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary transition-colors hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}