<?php

declare(strict_types=1);

namespace App\Exception;

/**
 * メニューが食事に使用されている場合に投げられる例外
 */
class MenuInUseException extends \RuntimeException
{
}
