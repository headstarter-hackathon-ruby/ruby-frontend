"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col justify-center items-center p-4">
      <h1 className="text-5xl font-bold mb-8 text-white">Oops!</h1>
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">
            Authentication Error
          </CardTitle>
          <CardDescription className="text-gray-400">
            There was an issue with your sign-in attempt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-white">
            You've been redirected here due to an authentication error. This
            could be because of:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
            <li>Incorrect email or password</li>
            <li>An expired session</li>
            <li>Account-related issues</li>
          </ul>
          <p className="text-white mt-4">
            Please try signing in again. If the problem persists, contact
            support.
          </p>
          <Button
            onClick={() => router.push("/sign-in")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
          >
            Return to Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
