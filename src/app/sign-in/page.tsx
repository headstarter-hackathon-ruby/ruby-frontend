// "use client";
// import React, { useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { createClient } from "@supabase/supabase-js";
// import { useRouter } from "next/navigation";
// import { login } from "./actions";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL || "",
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
// );

// const formSchema = z.object({
//   email: z.string().email({
//     message: "Please enter a valid email address.",
//   }),
//   password: z.string().min(1, {
//     message: "Password is required.",
//   }),
// });

// type FormValues = z.infer<typeof formSchema>;

// export default function Signin() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   async function signInUser(email: string, password: string) {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email: email,
//       password: password,
//     });

//     if (error) throw error;
//     return data;
//   }

//   async function onSubmit(values: FormValues) {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const user = await signInUser(values.email, values.password);
//       console.log("User signed in:", user);
//       router.push("/dashboard");
//     } catch (error) {
//       console.error("Failed to sign in:", error);
//       setError(
//         error instanceof Error ? error.message : "An unknown error occurred"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col justify-center items-center p-4">
//       <h1 className="text-5xl font-bold mb-8 text-white">Welcome Back</h1>
//       <Card className="w-full max-w-md bg-gray-800 border-gray-700">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold text-white">
//             Sign in
//           </CardTitle>
//           <CardDescription className="text-gray-400">
//             Enter your credentials to access your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {error && <p className="text-red-500 mb-4">{error}</p>}
//           <Form {...form}>
//             <form className="space-y-6">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-gray-200">Email</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="email"
//                         placeholder="johndoe@example.com"
//                         className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-gray-200">Password</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="password"
//                         placeholder="********"
//                         className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <Button
//                 type="submit"
//                 formAction={login}
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Signing In..." : "Sign In"}
//               </Button>
//             </form>
//           </Form>
//           <div className="mt-4 text-center">
//             <a
//               href="/sign-up"
//               className="text-sm text-blue-400 hover:underline"
//             >
//               Don't have an account? Sign up
//             </a>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { login } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ThemeProvider, useTheme } from "@/components/ui/ThemeContext";
import { ToggleButton } from "@/components/ui/ToggleButton";

import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

function SigninContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { theme } = useTheme();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function signInUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw error;
    return data;
  }

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const user = await signInUser(values.email, values.password);
      console.log("User signed in:", user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to sign in:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={`min-h-screen w-full flex flex-col justify-center items-center p-4 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-100 to-white'
      }`}>
      <div className="absolute top-4 right-4">
        <ToggleButton />
      </div>
      <h1 className={`text-5xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Welcome Back</h1>
      <Card className={`w-full max-w-md ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
        <CardHeader className="space-y-1">
          <CardTitle className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Sign in
          </CardTitle>
          <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="johndoe@example.com"
                        className={`${theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        className={`${theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                formAction={login}
                className={`w-full ${theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <a
              href="/sign-up"
              className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
            >
              Don't have an account? Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Signin() {
  return (
    <ThemeProvider>
      <SigninContent />
    </ThemeProvider>
  );
}