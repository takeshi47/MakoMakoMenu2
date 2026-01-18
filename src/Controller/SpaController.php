<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class SpaController extends AbstractController
{
    #[Route('/', name: 'spa_index')]
    #[Route('/{path}', name: 'spa_fallback', requirements: ['path' => '.*'])]
    public function index(): Response
    {
        $path = __DIR__.'/../../public/dev/index.html';

        return new Response(file_get_contents($path));
    }
}
