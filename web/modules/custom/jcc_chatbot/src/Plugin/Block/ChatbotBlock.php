<?php

namespace Drupal\jcc_chatbot\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides an example block.
 *
 * @Block(
 *   id = "jcc_chatbot",
 *   admin_label = @Translation("JCC Chatbot"),
 *   category = @Translation("JCC Chatbot")
 * )
 */
class ChatbotBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    // Empty block because the chatbot just sticks an iframe at the end of
    // the body. We just want to attach these libraries when the block is
    // present.
    $build['content'] = [
      '#type' => 'inline_template',
      '#template' => '
        <div id="jcc-chatbot"></div>
      ',
    ];
    $build['content']['#attached']['library'][] = 'jcc_chatbot/chatbot';
    $build['content']['#attached']['library'][] = 'jcc_chatbot/a2p';

    return $build;
  }

}
