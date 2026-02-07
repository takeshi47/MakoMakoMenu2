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
        switch ($dailyFetchCriteria->viewMode) {
            case 'day':
                $targetDateList = [$dailyFetchCriteria->baseDate];
                break;
            case 'week':
                $targetDateList = $this->createTargetDateList($dailyFetchCriteria->baseDate);
                break;
            default:
                // code...
                break;
        }

        $dailies = $this->dailyRepository->findByDateList($targetDateList);
        $dailyByDate = $this->indexByDate($dailies);

        $result = [];
        foreach ($targetDateList as $date) {
            $result[] = $dailyByDate[$date]
                ?? Daily::createEmpty($date);
        }

        return $result;
    }

    private function createTargetDateList(string $baseDate): array
    {
        $monday = new \DateTimeImmutable($baseDate)->modify('monday this week');

        $result = [];

        for ($i = 0; $i < 7; ++$i) {
            $result[] = $monday
                ->modify("+{$i} days")
                ->format('Y-m-d');
        }

        return $result;
    }

    private function indexByDate(array $dailies): array
    {
        $map = [];

        foreach ($dailies as $daily) {
            $map[$daily->getDate()->format('Y-m-d')] = $daily;
        }

        return $map;
    }
}
