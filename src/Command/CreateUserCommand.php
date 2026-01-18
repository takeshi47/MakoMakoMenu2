<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\User;
use App\Security\RoleManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\QuestionHelper;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\ChoiceQuestion;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:user:create',
    description: 'create new User!',
)]
class UserCreateCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
        private RoleManager $roleManager,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addOption('roles', 'r', InputOption::VALUE_REQUIRED, 'roles')
            ->addOption('displayName', 'd', InputOption::VALUE_REQUIRED, 'display name')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $helper = new QuestionHelper();

        $emailQuestion = new Question('Please enter the email: ');
        $email = $helper->ask($input, $output, $emailQuestion);

        $passwordQuestion = new Question('Please enter the password: ');
        $passwordQuestion->setHidden(true);
        $passwordQuestion->setHiddenFallback(false);
        $password = $helper->ask($input, $output, $passwordQuestion);

        if ($input->getOption('roles') === null) {
            $question = new ChoiceQuestion(
                'Please select roles',
                $this->roleManager->getParentRoles(),
            );

            $inputtedRoles[] = $helper->ask($input, $output, $question);
            $output->writeln('You have just selected: '.implode(', ', $inputtedRoles));
        } else {
            $inputtedRoles = $input->getOption('roles');
        }

        $displayName = $input->getOption('displayName');

        $user = new User();
        $user->setEmail($email);
        $user->setPlainPassword($password);
        $user->setRoles($inputtedRoles);
        $user->setDisplayName($displayName);

        // @todo:　refactoring
        // 直接EntityManagerを使用しないようにリファクタリングtet
        $this->em->persist($user);
        $this->em->flush();

        $io->success('User is created');

        return Command::SUCCESS;
    }
}
