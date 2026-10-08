import { AppShell } from "@/components/layout/AppShell";

export default function SettingsPage() {
  return (
    <AppShell title="Настройки">
      <section className="market-grid" style={{ marginTop: 16 }}>
        <div className="card" style={{ padding: 18 }}>
          <h2>Профиль</h2>
          <div className="form">
            <div className="field">
              <label>Email</label>
              <input defaultValue="trader@tradex.local" />
            </div>
            <div className="field">
              <label>Статус KYC</label>
              <input defaultValue="Demo verified" />
            </div>
            <button className="button" type="button">Сохранить</button>
          </div>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <h2>Безопасность</h2>
          <div className="grid">
            {["2FA enabled", "Audit logs active", "Withdrawal disabled for demo", "Risk limit: conservative"].map((item) => (
              <div className="panel row" style={{ padding: 12 }} key={item}>
                <span>{item}</span>
                <strong className="positive">On</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
