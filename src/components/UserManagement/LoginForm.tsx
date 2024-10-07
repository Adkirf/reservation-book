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
import { useAuth } from "@/contexts/AuthProvider"

export function LoginForm() {
    const { t } = useAuth();

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">{t('userManagement.login')}</CardTitle>
                <CardDescription>
                    {t('userManagement.loginDescription')}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {/* Add any additional content here */}
            </CardContent>
            <CardFooter>
                <Button onClick={signInWithGoogle} className="w-full">{t('userManagement.signInWithGoogle')}</Button>
            </CardFooter>
        </Card>
    )
}
