<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\IngredientRepository;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;

#[ORM\Entity(repositoryClass: IngredientRepository::class)]
class Ingredient
{
    use TimestampableEntity;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 30, unique: true)]
    private ?string $name = null;

    #[ORM\Column]
    private ?bool $isStock = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function isStock(): ?bool
    {
        return $this->isStock;
    }

    public function setIsStock(bool $isStock): static
    {
        $this->isStock = $isStock;

        return $this;
    }
}
