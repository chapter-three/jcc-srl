<?php

namespace Drupal\cc;

use Drupal\Component\Utility\NestedArray;
use Exception;

/**
 * A set of conditions for a conditional display.
 */
class Conditions {

  const OPERATOR_AND = 1;
  const OPERATOR_OR = 2;
  const CONDITION_OPERATOR_NONE_OF = 0;
  const CONDITION_OPERATOR_ONE_OF = 1;
  const CONDITION_OPERATOR_ALL_OF = 2;

  /**
   * The operator.
   *
   * @var int
   */
  protected $operator;

  /**
   * The conditions.
   *
   * @var array
   */
  protected $conditions;

  /**
   * Conditions constructor.
   *
   * @param int $operator
   *   One of self::OPERATOR_AND or self::OPERATOR_OR.
   * @param array $conditions
   *   A conditions array.
   *
   * @throws \Exception
   */
  public function __construct(
    $operator = self::OPERATOR_AND,
    array $conditions = []
  ) {
    if (!in_array($operator, [self::OPERATOR_AND, self::OPERATOR_OR])) {
      throw new Exception('Unexpected operator value.');
    }
    $this->conditions = $conditions;
    $this->operator = $operator;
  }

  /**
   * Get operator.
   *
   * @return int
   *   The operator.
   */
  public function getOperator(): int {
    return $this->operator;
  }

  /**
   * Get conditions.
   *
   * @return array
   *   The conditions.
   */
  public function getConditions(): array {
    return $this->conditions;
  }

  /**
   * Gets a FAPI #options array of condition operators.
   *
   * @return array
   *   Operator options.
   */
  public static function getOperatorOptions() {
    return [
      self::OPERATOR_AND => t('AND'),
      self::OPERATOR_OR => t('OR'),
    ];
  }

  /**
   * Gets a FAPI #options array of condition operators.
   *
   * @return array
   *   Operator options.
   */
  public static function getConditionOperatorOptions() {
    return [
      self::CONDITION_OPERATOR_NONE_OF => t('None of'),
      self::CONDITION_OPERATOR_ONE_OF => t('One of'),
      self::CONDITION_OPERATOR_ALL_OF => t('All of'),
    ];
  }

  /**
   * Add new condition.
   *
   * @param string $entity_id
   *   User input entity id.
   * @param int $operator
   *   One of self::CONDITION_OPERATOR_ONE_OF, self::CONDITION_OPERATOR_ALL_OF.
   * @param array $value
   *   Value.
   *
   * @return \Drupal\cc\Conditions
   *   For chaining.
   */
  public function addCondition(
    string $entity_id,
    $operator = self::CONDITION_OPERATOR_NONE_OF,
    array $value = []
  ) {
    $this->conditions[] = [
      'id' => $entity_id,
      'operator' => $operator,
      'value' => $value,
    ];
    return $this;
  }

  /**
   * Adds nested conditions.
   *
   * @param \Drupal\cc\Conditions $conditions
   *   Nested conditions.
   *
   * @return \Drupal\cc\Conditions
   *   For chaining.
   */
  public function addConditions(Conditions $conditions) {
    $this->conditions[] = $conditions;
    return $this;
  }

  /**
   * Removes condition.
   *
   * @param array $parents
   *   Array of parent keys.
   *
   * @return \Drupal\cc\Conditions
   *   For chaining.
   */
  public function removeCondition(array $parents) {
    NestedArray::unsetValue($this->conditions, $parents);
    return $this;
  }

  /**
   * Evaluate user input against conditions.
   *
   * @param array $user_input
   *   The user input.
   *
   * @return bool
   *   The result.
   */
  public function eval(array $user_input) {
    switch ($this->operator) {

      case self::OPERATOR_AND:
        foreach ($this->conditions as $condition) {
          if ($condition instanceof Conditions) {
            if (!$condition->eval($user_input)) {
              return FALSE;
            }
          }
          elseif (!$this->evalCondition($user_input, $condition)) {
            return FALSE;
          }
        }
        return TRUE;

      case self::OPERATOR_OR:
        foreach ($this->conditions as $condition) {
          if ($condition instanceof Conditions) {
            if ($condition->eval($user_input)) {
              return TRUE;
            }
          }
          elseif ($this->evalCondition($user_input, $condition)) {
            return TRUE;
          }
        }
        // No conditions evaluates to TRUE.
        return !count($this->conditions);

    }
    return TRUE;
  }

  /**
   * Evaluate user input against a condition.
   *
   * @param array $user_input
   *   The user input.
   * @param array $condition
   *   A condition.
   *
   * @return bool
   *   The result.
   */
  protected function evalCondition(array $user_input, array $condition) {
    $user_input = array_filter($user_input[$condition['id']] ?: []);
    $values = array_filter($condition['value']);
    switch ($condition['operator']) {

      case self::CONDITION_OPERATOR_NONE_OF:
        foreach ($values as $value) {
          if (isset($user_input[$value])) {
            return FALSE;
          }
        }
        return TRUE;

      case self::CONDITION_OPERATOR_ONE_OF:
        foreach ($values as $value) {
          if (isset($user_input[$value])) {
            return TRUE;
          }
        }
        return FALSE;

      case self::CONDITION_OPERATOR_ALL_OF:
        foreach ($values as $value) {
          if (!isset($user_input[$value])) {
            return FALSE;
          }
        }
        return TRUE;

    }
    return TRUE;
  }

}
