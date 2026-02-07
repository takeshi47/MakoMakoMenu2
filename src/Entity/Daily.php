<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\DailyRepository;
use App\Validator as AcmeAssert;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

#[AcmeAssert\UniqueMealTypePerDay]
#[ORM\Entity(repositoryClass: DailyRepository::class)]
#[UniqueEntity(
    fields: ['date'],
)]
class Daily
{
    use TimestampableEntity;

    public const MEALS_MIN = 1;
    public const MEALS_MAX = 3;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, unique: true)]
    #[Assert\NotBlank()]
    private ?\DateTime $date = null;

    /**
     * @var Collection<int, Meal>
     */
    #[ORM\OneToMany(mappedBy: 'daily', targetEntity: Meal::class, cascade: ['persist'])]
    #[Assert\Valid()]
    #[Assert\Count(min: self::MEALS_MIN, max: self::MEALS_MAX)]
    private Collection $meals;

    public function __construct()
    {
        $this->meals = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?\DateTime
    {
        return $this->date;
    }

    public function setDate(?\DateTime $date): static
    {
        $this->date = $date;

        return $this;
    }

    /**
     * @return Collection<int, Meal>
     */
    public function getMeals(): Collection
    {
        return $this->meals;
    }

    public function addMeal(Meal $meal): static
    {
        if (!$this->meals->contains($meal)) {
            $this->meals->add($meal);
            $meal->setDaily($this);
        }

        return $this;
    }

    public function removeMeal(Meal $meal): static
    {
        if ($this->meals->removeElement($meal)) {
            // set the owning side to null (unless already changed)
            if ($meal->getDaily() === $this) {
                $meal->setDaily(null);
            }
        }

        return $this;
    }

    public static function createEmpty(string $date): self
    {
        $daily = new self();
        $daily->date = new \DateTime($date);

        return $daily;
    }
}
