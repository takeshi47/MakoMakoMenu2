<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\User;
use App\Form\UserType;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

#[Route(path: '/user', name: 'user_')]
final class UserController extends AbstractController
{
    use ApiControllerTrait;

    #[Route(name: 'index', methods: ['GET'])]
    public function index(UserRepository $userRepository): Response
    {
        return $this->json($userRepository->findAll(), context: ['groups' => 'user:read']);
    }

    #[Route(path: '/{id}', name: 'fetch', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function fetchUser(User $user): Response
    {
        return $this->json($user, context: ['groups' => 'user:read']);
    }

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $user = new User();
        $form = $this->createForm(UserType::class, $user, [
            'validation_groups' => ['Default', 'registration'],
        ]);

        $data = json_decode($request->getContent(), true);
        $form->submit($data);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($user);
            $entityManager->flush();

            // todo: csrfTokenの削除処理

            return $this->json(null, Response::HTTP_CREATED);
        }

        $errors = $this->getErrorsFromForm($form);

        return $this->json($errors, Response::HTTP_BAD_REQUEST);
    }

    #[Route(path: '/{id}', name: 'edit', methods: ['POST'])]
    public function edit(Request $request, User $user, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(UserType::class, $user, [
            'validation_groups' => ['Default', 'edit'],
        ]);

        $data = json_decode($request->getContent(), true);
        $form->submit($data);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($user);
            $entityManager->flush();

            return $this->json(null, Response::HTTP_CREATED);
        }

        $errors = $this->getErrorsFromForm($form);

        return $this->json($errors, Response::HTTP_BAD_REQUEST);
    }

    // #[Route(path: '/csrf-token', name: 'csrf_token', methods: ['GET'])]
    // public function getCsrfToken(CsrfTokenManagerInterface $csrfTokenManager): Response
    // {
    //     $token = $csrfTokenManager->getToken('user')->getValue();

    //     return $this->json(['token' => $token]);
    // }

    // #[Route(path: '/csrf-token/delete/{id}', name: 'csrf_token_delete', methods: ['GET'])]
    // public function getCsrfTokenDelete(CsrfTokenManagerInterface $csrfTokenManager, int $id): Response
    // {
    //     $token = $csrfTokenManager->getToken('delete_user'.$id)->getValue();

    //     return $this->json(['token' => $token]);
    // }

    // #[Route('/{id}', name: 'app_user_show', methods: ['GET'])]
    // public function show(User $user): Response
    // {
    //     return $this->render('user/show.html.twig', [
    //         'user' => $user,
    //     ]);
    // }

    // #[Route('/{id}/edit', name: 'app_user_edit', methods: ['GET', 'POST'])]
    // public function edit(Request $request, User $user, EntityManagerInterface $entityManager): Response
    // {
    //     $form = $this->createForm(UserType::class, $user);
    //     $form->handleRequest($request);

    //     if ($form->isSubmitted() && $form->isValid()) {
    //         $entityManager->flush();

    //         return $this->redirectToRoute('app_user_index', [], Response::HTTP_SEE_OTHER);
    //     }

    //     return $this->render('user/edit.html.twig', [
    //         'user' => $user,
    //         'form' => $form,
    //     ]);
    // }

    #[Route('/{id}', name: 'user_delete', methods: ['DELETE'])]
    public function delete(Request $request, User $user, EntityManagerInterface $entityManager): Response
    {
        $submittedToken = $request->headers->get('X-CSRF-TOKEN');

        if (!$this->isCsrfTokenValid('user_delete_'.$user->getId(), $submittedToken)) {
            return $this->json(['error' => 'Invalid CSRF token.'], Response::HTTP_FORBIDDEN);
        }

        $entityManager->remove($user);
        $entityManager->flush();

        return new Response();
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
