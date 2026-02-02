<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\Meal;
use App\Entity\Menu;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MealType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('mealType', TextType::class)
            ->add('menu', EntityType::class, [
                'class' => Menu::class,
                'choice_value' => 'id',
                'multiple' => true,
                'expanded' => false,
            ]);

        $builder->get('menu')->addEventListener(
            FormEvents::PRE_SUBMIT,
            [$this, 'onPreSubmitMenu'],
            // Symfonyの内部リスナーより高い優先度を設定 (Frontendから [null] が送信された場合にエラーとなるため)
            1
        );
    }

    public function onPreSubmitMenu(FormEvent $event): void
    {
        $data = $event->getData();
        // フロントエンドから [null] という値が送られてくる場合を考慮
        if (null === $data || [null] === $data) {
            $event->setData([]);
        }
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Meal::class,
            'csrf_protection' => false,
        ]);
    }
}
