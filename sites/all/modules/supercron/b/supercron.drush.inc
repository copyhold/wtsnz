<?php
// $Id:$

/**
 * @file
 *   Drush support for supercron.
 */

/**
 * Implementation of hook_drush_command().
 */
function supercron_drush_command() {
  $items = array();
  $items['supercron'] = array(
    'description' => "Invoke cron jobs for specific modules.",
    'arguments' => array(
      'modules' => 'A list of modules to invoke their cron jobs.',
    ),
    'examples' => array(
      'drush supercron system node filter' =>
        'Invoke cron jobs for system, node and filter modules.',
    ),
  );
  return $items;
}

/**
 * Implementation of hook_drush_help().
 */
function supercron_drush_help($section) {
  switch ($section) {
    case 'drush:supercron':
      return dt("Invoke cron jobs for modules. Usage: 'drush supercron all'.");
  }
}

/**
 * Drush command callback.
 */
function drush_supercron() {
  $commands = func_get_args();
  $invoke_modules = supercron_list_handled_modules();

  // If the argument 'all' is specified run the hook_cron() impelementations of
  // all modules enabled in supercron's settings.
  if(in_array('all', $commands)) {
    $modules = $invoke_modules;
    drush_print(dt('The cron jobs of the following modules will be invoked: !projects', array('!projects' => implode(', ', $modules))));
    if(drush_confirm(dt('Do you really want to continue?'))) {
      supercron_module_invoke_all_cron();
      drush_log(dt('Running cron hooks for all modules'), 'ok');
    }
  }
  // Run only the hook_cron() impelmentations of the specified modules.
  else if (count($commands) > 0) {
    $modules = array_intersect($commands, $invoke_modules);
    drush_print(dt('The cron jobs of the following modules will be invoked: !projects', array('!projects' => implode(', ', $modules))));
    if(drush_confirm(dt('Do you really want to continue?'))) {
      foreach($modules as $module) {
        supercron_invoke_one($module);
        drush_log(dt('Running @module_cron', array('@module_cron' => $module . '_cron()')), 'ok');
      }
    }
  }
  // If no argument is specified prompt the user to choose an option.
  else {
    array_unshift($invoke_modules, 'all');
    $choices = array_flip($invoke_modules);
    $choice = drush_choice($choices, "Enter a number to choose which module's cron hook to run.", '!key');
    if ($choice !== FALSE) {
      supercron_invoke_one($choice);
      drush_log(dt('Running @module_cron', array('@module_cron' => $choice . '_cron()')), 'ok');
    }
  }
}
