<?php

declare(strict_types=1);

namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

trait ApiControllerTrait
{
    #[Route(path: '/csrf-token/{tokenId}', name: 'csrf_token', methods: ['GET'])]
    public function getCsrfToken(string $tokenId, CsrfTokenManagerInterface $csrfTokenManager): Response
    {
        $token = $csrfTokenManager->getToken($tokenId)->getValue();

        return $this->json(['token' => $token]);
    }

    private function clearCsrfToken(string $tokenId): void
    {
        // /todo
    }
}
