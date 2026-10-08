"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { tradeApi } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("Demo Trader");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password");
  const [status, setStatus] = useState("");

  return (
    <main className="auth-page">
      <section className="card auth-card">
        <Link href="/" className="brand">
          <span className="brand-mark">TX</span>
          <span>TradeX</span>
        </Link>
        <h1>Регистрация</h1>
        <p className="muted">Создайте демо-аккаунт с виртуальным балансом 25,000 USDT.</p>
        <form
          className="form"
          onSubmit={async (event) => {
            event.preventDefault();
            setStatus("Создаю демо-аккаунт...");
            try {
              await tradeApi.register(name, email || `demo-${Date.now()}@tradex.local`, password);
              setStatus("Демо-аккаунт создан");
              router.push("/dashboard");
            } catch (error) {
              setStatus(error instanceof Error ? error.message : "Ошибка регистрации");
            }
          }}
        >
          <div className="field">
            <label htmlFor="name">Имя</label>
            <input id="name" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label htmlFor="password">Пароль</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          <button className="button" type="submit">
            <UserPlus size={18} />
            Создать демо
          </button>
          <div className="toast">{status}</div>
        </form>
      </section>
    </main>
  );
}
