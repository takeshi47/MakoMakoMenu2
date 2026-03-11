<?php

declare(strict_types=1);

namespace App\UseCase;

use App\Entity\Menu;
use App\Exception\MenuInUseException;
use Doctrine\ORM\EntityManagerInterface;

class MenuDeleteUseCase
{
    public function __construct(private EntityManagerInterface $entityManager)
    {
    }

    /**
     * Menuを削除するUseCase.
     *
     * @param Menu $menu
     *
     * @throws MenuInUseException 使用中で削除不可の場合
     */
    public function delete(Menu $menu): void
    {
        $menuRepository = $this->entityManager->getRepository(Menu::class);
        if ($menuRepository->isUsedInAnyMeal($menu)) {
            throw new MenuInUseException('このメニューは食事に使用されているため削除できません。');
        }

        $this->entityManager->remove($menu);
        $this->entityManager->flush();
    }
}
