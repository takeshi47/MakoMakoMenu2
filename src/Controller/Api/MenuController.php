<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\Menu;
use App\Form\MenuType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

#[Route('/menu', name: 'menu_')]
final class MenuController extends AbstractController
{
    // #[Route(name: 'app_menu_index', methods: ['GET'])]
    // public function index(MenuRepository $menuRepository): Response
    // {
    //     return $this->render('menu/index.html.twig', [
    //         'menus' => $menuRepository->findAll(),
    //     ]);
    // }

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $menu = new Menu();
        $form = $this->createForm(MenuType::class, $menu);

        $data = json_decode($request->getContent(), true);
        $form->submit($data);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($menu);
            $entityManager->flush();

            return new Response(null, Response::HTTP_CREATED);
        }

        return $this->json($this->getErrorsFromForm($form), Response::HTTP_BAD_REQUEST);
    }

    #[Route(path: '/csrf-token', name: 'csrf_token', methods: ['GET'])]
    public function getCsrfToken(CsrfTokenManagerInterface $csrfTokenManager): Response
    {
        $token = $csrfTokenManager->getToken('menu')->getValue();

        return $this->json(['token' => $token]);
    }

    private function getErrorsFromForm(FormInterface $form): array
    {
        $errors = [];

        foreach ($form->getErrors() as $error) {
            $errors[] = $error->getMessage();
        }

        foreach ($form->all() as $childForm) {
            if ($childErrors = $this->getErrorsFromForm($childForm)) {
                $errors[$childForm->getName()] = $childErrors;
            }
        }

        return $errors;
    }

    // #[Route('/{id}', name: 'app_menu_show', methods: ['GET'])]
    // public function show(Menu $menu): Response
    // {
    //     return $this->render('menu/show.html.twig', [
    //         'menu' => $menu,
    //     ]);
    // }

    // #[Route('/{id}/edit', name: 'app_menu_edit', methods: ['GET', 'POST'])]
    // public function edit(Request $request, Menu $menu, EntityManagerInterface $entityManager): Response
    // {
    //     $form = $this->createForm(MenuType::class, $menu);
    //     $form->handleRequest($request);

    //     if ($form->isSubmitted() && $form->isValid()) {
    //         $entityManager->flush();

    //         return $this->redirectToRoute('app_menu_index', [], Response::HTTP_SEE_OTHER);
    //     }

    //     return $this->render('menu/edit.html.twig', [
    //         'menu' => $menu,
    //         'form' => $form,
    //     ]);
    // }

    // #[Route('/{id}', name: 'app_menu_delete', methods: ['POST'])]
    // public function delete(Request $request, Menu $menu, EntityManagerInterface $entityManager): Response
    // {
    //     if ($this->isCsrfTokenValid('delete'.$menu->getId(), $request->getPayload()->getString('_token'))) {
    //         $entityManager->remove($menu);
    //         $entityManager->flush();
    //     }

    //     return $this->redirectToRoute('app_menu_index', [], Response::HTTP_SEE_OTHER);
    // }
}
