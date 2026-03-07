<?php

declare(strict_types=1);

namespace App\Tests\Entity;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Validator\ConstraintViolationListInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UserEntityTest extends KernelTestCase
{
    private ValidatorInterface $validator;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->validator = self::getContainer()->get('validator');
    }

    /**
     * 指定したプロパティ名のエラーが含まれているか検証するヘルパー
     */
    private function assertHasViolation(ConstraintViolationListInterface $violations, string $propertyPath): void
    {
        $paths = [];
        foreach ($violations as $violation) {
            $paths[] = $violation->getPropertyPath();
        }
        $this->assertContains($propertyPath, $paths, sprintf('Property path "%s" not found in violations: %s', $propertyPath, implode(', ', $paths)));
    }

    public function testInvalidEmailFormat(): void
    {
        $user = new User();
        $user->setEmail('invalid-email-address');
        $user->setRoles(['ROLE_USER']);

        $violations = $this->validator->validate($user);
        $this->assertHasViolation($violations, 'email');
    }

    public function testShortPasswordIsInvalid(): void
    {
        $user = new User();
        $user->setEmail('test@example.com');
        $user->setRoles(['ROLE_USER']);
        $user->setPlainPassword('short'); // 8文字未満

        $violations = $this->validator->validate($user, null, ['Default']);
        $this->assertHasViolation($violations, 'plainPassword');
    }

    public function testLongDisplayNameIsInvalid(): void
    {
        $user = new User();
        $user->setEmail('test@example.com');
        $user->setRoles(['ROLE_USER']);
        $user->setDisplayName(str_repeat('a', 21)); // 20文字超

        $violations = $this->validator->validate($user, null, ['Default']);
        $this->assertHasViolation($violations, 'displayName');
    }
}
