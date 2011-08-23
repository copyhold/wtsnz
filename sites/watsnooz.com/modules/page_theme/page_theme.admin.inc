<?php
// $Id: page_theme.admin.inc,v 1.1.2.16 2010/09/30 13:50:23 flanker Exp $

/**
 * @file
 * Admin page callbacks for the page_theme module.
 */


/**
 * Menu callback; lists all defined themes.
 */
function page_theme_admin_overview() {

  $themes = array();

  $result = db_query('SELECT theme, pages, status, weight FROM {page_theme} ORDER BY weight, theme');
  while ($page_theme = db_fetch_object($result)) {

    $row = array();
    $row['name'] = array(
      '#value' => page_theme_get_themes($page_theme->theme),
    );
    $row['pages'] = array(
      '#value' => str_replace("\n", '<br />', check_plain($page_theme->pages)),
    );
    $row['status'] = array(
      '#type' => 'checkbox',
      '#default_value' => $page_theme->status,
    );
    $row['weight'] = array(
      '#type' => 'weight',
      '#default_value' => $page_theme->weight,
      '#delta' => 50,
      '#attributes' => array(
        'class' => 'page-theme-order-weight',
      ),
    );
    $row['edit'] = array(
      '#value' => l(t('edit'), 'admin/build/page-theme/edit/'. $page_theme->theme),
    );
    $row['delete'] = array(
      '#value' => l(t('delete'), 'admin/build/page-theme/delete/'. $page_theme->theme),
    );

    $themes[$page_theme->theme] = $row;
  }

  $form = array();
  $form['themes'] = array(
    '#tree' => TRUE,
  );
  $form['themes'] += $themes;
  $form['actions']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save configuration'),
  );
  $form['actions']['cancel'] = array(
    '#value' => l(t('Cancel'), 'admin/build/page-theme'),
  );

  return $form;
}

function theme_page_theme_admin_overview($form) {

  $rows = array();

  foreach (element_children($form['themes']) as $theme) {

    $row = array();
    $row[] = drupal_render($form['themes'][$theme]['name']);
    $row[] = drupal_render($form['themes'][$theme]['pages']);
    $row[] = drupal_render($form['themes'][$theme]['status']);
    $row[] = drupal_render($form['themes'][$theme]['weight']);
    $row[] = drupal_render($form['themes'][$theme]['edit']);
    $row[] = drupal_render($form['themes'][$theme]['delete']);

    $rows[] = array('data' => $row, 'class' => 'draggable');
  }

  if (count($rows) > 0) {

    drupal_add_tabledrag('page-theme-order', 'order', 'sibling', 'page-theme-order-weight');

    $header = array();
    $header[] = t('Theme');
    $header[] = t('Pages');
    $header[] = t('Enabled');
    $header[] = t('Weight');
    $header[] = array('data' => t('Operations'), 'colspan' => '2');

    $output = theme('table', $header, $rows, array('id' => 'page-theme-order'));
    $output .= drupal_render($form);
  }
  else {

    $output = '<p>'. theme('placeholder', t('No themes defined.')) .'</p>';
  }

  return $output;
}

function page_theme_admin_overview_submit($form, &$form_state) {

  foreach ($form_state['values']['themes'] as $theme => $value) {

    $status = $value['status'];
    $weight = $value['weight'];
    db_query('UPDATE {page_theme} SET status = %d, weight = %d WHERE theme = "%s"', $status, $weight, $theme);
  }

  drupal_set_message(t('The configuration has been saved.'));
}


/**
 * Menu callback; adds a theme.
 */
function page_theme_admin_add() {

  $form = array();
  $form['theme'] = array(
    '#type' => 'select',
    '#title' => t('Theme'),
    '#description' => t('Choose which theme the page should display in.'),
    '#default_value' => '0',
    '#options' => page_theme_get_theme_options(),
    '#required' => TRUE,
  );
  $form['pages'] = array(
    '#type' => 'textarea',
    '#title' => t('Pages'),
    '#description' => t("Enter one page per line as Drupal paths. The '*' character is a wildcard. Example paths are %blog for the blog page and %blog-wildcard for every personal blog. %front is the front page.", array('%blog' => 'blog', '%blog-wildcard' => 'blog/*', '%front' => '<front>')),
    '#default_value' => '',
    '#required' => TRUE,
  );
  $form['status'] = array(
    '#type' => 'checkboxes',
    '#title' => t('Status'),
    '#default_value' => array('enabled'),
    '#options' => array(
      'enabled' => t('Enabled'),
    ),
  );
  $form['weight'] = array(
    '#type' => 'weight',
    '#title' => t('Weight'),
    '#default_value' => 0,
    '#delta' => 50,
  );
  $form['actions']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Add theme'),
  );
  $form['actions']['cancel'] = array(
    '#value' => l(t('Cancel'), 'admin/build/page-theme'),
  );

  return $form;
}

