<?php

declare(strict_types=1);

namespace App\EntityListener;

use App\Entity\Meal;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::prePersist, entity: Meal::class)]
#[AsEntityListener(event: Events::preUpdate, entity: Meal::class)]
class MealListener
{
    private const MEAL_TYPE_ORDER = [
        Meal::BREAKFAST => 1,
        Meal::LUNCH => 2,
        Meal::DINNER => 3,
    ];

    public function prePersist(Meal $meal, PrePersistEventArgs $event): void
    {
        $this->setMealSortOrder($meal);
    }

    public function preUpdate(Meal $meal, PreUpdateEventArgs $event): void
    {
        $this->setMealSortOrder($meal);
    }

    public function setMealSortOrder(Meal $meal): void
    {
        $mealType = $meal->getMealType();

        if ($mealType) {
            $meal->setSortOrder(self::MEAL_TYPE_ORDER[$mealType]);
        } else {
            $meal->setSortOrder(99);
        }
    }
}
