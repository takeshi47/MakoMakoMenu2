<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260126101754 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE daily (id INT AUTO_INCREMENT NOT NULL, date DATE NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_8E9DAB6AAA9E377A (date), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE ingredient (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(30) NOT NULL, is_stock TINYINT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_6BAF78705E237E06 (name), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE meal (id INT AUTO_INCREMENT NOT NULL, meal_type VARCHAR(1) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, daily_id INT DEFAULT NULL, INDEX IDX_9EF68E9CE04C0193 (daily_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE meal_menu (meal_id INT NOT NULL, menu_id INT NOT NULL, INDEX IDX_67DBE967639666D6 (meal_id), INDEX IDX_67DBE967CCD7E912 (menu_id), PRIMARY KEY (meal_id, menu_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE menu (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(50) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE menu_ingredient (menu_id INT NOT NULL, ingredient_id INT NOT NULL, INDEX IDX_4A02CCA2CCD7E912 (menu_id), INDEX IDX_4A02CCA2933FE08C (ingredient_id), PRIMARY KEY (menu_id, ingredient_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE meal ADD CONSTRAINT FK_9EF68E9CE04C0193 FOREIGN KEY (daily_id) REFERENCES daily (id)');
        $this->addSql('ALTER TABLE meal_menu ADD CONSTRAINT FK_67DBE967639666D6 FOREIGN KEY (meal_id) REFERENCES meal (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE meal_menu ADD CONSTRAINT FK_67DBE967CCD7E912 FOREIGN KEY (menu_id) REFERENCES menu (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE menu_ingredient ADD CONSTRAINT FK_4A02CCA2CCD7E912 FOREIGN KEY (menu_id) REFERENCES menu (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE menu_ingredient ADD CONSTRAINT FK_4A02CCA2933FE08C FOREIGN KEY (ingredient_id) REFERENCES ingredient (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE meal DROP FOREIGN KEY FK_9EF68E9CE04C0193');
        $this->addSql('ALTER TABLE meal_menu DROP FOREIGN KEY FK_67DBE967639666D6');
        $this->addSql('ALTER TABLE meal_menu DROP FOREIGN KEY FK_67DBE967CCD7E912');
        $this->addSql('ALTER TABLE menu_ingredient DROP FOREIGN KEY FK_4A02CCA2CCD7E912');
        $this->addSql('ALTER TABLE menu_ingredient DROP FOREIGN KEY FK_4A02CCA2933FE08C');
        $this->addSql('DROP TABLE daily');
        $this->addSql('DROP TABLE ingredient');
        $this->addSql('DROP TABLE meal');
        $this->addSql('DROP TABLE meal_menu');
        $this->addSql('DROP TABLE menu');
        $this->addSql('DROP TABLE menu_ingredient');
    }
}
