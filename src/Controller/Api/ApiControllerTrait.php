<?php

declare(strict_types=1);

namespace App\Controller\Api;

use Symfony\Component\Form\FormInterface;
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

    private function getErrorsFromForm(FormInterface $form): array
    {
        $errors = [];

        // 1. 現在のフォーム/フィールド自身に紐づくグローバルなエラーを取得
        foreach ($form->getErrors() as $error) {
            $errors[] = $error->getMessage(); // エラーメッセージを配列に追加
        }

        // 2. 各子フィールドのエラーを再帰的に取得
        foreach ($form->all() as $childForm) {
            // 子フォームに対して自分自身（getErrorsFromForm）を再帰的に呼び出す
            if ($childErrors = $this->getErrorsFromForm($childForm)) {
                // 子フォームからエラーが返された場合、その子フォームの名前をキーとしてエラー配列に格納
                $errors[$childForm->getName()] = $childErrors;
            }
        }

        return $errors; // 整形されたエラー配列を返す
    }
}
