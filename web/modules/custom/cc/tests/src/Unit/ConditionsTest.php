<?php

namespace Drupal\Tests\cc\Unit;

use Drupal\cc\Conditions;
use Drupal\Tests\UnitTestCase;

/**
 * Unit test coverate.
 *
 * @coversDefaultClass \Drupal\cc\Conditions
 *
 * @group cc
 */
class ConditionsTest extends UnitTestCase {

  /**
   * Testing eval.
   *
   * @covers ::eval
   * @dataProvider evalDataProvider
   * @throws \Exception
   */
  public function testEval($op, $conditions, $user_input, $expected) {
    $condition = new Conditions($op, $conditions);
    $this->assertSame($expected, $condition->eval($user_input));
  }

  /**
   * Data provider for testEval().
   */
  public function evalDataProvider() {
    $condition_0_true = [
      'id' => 0,
      'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
      'value' => [
        'item_0' => 'item_0',
      ],
    ];
    $condition_0_false = [
      'id' => 0,
      'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
      'value' => [
        'item_0' => 'item_0',
      ],
    ];
    $condition_1_true = [
      'id' => 1,
      'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
      'value' => [
        'item_0' => 'item_0',
      ],
    ];
    $condition_1_false = [
      'id' => 1,
      'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
      'value' => [
        'item_0' => 'item_0',
      ],
    ];
    $values = [
      0 => [
        'item_0' => 0,
      ],
      1 => [
        'item_0' => 'item_0',
      ],
    ];
    return [
      // No conditions.
      [
        Conditions::OPERATOR_AND,
        [],
        $values,
        TRUE,
      ],
      [
        Conditions::OPERATOR_OR,
        [],
        $values,
        TRUE,
      ],
      // AND.
      [
        Conditions::OPERATOR_AND,
        [
          $condition_0_true,
          $condition_1_true,
        ],
        $values,
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          $condition_0_true,
          $condition_1_false,
        ],
        $values,
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          $condition_0_false,
          $condition_1_false,
        ],
        $values,
        FALSE,
      ],
      // OR.
      [
        Conditions::OPERATOR_OR,
        [
          $condition_0_true,
          $condition_1_true,
        ],
        $values,
        TRUE,
      ],
      [
        Conditions::OPERATOR_OR,
        [
          $condition_0_true,
          $condition_1_false,
        ],
        $values,
        TRUE,
      ],
      [
        Conditions::OPERATOR_OR,
        [
          $condition_0_false,
          $condition_1_false,
        ],
        $values,
        FALSE,
      ],
    ];
  }

  /**
   * Testing evalCondition.
   *
   * @covers ::evalCondition
   * @dataProvider evalDataConditionProvider
   * @throws \Exception
   */
  public function testEvalCondition($op, $conditions, $user_input, $expected) {
    $condition = new Conditions($op, $conditions);
    $this->assertSame($expected, $condition->eval($user_input));
  }

  /**
   * Data provider for testEval().
   */
  public function evalDataConditionProvider() {
    return [
      // None of.
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
            'value' => [
              'item_0' => 'item_0',
              'item_1' => 'item_1',
              'item_2' => 'item_2',
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 'item_0',
            'item_1' => 'item_1',
            'item_2' => 'item_2',
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
            'value' => [
              'item_0' => 'item_0',
              'item_1' => 'item_1',
              'item_2' => 'item_2',
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 0,
            'item_1' => 0,
            'item_2' => 0,
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
            'value' => [
              'item_0' => 0,
              'item_1' => 0,
              'item_2' => 0,
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 'item_0',
            'item_1' => 'item_1',
            'item_2' => 'item_2',
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
            'value' => [
              'item_0' => 0,
              'item_1' => 0,
              'item_2' => 0,
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 0,
            'item_1' => 0,
            'item_2' => 0,
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
            'value' => [
              'item_0' => 0,
              'item_1' => 'item_1',
              'item_2' => 0,
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 0,
            'item_1' => 'item_1',
            'item_2' => 0,
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
            'value' => [
              'item_0' => 'item_0',
              'item_1' => 0,
              'item_2' => 'item_2',
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 0,
            'item_1' => 'item_1',
            'item_2' => 0,
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
            'value' => [
              'item_0' => 0,
              'item_1' => 'item_1',
              'item_2' => 0,
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 'item_0',
            'item_1' => 0,
            'item_2' => 'item_2',
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
            'value' => [
              'item_0' => 'item_0',
              'item_1' => 0,
              'item_2' => 'item_2',
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 'item_0',
            'item_1' => 0,
            'item_2' => 'item_2',
          ],
        ],
        FALSE,
      ],
      // One of.
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
            'value' => [
              'item_0' => 'item_0',
              'item_1' => 'item_1',
              'item_2' => 'item_2',
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 'item_0',
            'item_1' => 'item_1',
            'item_2' => 'item_2',
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
            'value' => [
              'item_0' => 'item_0',
              'item_1' => 'item_1',
              'item_2' => 'item_2',
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 0,
            'item_1' => 0,
            'item_2' => 0,
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
            'value' => [
              'item_0' => 0,
              'item_1' => 0,
              'item_2' => 0,
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 'item_0',
            'item_1' => 'item_1',
            'item_2' => 'item_2',
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
            'value' => [
              'item_0' => 0,
              'item_1' => 0,
              'item_2' => 0,
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 0,
            'item_1' => 0,
            'item_2' => 0,
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
            'value' => [
              'item_0' => 0,
              'item_1' => 'item_1',
              'item_2' => 0,
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 0,
            'item_1' => 'item_1',
            'item_2' => 0,
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
            'value' => [
              'item_0' => 'item_0',
              'item_1' => 0,
              'item_2' => 'item_2',
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 0,
            'item_1' => 'item_1',
            'item_2' => 0,
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
            'value' => [
              'item_0' => 0,
              'item_1' => 'item_1',
              'item_2' => 0,
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 'item_0',
            'item_1' => 0,
            'item_2' => 'item_2',
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
            'value' => [
              'item_0' => 'item_0',
              'item_1' => 0,
              'item_2' => 'item_2',
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 'item_0',
            'item_1' => 0,
            'item_2' => 'item_2',
          ],
        ],
        TRUE,
      ],
      // All of.
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_ALL_OF,
            'value' => [
              'item_0' => 'item_0',
              'item_1' => 'item_1',
              'item_2' => 'item_2',
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 'item_0',
            'item_1' => 'item_1',
            'item_2' => 'item_2',
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_ALL_OF,
            'value' => [
              'item_0' => 'item_0',
              'item_1' => 'item_1',
              'item_2' => 'item_2',
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 0,
            'item_1' => 0,
            'item_2' => 0,
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_ALL_OF,
            'value' => [
              'item_0' => 0,
              'item_1' => 0,
              'item_2' => 0,
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 'item_0',
            'item_1' => 'item_1',
            'item_2' => 'item_2',
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_ALL_OF,
            'value' => [
              'item_0' => 0,
              'item_1' => 0,
              'item_2' => 0,
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 0,
            'item_1' => 0,
            'item_2' => 0,
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_ALL_OF,
            'value' => [
              'item_0' => 0,
              'item_1' => 'item_1',
              'item_2' => 0,
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 0,
            'item_1' => 'item_1',
            'item_2' => 0,
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_ALL_OF,
            'value' => [
              'item_0' => 'item_0',
              'item_1' => 0,
              'item_2' => 'item_2',
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 0,
            'item_1' => 'item_1',
            'item_2' => 0,
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_ALL_OF,
            'value' => [
              'item_0' => 0,
              'item_1' => 'item_1',
              'item_2' => 0,
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 'item_0',
            'item_1' => 0,
            'item_2' => 'item_2',
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 0,
            'operator' => Conditions::CONDITION_OPERATOR_ALL_OF,
            'value' => [
              'item_0' => 'item_0',
              'item_1' => 0,
              'item_2' => 'item_2',
            ],
          ],
        ],
        [
          0 => [
            'item_0' => 'item_0',
            'item_1' => 0,
            'item_2' => 'item_2',
          ],
        ],
        TRUE,
      ],
    ];
  }

}
