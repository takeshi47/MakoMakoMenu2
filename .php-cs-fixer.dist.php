<?php

declare(strict_types=1);

$finder = PhpCsFixer\Finder::create()
    ->in(__DIR__.'/src')
    // ->in(__DIR__.'/tests')
;

return new PhpCsFixer\Config()
    ->setRiskyAllowed(true)
    ->setRules([
        '@PSR12' => true,
        '@Symfony' => true,
        'yoda_style' => false,
        'strict_param' => true,
        'declare_strict_types' => true,
        'return_type_declaration' => true,
    ])
    ->setFinder($finder);
