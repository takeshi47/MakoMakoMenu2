<?php

declare(strict_types=1);

namespace App\Form;

use App\Criteria\DailyFetchCriteria;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class DailyFetchType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('baseDate')
            ->add('viewMode');
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => DailyFetchCriteria::class,
            'csrf_protection' => false,
        ]);
    }
}
