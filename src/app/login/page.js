// import React from "react";
// import LargeLogo from "../../../components/logos/largeLogo";
// import styles from "./login.module.css";
// import LoginForm from "/components/loginform/loginform.jsx";

// export default function Login() {
//   return (
//     <div className={styles.LoginPage}>
//       <div className={styles.container}>
//         <LargeLogo className={styles.largeLogo} />
//         <LoginForm />
//       </div>
//     </div>
//   );
// }
"use client";

// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "../../../utils/supabase.js";

export default function LoginPage() {
  const router = useRouter();
  // const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function logIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error(error);
    }
    router.push("/");
  }

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error(error);
    }
    router.push("/");
  }

  return (
    <main>
      <form>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={logIn}>
          Log in
        </button>
        <button type="button" onClick={signUp}>
          Sign up
        </button>
      </form>
    </main>
  );
}
