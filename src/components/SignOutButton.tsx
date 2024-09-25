'use client'

import { Button } from "./ui/button";
import { signOut } from "../lib/firebase/auth";

export default function SignOutButton() {
    return <Button onClick={signOut}>Sign Out</Button>;
}