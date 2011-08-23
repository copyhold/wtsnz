<?php
if ($page && $node->path=='frontpage') {
  echo ' ';
  return;
}
?>
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix">
  <?php echo ($country?theme('country',$country):'');?>
  <?php echo l($maincategory->name,'taxonomy/term/'.$maincategory->tid,array('attributes'=>array('class'=>'cat')));?>
  <?php echo l($publisher->name,'taxonomy/term'.$publisher->tid,array('attributes'=>array('class'=>'publisher taxo-'.$publisher->tid)));?>
  <?php echo '<span class="submitted">' , t('by !username !datetime',array('!username' => $name, '!datetime' => $date)) , '</span>';?>
  <div class="content"><?php print $content; ?></div>
</div> <!-- /.node -->
