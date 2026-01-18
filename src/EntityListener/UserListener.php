<?php

declare(strict_types=1);

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PreFlushEventArgs;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsEntityListener(event: Events::preFlush, entity: User::class)]
class UserListener
{
    public function __construct(private UserPasswordHasherInterface $encoder)
    {
    }

    public function postLoad(User $user, LifecycleEventArgs $event)
    {
    }

    public function preFlush(User $user, PreFlushEventArgs $event)
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
