<?php

namespace App\ValueObjects;

final readonly class Money
{
    public function __construct(public string $amount, public string $currency = 'USDT', public int $scale = 12)
    {
    }

    public static function of(string|int|float $amount, string $currency = 'USDT'): self
    {
        return new self((string) $amount, strtoupper($currency));
    }

    public function plus(self $other): self
    {
        $this->assertSameCurrency($other);

        return new self(bcadd($this->amount, $other->amount, $this->scale), $this->currency);
    }

    public function minus(self $other): self
    {
        $this->assertSameCurrency($other);

        return new self(bcsub($this->amount, $other->amount, $this->scale), $this->currency);
    }

    public function multiply(string $multiplier): self
    {
        return new self(bcmul($this->amount, $multiplier, $this->scale), $this->currency);
    }

    public function isGreaterThan(self $other): bool
    {
        $this->assertSameCurrency($other);

        return bccomp($this->amount, $other->amount, $this->scale) > 0;
    }

    public function isLessThan(self $other): bool
    {
        $this->assertSameCurrency($other);

        return bccomp($this->amount, $other->amount, $this->scale) < 0;
    }

    private function assertSameCurrency(self $other): void
    {
        if ($this->currency !== $other->currency) {
            throw new \InvalidArgumentException('Money currency mismatch.');
        }
    }
}
