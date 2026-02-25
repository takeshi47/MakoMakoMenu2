<?php

declare(strict_types=1);

namespace App\Enum;

enum ViewMode: string
{
    case DAY = 'day';
    case WEEK = 'week';
    case MONTH = 'month';

    public function getTargetDateList(\DateTimeImmutable $baseDate): array
    {
        return match ($this) {
            self::DAY => [$baseDate->format('Y-m-d')],
            self::WEEK => $this->createWeekDateList($baseDate),
            self::MONTH => $this->createMonthDateList($baseDate),
        };
    }

    private function createWeekDateList(\DateTimeImmutable $baseDate): array
    {
        $monday = $baseDate->modify('monday this week');

        $result = [];
        for ($i = 0; $i < 7; ++$i) {
            $result[] = $monday->modify("+{$i} days")->format('Y-m-d');
        }

        return $result;
    }

    private function createMonthDateList(\DateTimeImmutable $baseDate): array
    {
        $start = $baseDate->modify('first day of this month')->modify('monday this week');
        $end = $baseDate->modify('last day of this month')->modify('sunday this week');

        $diffDay = $end->diff($start);

        $result = [];
        for ($i = 0; $i <= $diffDay->days; ++$i) {
            $result[] = $start->modify("+{$i} days")->format('Y-m-d');
        }

        return $result;
    }
}
