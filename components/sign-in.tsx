"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { Spinner } from "./ui/spinner"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import error from "next/dist/api/error"

const formSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long.")
})

export function SignInForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await authClient.signIn.email({
                email: data.email,
                password: data.password,
            }, {
                onSuccess: () => {
                    toast.success("Signed in successfully!");
                },
                onError: (ctx) => {
                    toast.error(`Failed to sign in: ${ctx.error.message}`);
                }
            });
        } catch (error) {
            toast.error("Failed to sign in. Please try again.");
        }
    }

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                    Enter your credentials to access your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="signin-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        type="email" aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <FieldGroup>
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                        Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        type="password" aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>

                <>
                    <Field orientation="horizontal" className="flex w-full items-center justify-between">
                        <p className="text-sm flex items-center gap-1">
                            Don't have an account?{' '}
                            <Link href="/sign-up" className="underline">
                                Sign up
                            </Link>
                        </p>
                        <Button type="button" variant="outline" onClick={() => form.reset()}>
                            Reset
                        </Button>
                        <Button type="submit" form="signin-form">
                            {
                                form.formState.isSubmitting ?
                                    <Spinner className="size-6" />
                                    : "Sign In"
                            }
                        </Button>
                    </Field>
                </>

            </CardFooter>
        </Card>
    )
}
