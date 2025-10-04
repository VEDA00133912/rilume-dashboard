"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/css/LoginPage.module.css";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/dashboard/Main");
    } else {
      setError("パスワードが間違っています");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1>管理者ログイン</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
          />
          <button type="submit" className={styles.button}>
            ログイン
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
