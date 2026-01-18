<?php

declare(strict_types=1);

namespace App\Security;

use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Role\RoleHierarchyInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class RoleManager
{
    public function __construct(
        private Security $security,
        private RoleHierarchyInterface $roleHierarchy,
        private array $rawRoleHierarchy,
    ) {
    }

    /**
     * @note: 指定ユーザー、または現在ログイン中ユーザーの「到達可能な親ロール」を返す。
     */
    public function getReachableParentRoles(?UserInterface $user = null): array
    {
        $targetUser = $user ?? $this->security->getUser();
        if (!$targetUser) {
            return [];
        }

        $reachableRoles = $this->roleHierarchy->getReachableRoleNames($targetUser->getRoles());

        return array_values(array_intersect($this->getParentRoles(), $reachableRoles));
    }

    /**
     * ユーザーが targetRole の権限を持っているかチェック。
     */
    public function isGranted(UserInterface $user, string $targetRole): bool
    {
        $reachableRoles = $this->roleHierarchy->getReachableRoleNames($user->getRoles());

        return in_array($targetRole, $reachableRoles, true);
    }

    public function getParentRoles(): array
    {
        return array_keys($this->rawRoleHierarchy);
    }

    // private function collectAllRoles(array $hierarchy): array
    // {
    //     $roles = [];

    //     foreach ($hierarchy as $parent => $children) {
    //         $roles[] = $parent;

    //         foreach ($children as $child) {
    //             $roles[] = $child;
    //         }
    //     }

    //     // 重複を削除し、インデックスを詰める
    //     return array_values(array_unique($roles));
    // }
}
