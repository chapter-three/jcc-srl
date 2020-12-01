<?php

function atrium_preprocess_menu(array &$vars) {
  if ($vars['menu_name'] == 'main') {
    foreach ($vars['items'] as $idx => $item) {
      $menuEntity = $item['entity'];
      $myField = $menuEntity->get('field_menu_class');
      $vars['items'][$idx]['attributes']['class'] = $myField->value;
    }
  }
}
