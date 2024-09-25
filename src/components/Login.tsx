'use client'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { signInWithGoogle } from "@/lib/firebase/auth"

export function LoginForm() {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    You can only login if your employee has registered you.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">

            </CardContent>
            <CardFooter>
                <Button onClick={signInWithGoogle} className="w-full">Sign in with google</Button>
            </CardFooter>
        </Card>
    )
}
