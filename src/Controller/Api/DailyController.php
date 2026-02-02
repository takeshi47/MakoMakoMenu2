<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\Daily;
use App\Form\DailyType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/daily', name: 'daily_')]
final class DailyController extends AbstractController
{
    use ApiControllerTrait;

    #[Route('/create', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): Response
    {
        $daily = new Daily();
        $form = $this->createForm(DailyType::class, $daily);

        $data = json_decode($request->getContent(), true);
        $form->submit($data);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($daily);
            $entityManager->flush();

            return new Response();
        }

        return $this->json($this->getErrorsFromForm($form));
    }
}
