"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/components/ui/ThemeContext";
import { ToggleButton } from "@/components/ui/ToggleButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Camera, Mic, Send, User, Bot, Loader2 } from "lucide-react";
import { set } from "react-hook-form";
import toast from "react-hot-toast";
import { createClient } from "@/app/utils/supabase/client";
export default function Header() {
  const { theme } = useTheme();
  const router = useRouter();
  const supabase = createClient();
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  useEffect(() => {
    async function getUserInfo() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else if (user) {
        setUserEmail(user.email || "");
        setUserId(user.id || "");
      }
    }

    getUserInfo();
  }, []);
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };
  const handleRequestsClick = () => {
    router.push("/requests");
  };

  const handleRequestPageRedirect = () => {
    router.push("/requests");
  };
  const handleAdminPageRedirect = () => {
    router.push("/admin");
  };

  return (
    <nav className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        {userId && userId === "f6b625bc-e878-4fc2-9855-fb51e312cfba" ? (
          <>
            <ToggleButton />
            <Button onClick={handleAdminPageRedirect}>Admin</Button>
            <Button onClick={handleRequestsClick}>My Requests</Button>
            <Button onClick={handleSignOut}>Sign Out</Button>
          </>
        ) : (
          <>
            <ToggleButton />
            <Button onClick={handleRequestsClick}>My Requests</Button>

            <Button onClick={handleSignOut}>Sign Out</Button>
          </>
        )}
      </div>
    </nav>
  );
}
