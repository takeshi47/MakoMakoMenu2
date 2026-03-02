<?php

declare(strict_types=1);

namespace App\Tests\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Nelmio\Alice\Loader\NativeLoader;

/**
 * usages
 * php bin/console doctrine:schema:create --env=test
 * php bin/console doctrine:fixtures:load --env=test
 */
class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $loader = new NativeLoader();

        // YAMLファイルを指定
        $files = [
            __DIR__.'/../Fixtures/users.yaml',
            __DIR__.'/../Fixtures/ingredients.yaml',
            __DIR__.'/../Fixtures/menus.yaml',
        ];

        // 読み込みと保存
        $objectSet = $loader->loadFiles($files)->getObjects();
        foreach ($objectSet as $object) {
            $manager->persist($object);
        }

        $manager->flush();
    }
}
