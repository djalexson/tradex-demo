"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogIn } from "lucide-react";
import { tradeApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("trader@tradex.local");
  const [password, setPassword] = useState("password");
  const [status, setStatus] = useState("");

  return (
    <main className="auth-page">
      <section className="card auth-card">
        <Link href="/" className="brand">
          <span className="brand-mark">TX</span>
          <span>TradeX</span>
        </Link>
        <h1>Вход</h1>
        <p className="muted">Демо-доступ: trader@tradex.local / password</p>
        <form
          className="form"
          onSubmit={async (event) => {
            event.preventDefault();
            setStatus("Проверяю доступ...");
            try {
              const result = await tradeApi.login(email, password);
              setStatus("Вход выполнен");
              router.push(result.user.role === "admin" ? "/admin" : "/dashboard");
            } catch (error) {
              setStatus(error instanceof Error ? error.message : "Ошибка входа");
            }
          }}
        >
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password">Пароль</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          <button className="button" type="submit">
            <LogIn size={18} />
            Войти в кабинет
          </button>
          <button className="button secondary" type="button" onClick={() => setEmail("admin@tradex.local")}>
            Admin demo
          </button>
          <div className="toast">{status}</div>
        </form>
      </section>
    </main>
  );
}
