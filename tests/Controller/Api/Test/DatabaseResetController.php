<?php

declare(strict_types=1);

namespace App\Tests\Controller\Api\Test;

use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\KernelInterface;

class DatabaseResetController extends AbstractController
{
    public function __invoke(KernelInterface $kernel): JsonResponse
    {
        if ($kernel->getEnvironment() !== 'test') {
            return new JsonResponse(['error' => 'Only available in test environment'], 403);
        }

        $application = new Application($kernel);
        $application->setAutoExit(false);

        // フィクスチャの読み込みコマンドを実行
        $input = new ArrayInput([
            'command' => 'doctrine:fixtures:load',
            '--no-interaction' => true,
            '--env' => 'test',
        ]);

        $output = new BufferedOutput();
        $application->run($input, $output);

        return new JsonResponse(['status' => 'success', 'message' => $output->fetch()]);
    }
}
