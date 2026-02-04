<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\Meal;
use App\Entity\Menu;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;

class MealType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('mealType', TextType::class)
            ->add('menu', CollectionType::class, [
                'entry_type' => EntityType::class,
                'entry_options' => [
                    'class' => Menu::class,
                    'constraints' => [
                        // 個々のメニューにバリデーション
                        new Assert\NotBlank(message: 'メニューは空にできません。'),
                    ],
                ],
                'allow_add' => true,
                'allow_delete' => true,
                'by_reference' => false,
                // 子要素のエラーをバブルさせない
                'error_bubbling' => false,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Meal::class,
        ]);
    }
}
