<?php

declare(strict_types=1);

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

class SecurityController extends AbstractController
{
    #[Route('/login/csrf-token', methods: ['GET'])]
    public function csrf(CsrfTokenManagerInterface $csrf): JsonResponse
    {
        return $this->json([
            'token' => $csrf->getToken('authenticate')->getValue(),
        ]);
    }

    #[Route('/me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        return $this->json($this->getUser());
    }
}
