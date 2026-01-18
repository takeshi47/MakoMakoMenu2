<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class SpaController extends AbstractController
{
    public function __construct(
        #[Autowire('%kernel.project_dir%')] private readonly string $projectDir,
        #[Autowire('%kernel.environment%')] private readonly string $env,
    ) {
    }

    #[Route(path: '/login', name: 'app_login')]
    #[Route(path: '/logout', name: 'app_logout')]
    #[Route(path: '/', name: 'spa_index')]
    #[Route(path: '/{path}', name: 'spa_fallback', requirements: ['path' => '.*'], priority: -1)]
    public function index(): Response
    {
        $path = "{$this->projectDir}/public/{$this->env}/index.html";

        if (!file_exists($path)) {
            throw new \RuntimeException("SPA index.html not found: {$path}");
        }

        return new Response(file_get_contents($path));
    }
}
