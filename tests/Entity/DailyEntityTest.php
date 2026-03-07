<?php

declare(strict_types=1);

namespace App\Tests\Entity;

use App\Entity\Daily;
use App\Entity\Meal;
use App\Entity\Menu;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Validator\Constraints\Count;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class DailyEntityTest extends KernelTestCase
{
    private ValidatorInterface $validator;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->validator = self::getContainer()->get('validator');
    }

    public function testDailyWithBelowMinMealsIsInvalid(): void
    {
        $daily = new Daily();
        $daily->setDate(new \DateTime('2026-03-01'));

        // 最小数(1)を下回る0件の状態
        $violations = $this->validator->validate($daily);

        $this->assertGreaterThan(0, count($violations));

        $mealsViolation = null;
        foreach ($violations as $violation) {
            if ($violation->getPropertyPath() === 'meals') {
                $mealsViolation = $violation;
                break;
            }
        }

        $this->assertNotNull($mealsViolation, 'Violation for "meals" property not found.');
        $this->assertInstanceOf(Count::class, $mealsViolation->getConstraint());
    }

    public function testDailyWithExceededMaxMealsIsInvalid(): void
    {
        $daily = new Daily();
        $daily->setDate(new \DateTime('2026-03-01'));

        // 最大数(3)を超える4件の食事を追加
        for ($i = 0; $i < Daily::MEALS_MAX + 1; ++$i) {
            $meal = new Meal();
            $meal->setMealType(Meal::MEAL_TYPE_CHOICES[$i % 3]);
            $meal->addMenu(new Menu());
            $daily->addMeal($meal);
        }

        $violations = $this->validator->validate($daily);
        $this->assertGreaterThan(0, count($violations));
        $this->assertSame('daily', $violations[0]->getPropertyPath());
    }

    public function testDailyWithDuplicateMealTypesIsInvalid(): void
    {
        $daily = new Daily();
        $daily->setDate(new \DateTime('2026-03-01'));

        // 朝食を2つ追加
        for ($i = 0; $i < 2; ++$i) {
            $meal = new Meal();
            $meal->setMealType(Meal::BREAKFAST);
            $meal->addMenu(new Menu());
            $daily->addMeal($meal);
        }

        $violations = $this->validator->validate($daily);
        $this->assertGreaterThan(0, count($violations));
        // カスタムバリデータのエラーはクラスレベル（パス空）になる
        $this->assertStringContainsString('重複', $violations[0]->getMessage());
    }
}
