<?php

namespace App\Http\Requests\Trading;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'asset_id' => ['required', 'integer', 'exists:assets,id'],
            'side' => ['required', Rule::in(['buy', 'sell'])],
            'type' => ['required', Rule::in(['market'])],
            'quantity' => ['required', 'numeric', 'gt:0'],
        ];
    }
}
