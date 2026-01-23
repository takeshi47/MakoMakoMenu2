<?php

declare(strict_types=1);

namespace App\EntityListener;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Events;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsEntityListener(event: Events::prePersist, entity: User::class)]
#[AsEntityListener(event: Events::preUpdate, entity: User::class)]
class UserListener
{
    public function __construct(private UserPasswordHasherInterface $encoder)
    {
    }

    // prePersistイベント用のメソッド
    public function prePersist(User $user, PrePersistEventArgs $event): void
    {
        $this->hashPassword($user);
    }

    // preUpdateイベント用のメソッド
    public function preUpdate(User $user, PreUpdateEventArgs $event): void
    {
        $this->hashPassword($user);
    }

    private function hashPassword(User $user): void
    {
        if ($user->getPlainPassword()) {
            $user->setPassword($this->encoder->hashPassword($user, $user->getPlainPassword()));

            $user->setPlainPassword(null);
        }
    }
}
