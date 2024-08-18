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
import toast from "react-hot-toast";
import Header from "@/components/ui/navbar";
import Directions from "./directions";

const ALLOWED_IMAGE_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];
//whisper only accepts these audio formats
const ALLOWED_AUDIO_FILE_TYPES = [
  // MP3
  "audio/mpeg",
  "audio/mp3",
  "audio/MPA",
  "audio/mpa-robust",
  // M4A
  "audio/m4a",
  "audio/x-m4a",
  "audio/aac",
  // MP4
  "audio/mp4",
  "audio/x-mp4",
  // WAV
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  // WebM
  "audio/webm",
  // Ogg
  "audio/ogg",
  "audio/x-ogg",
  "application/ogg",
  // FLAC
  "audio/flac",
  "audio/x-flac",
  // AAC
  "audio/aac",
  "audio/aacp",
  // 3GPP
  "audio/3gpp",
  "audio/3gpp2",
  // MIDI
  "audio/midi",
  "audio/x-midi",
  // Basic
  "audio/basic",
  // Generic
  "audio/*",
];
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
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [audioUploadError, setAudioUploadError] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAudioButton = async () => {
    audioFileInputRef.current?.click();
  };

  const handleImageButton = async () => {
    imageFileInputRef.current?.click();
  };

  const handleUploadAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedAudioFile(e.target.files[0]);
    }
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImageFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    console.log(selectedAudioFile);
  }, [selectedAudioFile]);

  useEffect(() => {
    console.log(selectedImageFile);
  }, [selectedImageFile]);

  const handleSendMessage = async () => {
    console.log("Sending message or uploading file");
    if (inputText.trim() || selectedAudioFile || selectedImageFile) {
      setLoading(true);
      setAudioUploadError(null); // Clear any previous errors
      setImageUploadError(null);

      //Image File process

      if (selectedImageFile) {
        console.log("Attempting to upload image file:", selectedImageFile.name);
        if (!ALLOWED_IMAGE_FILE_TYPES.includes(selectedImageFile.type)) {
          console.log("Invalid file type:", selectedImageFile.type);
          const errorMessage =
            "Invalid image file type. Please upload a valid image file.";
          toast.error(errorMessage);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              type: "bot",
              content: errorMessage,
            },
          ]);
          setImageUploadError(errorMessage);
          setLoading(false);
          return;
        }

        try {
          const { data, error } = await supabase.storage
            .from("images")
            .upload("public/" + selectedImageFile.name, selectedImageFile);

          console.log("Image uploaded successfully:", data);
          const { data: publicUrlData } = supabase.storage
            .from("images")
            .getPublicUrl("public/" + selectedImageFile.name);

          const imageUrl = publicUrlData.publicUrl;
          console.log("Image URL:", imageUrl);

          setMessages((prevMessages) => [
            ...prevMessages,
            {
              type: "user",
              content: `Uploaded image: ${selectedImageFile.name}`,
            },
          ]);

          const response = await fetch(`${API_URL}transcribe/image`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: imageUrl, userID: userId }),
          });
          const messageData = await response.json();
          const textResponse = messageData.result.textResponse;
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
        } catch (error: any) {
          console.error("Error uploading image:", error);
          const errorMessage = `Error uploading image: ${
            error.message || "Unknown error"
          }`;
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              type: "bot",
              content: errorMessage,
            },
          ]);
          setImageUploadError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setLoading(false);
        }
      }

      //Audio File process

      if (selectedAudioFile) {
        console.log("Attempting to upload audio file:", selectedAudioFile.name);
        if (!ALLOWED_AUDIO_FILE_TYPES.includes(selectedAudioFile.type)) {
          console.log("Invalid file type:", selectedAudioFile.type);
          const errorMessage =
            "Invalid audio file type. Please upload a valid audio file.";
          toast.error(errorMessage);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              type: "bot",
              content: errorMessage,
            },
          ]);
          setAudioUploadError(errorMessage);
          setLoading(false);
          return;
        }

        try {
          const { data, error } = await supabase.storage
            .from("audio")
            .upload("public/" + selectedAudioFile.name, selectedAudioFile);

          console.log("Audio uploaded successfully:", data);
          const { data: publicUrlData } = supabase.storage
            .from("audio")
            .getPublicUrl("public/" + selectedAudioFile.name);

          const audioUrl = publicUrlData.publicUrl;
          console.log("Audio URL:", audioUrl);

          setMessages((prevMessages) => [
            ...prevMessages,
            {
              type: "user",
              content: `Uploaded audio: ${selectedAudioFile.name}`,
            },
          ]);
          const response = await fetch(`${API_URL}transcribe/audio`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ audio: audioUrl, userID: userId }),
          });
          const messageData = await response.json();
          const textResponse = messageData.result.textResponse;
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
        } catch (error: any) {
          console.error("Error uploading audio:", error);
          const errorMessage = `Error uploading audio: ${
            error.message || "Unknown error"
          }`;
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              type: "bot",
              content: errorMessage,
            },
          ]);
          setAudioUploadError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setLoading(false);
        }
      }
      //Text message process
      if (inputText.trim()) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "user", content: inputText },
        ]);
        setInputText("");

        try {
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
        } catch (error) {
          console.error("Error sending message:", error);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              type: "bot",
              content: "Sorry, something went wrong. Please try again later.",
            },
          ]);
        }
      }

      setLoading(false);
    }
  };
  const handleAdminPageRedirect = () => {
    router.push("/admin");
  };
  const handleRequestsClick = () => {
    router.push("/requests");
  };

  const handleRequestPageRedirect = () => {
    router.push("/requests");
  };

  return (
    <div
      className={`min-h-screen w-full p-4 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <Header />

      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-4xl font-bold">Welcome</h1>
        <p className="text-2xl text-requestsFg2">
          Welcome to your dashboard. Here you can manage your account and submit
          complaints.
        </p>
      </div>
      <Directions />
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
              onKeyDown={(e) =>
                e.key === "Enter" && !loading && handleSendMessage()
              }
              placeholder="Type your complaint here..."
              className="flex-1 mr-2"
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
            <Button disabled={loading} onClick={handleAudioButton}>
              <Mic className="mr-2 h-4 w-4" />
              {selectedAudioFile ? selectedAudioFile.name : "Upload Audio"}
            </Button>
            <Button disabled={loading} onClick={handleImageButton}>
              <Camera className="mr-2 h-4 w-4" />{" "}
              {selectedImageFile ? selectedImageFile.name : "Upload Image"}
            </Button>
            <input
              type="file"
              accept="audio/*"
              ref={audioFileInputRef}
              style={{ display: "none" }}
              onChange={handleUploadAudio}
            />
            <input
              type="file"
              accept="image/*"
              ref={imageFileInputRef}
              style={{ display: "none" }}
              onChange={handleUploadImage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
