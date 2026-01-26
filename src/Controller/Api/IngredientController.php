<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\Ingredient;
use App\Form\IngredientType;
use App\Repository\IngredientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

#[Route('/ingredient', name: 'ingredient_')]
final class IngredientController extends AbstractController
{
    #[Route(name: '', methods: ['GET'])]
    public function index(IngredientRepository $ingredientRepository): Response
    {
        return $this->json($ingredientRepository->findAll());
    }

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $ingredient = new Ingredient();
        $form = $this->createForm(IngredientType::class, $ingredient);

        $data = json_decode($request->getContent(), true);
        $form->submit($data);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($ingredient);
            $entityManager->flush();

            return new Response(null, Response::HTTP_CREATED);
        }

        return $this->json($this->getErrorsFromForm($form), Response::HTTP_BAD_REQUEST);
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

    #[Route(path: '/csrf-token', name: 'csrf_token', methods: ['GET'])]
    public function getCsrfToken(CsrfTokenManagerInterface $csrfTokenManager): Response
    {
        $token = $csrfTokenManager->getToken('ingredient')->getValue();

        return $this->json(['token' => $token]);
    }

    // #[Route('/{id}', name: 'show', methods: ['GET'])]
    // public function show(Ingredient $ingredient): Response
    // {
    //     return $this->render('ingredient/show.html.twig', [
    //         'ingredient' => $ingredient,
    //     ]);
    // }

    // #[Route('/{id}/edit', name: 'edit', methods: ['GET', 'POST'])]
    // public function edit(Request $request, Ingredient $ingredient, EntityManagerInterface $entityManager): Response
    // {
    //     $form = $this->createForm(IngredientType::class, $ingredient);
    //     $form->handleRequest($request);

    //     if ($form->isSubmitted() && $form->isValid()) {
    //         $entityManager->flush();

    //         return $this->redirectToRoute('index', [], Response::HTTP_SEE_OTHER);
    //     }

    //     return $this->render('ingredient/edit.html.twig', [
    //         'ingredient' => $ingredient,
    //         'form' => $form,
    //     ]);
    // }

    // #[Route('/{id}', name: 'delete', methods: ['POST'])]
    // public function delete(Request $request, Ingredient $ingredient, EntityManagerInterface $entityManager): Response
    // {
    //     if ($this->isCsrfTokenValid('delete'.$ingredient->getId(), $request->getPayload()->getString('_token'))) {
    //         $entityManager->remove($ingredient);
    //         $entityManager->flush();
    //     }

    //     return $this->redirectToRoute('index', [], Response::HTTP_SEE_OTHER);
    // }
}
