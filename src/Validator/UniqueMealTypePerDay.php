<?php

declare(strict_types=1);

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class UniqueMealTypePerDay extends Constraint
{
    public string $message = '同一日付で食事タイプが重複しています。{{ type }}';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
