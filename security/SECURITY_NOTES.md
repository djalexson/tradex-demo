# Security notes

## Для MVP обязательно

- Sanctum auth
- CSRF защита
- Rate limit на auth и orders
- 2FA можно сделать как UI-заглушку
- Audit log для admin actions
- User blocking
- Validation на все request
- Decimal вместо float
- Server-side проверка баланса перед сделкой
- Нельзя доверять цене с frontend
- Все цены брать из backend quote service

## Для реального продукта позже

- KYC/AML
- Лицензии и юристы
- Настоящий custody/wallet provider
- Broker API
- Anti-fraud
- Proof of reserves
- Penetration test
- Monitoring
- Backup strategy
- Disaster recovery
