<?php

namespace App\ValueObjects;

final readonly class DecimalValue
{
    public function __construct(public string $value, public int $scale = 12)
    {
    }

    public static function from(string|int|float $value, int $scale = 12): self
    {
        return new self((string) $value, $scale);
    }

    public function plus(self $other): self
    {
        return new self(bcadd($this->value, $other->value, $this->scale), $this->scale);
    }

    public function minus(self $other): self
    {
        return new self(bcsub($this->value, $other->value, $this->scale), $this->scale);
    }

    public function multiply(self|string $other): self
    {
        $value = $other instanceof self ? $other->value : $other;

        return new self(bcmul($this->value, $value, $this->scale), $this->scale);
    }

    public function isGreaterThan(self $other): bool
    {
        return bccomp($this->value, $other->value, $this->scale) > 0;
    }

    public function isLessThan(self $other): bool
    {
        return bccomp($this->value, $other->value, $this->scale) < 0;
    }
}