function page_theme_admin_add_validate($form, &$form_state) {

  if (empty($form_state['values']['theme'])) {
    form_set_error('theme', t('Please select a theme.'));
  }
}

function page_theme_admin_add_submit($form, &$form_state) {

  $theme = $form_state['values']['theme'];
  $pages = trim($form_state['values']['pages']);
  $status = intval(is_string($form_state['values']['status']['enabled']));
  $weight = $form_state['values']['weight'];
  db_query('INSERT INTO {page_theme} (theme, pages, status, weight) VALUES ("%s", "%s", %d, %d)', $theme, $pages, $status, $weight);

  drupal_set_message(t('The theme has been added.'));
  $form_state['redirect'] = 'admin/build/page-theme';
}


/**
 * Menu callback; edits a theme.
 */
function page_theme_admin_edit(&$form_state, $page_theme) {

  $form = array();
  $form['theme'] = array(
    '#type' => 'value',
    '#value' => $page_theme->theme,
  );
  $form['theme_name'] = array(
    '#type' => 'item',
    '#title' => t('Theme'),
    '#value' => page_theme_get_themes($page_theme->theme),
  );
  $form['pages'] = array(
    '#type' => 'textarea',
    '#title' => t('Pages'),
    '#description' => t("Enter one page per line as Drupal paths. The '*' character is a wildcard. Example paths are %blog for the blog page and %blog-wildcard for every personal blog. %front is the front page.", array('%blog' => 'blog', '%blog-wildcard' => 'blog/*', '%front' => '<front>')),
    '#default_value' => $page_theme->pages,
    '#required' => TRUE,
  );
  $form['status'] = array(
    '#type' => 'checkboxes',
    '#title' => t('Status'),
    '#default_value' => $page_theme->status ? array('enabled') : array(),
    '#options' => array(
      'enabled' => t('Enabled'),
    ),
  );
  $form['weight'] = array(
    '#type' => 'weight',
    '#title' => t('Weight'),
    '#default_value' => $page_theme->weight,
    '#delta' => 50,
  );
  $form['actions']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Update theme'),
  );
  $form['actions']['cancel'] = array(
    '#value' => l(t('Cancel'), 'admin/build/page-theme'),
  );

  return $form;
}

function page_theme_admin_edit_submit($form, &$form_state) {

  $theme = $form_state['values']['theme'];
  $pages = trim($form_state['values']['pages']);
  $status = intval(is_string($form_state['values']['status']['enabled']));
  $weight = $form_state['values']['weight'];
  db_query('UPDATE {page_theme} SET pages = "%s", status = %d, weight = %d WHERE theme = "%s"', $pages, $status, $weight, $theme);

  drupal_set_message(t('The theme has been updated.'));
  $form_state['redirect'] = 'admin/build/page-theme';
}


/**
 * Menu callback; deletes a theme.
 */
function page_theme_admin_delete(&$form_state, $page_theme) {

  $form = array();
  $form['theme'] = array(
    '#type' => 'value',
    '#value' => $page_theme->theme,
  );
  $question = t('Are you sure you want to delete the theme %theme?', array('%theme' => page_theme_get_themes($page_theme->theme)));
  $path = isset($_GET['destination']) ? $_GET['destination'] : 'admin/build/page-theme';

  return confirm_form($form, $question, $path);
}

function page_theme_admin_delete_submit($form, &$form_state) {

  if ($form_state['values']['confirm']) {

    $theme = $form_state['values']['theme'];
    db_query('DELETE FROM {page_theme} WHERE theme = "%s"', $theme);

    drupal_set_message(t('The theme has been deleted.'));
    $form_state['redirect'] = 'admin/build/page-theme';
    return;
  }
}
