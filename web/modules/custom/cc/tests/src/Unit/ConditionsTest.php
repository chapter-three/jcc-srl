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
      'id' => 1,
      'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
      'value' => [
        'item_1' => 'item_1',
      ],
    ];
    $condition_0_false = [
      'id' => 1,
      'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
      'value' => [
        'item_1' => 'item_1',
      ],
    ];
    $condition_1_true = [
      'id' => 2,
      'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
      'value' => [
        'item_1' => 'item_1',
      ],
    ];
    $condition_1_false = [
      'id' => 2,
      'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
      'value' => [
        'item_1' => 'item_1',
      ],
    ];
    $values = [
      1 => [
        'item_1' => 0,
      ],
      2 => [
        'item_1' => 'item_1',
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
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
            'value' => [
              'item_1' => 'item_1',
              'item_2' => 'item_2',
              'item_3' => 'item_3',
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 'item_1',
            'item_2' => 'item_2',
            'item_3' => 'item_3',
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
            'value' => [
              'item_1' => 'item_1',
              'item_2' => 'item_2',
              'item_3' => 'item_3',
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 0,
            'item_2' => 0,
            'item_3' => 0,
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
            'value' => [
              'item_1' => 0,
              'item_2' => 0,
              'item_3' => 0,
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 'item_1',
            'item_2' => 'item_2',
            'item_3' => 'item_3',
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
            'value' => [
              'item_1' => 0,
              'item_2' => 0,
              'item_3' => 0,
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 0,
            'item_2' => 0,
            'item_3' => 0,
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
            'value' => [
              'item_1' => 0,
              'item_2' => 'item_2',
              'item_3' => 0,
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 0,
            'item_2' => 'item_2',
            'item_3' => 0,
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
            'value' => [
              'item_1' => 'item_1',
              'item_2' => 0,
              'item_3' => 'item_3',
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 0,
            'item_2' => 'item_2',
            'item_3' => 0,
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
            'value' => [
              'item_1' => 0,
              'item_2' => 'item_2',
              'item_3' => 0,
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 'item_1',
            'item_2' => 0,
            'item_3' => 'item_3',
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_NONE_OF,
            'value' => [
              'item_1' => 'item_1',
              'item_2' => 0,
              'item_3' => 'item_3',
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 'item_1',
            'item_2' => 0,
            'item_3' => 'item_3',
          ],
        ],
        FALSE,
      ],
      // One of.
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
            'value' => [
              'item_1' => 'item_1',
              'item_2' => 'item_2',
              'item_3' => 'item_3',
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 'item_1',
            'item_2' => 'item_2',
            'item_3' => 'item_3',
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
            'value' => [
              'item_1' => 'item_1',
              'item_2' => 'item_2',
              'item_3' => 'item_3',
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 0,
            'item_2' => 0,
            'item_3' => 0,
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
            'value' => [
              'item_1' => 0,
              'item_2' => 0,
              'item_3' => 0,
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 'item_1',
            'item_2' => 'item_2',
            'item_3' => 'item_3',
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
            'value' => [
              'item_1' => 0,
              'item_2' => 0,
              'item_3' => 0,
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 0,
            'item_2' => 0,
            'item_3' => 0,
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
            'value' => [
              'item_1' => 0,
              'item_2' => 'item_2',
              'item_3' => 0,
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 0,
            'item_2' => 'item_2',
            'item_3' => 0,
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
            'value' => [
              'item_1' => 'item_1',
              'item_2' => 0,
              'item_3' => 'item_3',
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 0,
            'item_2' => 'item_2',
            'item_3' => 0,
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
            'value' => [
              'item_1' => 1,
              'item_2' => 'item_2',
              'item_3' => 0,
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 'item_1',
            'item_2' => 0,
            'item_3' => 'item_3',
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_ONE_OF,
            'value' => [
              'item_1' => 'item_1',
              'item_2' => 0,
              'item_3' => 'item_3',
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 'item_1',
            'item_2' => 0,
            'item_3' => 'item_3',
          ],
        ],
        TRUE,
      ],
      // All of.
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_ALL_OF,
            'value' => [
              'item_1' => 'item_1',
              'item_2' => 'item_2',
              'item_3' => 'item_3',
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 'item_1',
            'item_2' => 'item_2',
            'item_3' => 'item_3',
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_ALL_OF,
            'value' => [
              'item_1' => 'item_1',
              'item_2' => 'item_2',
              'item_3' => 'item_3',
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 0,
            'item_2' => 0,
            'item_3' => 0,
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_ALL_OF,
            'value' => [
              'item_1' => 0,
              'item_2' => 0,
              'item_3' => 0,
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 'item_1',
            'item_2' => 'item_2',
            'item_3' => 'item_3',
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_ALL_OF,
            'value' => [
              'item_1' => 0,
              'item_2' => 0,
              'item_3' => 0,
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 0,
            'item_2' => 0,
            'item_3' => 0,
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_ALL_OF,
            'value' => [
              'item_1' => 0,
              'item_2' => 'item_2',
              'item_3' => 0,
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 0,
            'item_2' => 'item_2',
            'item_3' => 0,
          ],
        ],
        TRUE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_ALL_OF,
            'value' => [
              'item_1' => 'item_1',
              'item_2' => 0,
              'item_3' => 'item_3',
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 0,
            'item_2' => 'item_2',
            'item_3' => 0,
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_ALL_OF,
            'value' => [
              'item_1' => 0,
              'item_2' => 'item_2',
              'item_3' => 0,
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 'item_1',
            'item_2' => 0,
            'item_3' => 'item_3',
          ],
        ],
        FALSE,
      ],
      [
        Conditions::OPERATOR_AND,
        [
          [
            'id' => 1,
            'operator' => Conditions::CONDITION_OPERATOR_ALL_OF,
            'value' => [
              'item_1' => 'item_1',
              'item_2' => 0,
              'item_3' => 'item_3',
            ],
          ],
        ],
        [
          1 => [
            'item_1' => 'item_1',
            'item_2' => 0,
            'item_3' => 'item_3',
          ],
        ],
        TRUE,
      ],
    ];
  }

}
