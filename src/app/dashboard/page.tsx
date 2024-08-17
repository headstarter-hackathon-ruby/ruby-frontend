"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/components/ui/ThemeContext";
import { ToggleButton } from "@/components/ui/ToggleButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import { Camera, Mic, Send, User, Bot, Loader2 } from "lucide-react";
import { API_URL } from "../config";
import { set } from "react-hook-form";
interface Message {
  type: "user" | "bot";
  content: string;
}

export default function Dashboard() {
  const { theme } = useTheme();
  const router = useRouter();
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      setMessages([...messages, { type: "user", content: inputText }]);
      setInputText("");

      try {
        setLoading(true);
        const response = await fetch(`${API_URL}textPrompt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: inputText, userID: userId }),
        });

        const data = await response.json();
        const textResponse = data.result.textResponse;
        console.log("textResponse", textResponse);

        // Simulate bot response
        setTimeout(() => {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              type: "bot",
              content:
                textResponse ||
                "Thank you for your complaint. We've recorded it and will get back to you soon.",
            },
          ]);
        }, 1000);
        setLoading(false);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "bot",
            content: "Sorry, something went wrong. Please try again later.",
          },
        ]);
        setLoading(false);
      }
    }
  };
  const handleAdminPageRedirect = () => {
    router.push("/admin");
  };

  const defaultComplaints = [
    "Product not as described",
    "Late delivery",
    "Poor customer service",
    "Billing issue",
    "Defective product",
    "Cancellation problem",
  ];

  return (
    <div
      className={`min-h-screen w-full p-4 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <nav className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          {userId && userId === "f6b625bc-e878-4fc2-9855-fb51e312cfba" ? (
            <>
              <ToggleButton />
              <Button onClick={handleSignOut}>Sign Out</Button>
              <Button onClick={handleAdminPageRedirect}>Admin</Button>
            </>
          ) : (
            <>
              <ToggleButton />
              <Button onClick={handleSignOut}>Sign Out</Button>
            </>
          )}
        </div>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className={theme === "dark" ? "bg-gray-800" : "bg-white"}>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Welcome to your dashboard. Here you can manage your account and
              submit complaints.
            </p>
          </CardContent>
        </Card>

        <Card className={theme === "dark" ? "bg-gray-800" : "bg-white"}>
          <CardHeader>
            <CardTitle>Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your complaint stats and metrics will be displayed here.</p>
          </CardContent>
        </Card>

        <Card className={theme === "dark" ? "bg-gray-800" : "bg-white"}>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your recent complaint activity will be shown here.</p>
          </CardContent>
        </Card>
      </div>

      <Card className={`mb-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <CardHeader>
          <CardTitle>Submit a Complaint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 overflow-y-auto mb-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : `${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {message.type === "user" ? (
                      <User className="w-4 h-4 mr-2" />
                    ) : (
                      <Bot className="w-4 h-4 mr-2" />
                    )}
                    <span className="font-semibold">
                      {message.type === "user" ? "You" : "Support Bot"}
                    </span>
                  </div>
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Support Bot is typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="flex space-x-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && !loading && handleSendMessage()
              }
              placeholder="Type your complaint here..."
              className="flex-1"
              disabled={loading}
            />
            <Button onClick={handleSendMessage} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {loading ? "Sending..." : "Submit"}
            </Button>
            <Button disabled={loading}>
              <Mic className="mr-2 h-4 w-4" /> Record Audio
            </Button>
            <Button disabled={loading}>
              <Camera className="mr-2 h-4 w-4" /> Upload Image
            </Button>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Common Complaints</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {defaultComplaints.map((complaint, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto py-4 px-6 text-left justify-start items-start"
            onClick={() => {
              setMessages([...messages, { type: "user", content: complaint }]);
              setTimeout(() => {
                setMessages((prevMessages) => [
                  ...prevMessages,
                  {
                    type: "bot",
                    content:
                      "Thank you for your complaint. We've recorded it and will get back to you soon.",
                  },
                ]);
              }, 1000);
            }}
          >
            {complaint}
          </Button>
        ))}
      </div>
    </div>
  );
}
