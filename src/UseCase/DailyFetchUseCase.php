<?php

declare(strict_types=1);

namespace App\UseCase;

use App\Criteria\DailyFetchCriteria;
use App\Entity\Daily;
use App\Repository\DailyRepository;

class DailyFetchUseCase
{
    public function __construct(private DailyRepository $dailyRepository)
    {
    }

    public function fetchDailyMeals(DailyFetchCriteria $dailyFetchCriteria): array
    {
        $targetDateList = $dailyFetchCriteria->getTargetDateList();

        $dailies = $this->dailyRepository->findByDateList($targetDateList);

        $dailyMap = [];
        foreach ($dailies as $daily) {
            $dailyMap[$daily->getdate()->format('Y-m-d')] = $daily;
        }

        return array_map(fn (string $date) => $dailyMap[$date] ?? Daily::createEmpty($date), $targetDateList);
    }
}
