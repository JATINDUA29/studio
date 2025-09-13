'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Logo } from "@/components/icons/Logo";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // In a real app, you'd handle authentication here.
    // For now, we'll just redirect to the dashboard.
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2">
                <Logo className="h-10 w-10 text-primary" />
                <span className="text-3xl font-bold font-headline text-foreground">Arogya AI</span>
            </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Log In</CardTitle>
            <CardDescription>Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between text-sm">
                    <Link href="#" className="font-medium text-primary hover:underline">
                        Forgot password?
                    </Link>
                </div>
                 <Button type="submit" className="w-full">
                  Log In
                </Button>
                 <Button variant="outline" className="w-full" asChild>
                    <Link href="#">
                        Don't have an account? Sign Up
                    </Link>
                 </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="mt-6 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{' '}
            <Link href="/privacy" className="underline hover:text-primary">
                Privacy Policy
            </Link>.
        </div>
      </div>
    </div>
  );
}
