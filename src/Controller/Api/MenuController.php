<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\Menu;
use App\Form\MenuType;
use App\Repository\MenuRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/menu', name: 'menu_')]
final class MenuController extends AbstractController
{
    use ApiControllerTrait;

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

    #[Route(name: 'fetch_all', methods: ['GET'])]
    public function fetchAll(MenuRepository $menuRepository): Response
    {
        return $this->json($menuRepository->findAll());
    }

    #[Route(path: '/{id}', name: 'update', methods: ['PUT'], requirements: ['id' => '\d+'])]
    public function update(Request $request, Menu $menu, EntityManagerInterface $entityManager): Response
    {
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

    #[Route(path: '/{id}', name: 'fetch', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function fetch(Menu $menu): Response
    {
        return $this->json($menu);
    }

    #[Route(path: '/delete/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(Request $request, Menu $menu, EntityManagerInterface $entityManager): Response
    {
        $submittedToken = $request->headers->get('X-CSRF-TOKEN');

        if (!$this->isCsrfTokenValid('menu_delete_'.$menu->getId(), $submittedToken)) {
            return $this->json(['error' => 'Invalid CSRF TOKEN'], Response::HTTP_BAD_REQUEST);
        }

        $entityManager->remove($menu);
        $entityManager->flush();

        return new Response();
    }
}
