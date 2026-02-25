<?php

declare(strict_types=1);

namespace App\Criteria;

use App\Enum\ViewMode;

class DailyFetchCriteria
{
    public \DateTimeImmutable $baseDate;
    public ViewMode $viewMode;

    /**
     * @return string[]
     */
    public function getTargetDateList(): array
    {
        return $this->viewMode->getTargetDateList($this->baseDate);
    }
}
