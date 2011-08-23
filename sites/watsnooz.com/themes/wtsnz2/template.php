<?php

/**
 * Implementation of HOOK_theme().
 */
function wtsnz2_theme(&$existing, $type, $theme, $path) {
  $hooks = zen_theme($existing, $type, $theme, $path);
  // Add your theme hooks like this:
  /*
  $hooks['hook_name_here'] = array( // Details go here );
  */
  // @TODO: Needs detailed comments. Patches welcome!
  return $hooks;
}

/**
 * Override or insert variables into all templates.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered (name of the .tpl.php file.)
 */
/* -- Delete this line if you want to use this function
function wtsnz2_preprocess(&$vars, $hook) {
  $vars['sample_variable'] = t('Lorem ipsum.');
}
// */
function wtsnz2_comment_submitted($comment) {
  return t('Submitted by !username | @datetime | !report',
    array(
      '!username' => theme('username', $comment),
      '@datetime' => wtsnz::nicetime($comment->timestamp),
      '!report' => '<span rel="'.$comment->cid.'">'.t('Report abuse').'</span>',
    ));
}

function wtsnz2_comment_view($comment, $node, $links = array(), $visible = TRUE) {
  static $first_new = TRUE;

  $output = '';
  $comment->new = node_mark($comment->nid, $comment->timestamp);
  if ($first_new && $comment->new != MARK_READ) {
    // Assign the anchor only for the first new comment. This avoids duplicate
    // id attributes on a page.
    $first_new = FALSE;
  }

  $output .= "<a id=\"comment-$comment->cid\"></a>\n";

  // Switch to folded/unfolded view of the comment
  if ($visible) {
    $comment->comment = check_markup($comment->comment, $comment->format, FALSE);

    // Comment API hook
    comment_invoke_comment($comment, 'view');

    $output .= theme('comment', $comment, $node, $links);
  }
  else {
    $output .= theme('comment_folded', $comment);
  }

  return $output;
}


function wtsnz2_preprocess_page(&$vars, $hook) {
  if ($vars['is_front']) {
    unset($vars['title']);
  }
  $breadcrumbs = array(l(t('home'),'<front>'));
  if (preg_match('~^taxonomy/term/(\d+)$~',$_GET['q'],$matches)) {
    $vars['template_files'] = array('page-taxo');
    $term = taxonomy_get_term($matches[1]);
    $parent = current(taxonomy_get_parents($matches[1]));
    if (is_object($parent)) $breadcrumbs[] = l($parent->name,'taxonomy/term/'.$parent->tid);
    $breadcrumbs[] = $term->name;
  }
  if ($vars['node']) {
    $taxo = array_filter($vars['node']->taxonomy,create_function('$v','if ($v->vid==wtsnz::CATEGORIESVID) return true;else return false;'));
    $term = current($taxo);
    $parent = current(taxonomy_get_parents($term->tid));
    if (is_object($parent)) $breadcrumbs[] = l($parent->name,'taxonomy/term/'.$parent->tid);
    $breadcrumbs[] = l($term->name,'taxonomy/term/'.$term->tid);
  }
  $links = array(
      'news active'=> array('href'=>'news','title'=>t('news')),
      'mm'=> array('href'=>'multimedia','title'=>t('multimedia')),
      'ch'=> array('href'=>'channels','title'=>t('channels')),
      'user'=> array('href'=>'user','title'=>t('sign up')),);
  $vars['topnav'] = theme('links',$links);
  if ($vars['is_front']) $vars['breadcrumb'] = '';
  else $vars['breadcrumb'] = theme('breadcrumb',$breadcrumbs);
}

/**
 * Return a themed breadcrumb trail.
 *
 * @param $breadcrumb
 *   An array containing the breadcrumb links.
 * @return a string containing the breadcrumb output.
 */
function wtsnz2_breadcrumb($breadcrumb) {
  if (!empty($breadcrumb)) {
    foreach ($breadcrumb as $k=>$b) {
    	$breadcrumb[$k] = '<span>' . $b . '</span>';
    }
    return '<div class="breadcrumb">'. implode('', $breadcrumb) .'</div>';
  }
}
// */

/**
 * Override or insert variables into the node templates.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("node" in this case.)
 */
/* -- Delete this line if you want to use this function
function wtsnz2_preprocess_node(&$vars, $hook) {
  $vars['sample_variable'] = t('Lorem ipsum.');

  // Optionally, run node-type-specific preprocess functions, like
  // wtsnz2_preprocess_node_page() or wtsnz2_preprocess_node_story().
  $function = __FUNCTION__ . '_' . $vars['node']->type;
  if (function_exists($function)) {
    $function($vars, $hook);
  }
}
// */

/**
 * Override or insert variables into the comment templates.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("comment" in this case.)
 */
/* -- Delete this line if you want to use this function
function wtsnz2_preprocess_comment(&$vars, $hook) {
  $vars['sample_variable'] = t('Lorem ipsum.');
}
// */

/**
 * Override or insert variables into the block templates.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("block" in this case.)
 */
/* -- Delete this line if you want to use this function
function wtsnz2_preprocess_block(&$vars, $hook) {
  $vars['sample_variable'] = t('Lorem ipsum.');
}
// */
