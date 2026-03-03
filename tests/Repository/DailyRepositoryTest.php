<?php

declare(strict_types=1);

namespace App\Tests\Repository;

use App\Entity\Daily;
use App\Repository\DailyRepository;
use App\Tests\DataFixtures\AppFixtures;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class DailyRepositoryTest extends KernelTestCase
{
    protected AbstractDatabaseTool $databaseTool;
    private DailyRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        self::bootKernel();

        $this->databaseTool = self::getContainer()->get(DatabaseToolCollection::class)->get();
        $this->repository = self::getContainer()->get('doctrine')->getRepository(Daily::class);

        // AppFixturesクラスを使用して全データをロード
        $this->databaseTool->loadFixtures([
            AppFixtures::class,
        ]);
    }

    /**
     * 指定した日付リストに含まれるDailyエンティティが取得できることをテスト.
     */
    public function testFindByDateListReturnsCorrectEntities(): void
    {
        $targetDates = [
            '2026-03-01',
            '2026-03-03',
        ];

        $result = $this->repository->findByDateList($targetDates);

        $this->assertCount(2, $result);

        $dates = array_map(fn (Daily $d) => $d->getDate()->format('Y-m-d'), $result);
        $this->assertContains('2026-03-01', $dates);
        $this->assertContains('2026-03-03', $dates);
        $this->assertNotContains('2026-03-02', $dates);

        // 各Dailyに紐づく食事(Meal)もロードされているか確認
        foreach ($result as $daily) {
            $this->assertCount(3, $daily->getMeals());
        }
    }

    /**
     * 存在しない日付を指定した場合、空の配列が返ることをテスト.
     */
    public function testFindByDateListReturnsEmptyWhenNoMatch(): void
    {
        $targetDates = ['2099-01-01'];

        $result = $this->repository->findByDateList($targetDates);

        $this->assertCount(0, $result);
        $this->assertIsArray($result);
    }

    /**
     * 空の配列を渡した場合、即座に空の配列が返ることをテスト.
     */
    public function testFindByDateListReturnsEmptyWhenInputIsEmpty(): void
    {
        $result = $this->repository->findByDateList([]);

        $this->assertCount(0, $result);
        $this->assertIsArray($result);
    }
}
