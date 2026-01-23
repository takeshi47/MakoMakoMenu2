<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\User;
use App\Security\RoleManager;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType
{
    public function __construct(private RoleManager $roleManager)
    {
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('email')
            ->add('role', ChoiceType::class, [
                'choices' => $this->roleManager->getParentRoles(),
                'multiple' => false, // 複数選択不可
            ])
            ->add('plainPassword', RepeatedType::class, [
                'invalid_message' => 'The password fields must match.',
            ])
            ->add('displayName')
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
