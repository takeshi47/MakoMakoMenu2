<?php

declare(strict_types=1);

namespace App\Form;

use App\Criteria\DailyFetchCriteria;
use App\Enum\ViewMode;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class DailyFetchType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('viewMode', EnumType::class, [
                'class' => ViewMode::class,
            ])
            ->add('baseDate', DateType::class, [
                'widget' => 'single_text',
                'input' => 'datetime_immutable',
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => DailyFetchCriteria::class,
            'csrf_protection' => false,
        ]);
    }
}
