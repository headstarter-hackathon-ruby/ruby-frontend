import { redirect } from "next/navigation";

import { createClient } from "./utils/supabase/server";

export default async function PrivatePage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/sign-in");
  } else {
    redirect("/tracker");
    console.log(data.user);
    return null;
  }
}
