<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix">
  <?php echo l($maincategory->name,'taxonomy/term/'.$maincategory->tid,array('attributes'=>array('class'=>'cat')));?>
  <?php echo ($country?theme('country',$country):'');?>
  <?php echo l($publisher->name,'taxonomy/term/'.$publisher->tid,array('attributes'=>array('class'=>'publisher taxo-'.$publisher->tid)));?>
  <?php echo '<span class="submitted">' , t('by !username !datetime',array('!username' => $name, '!datetime' =>date('H:i, d M Y',$created))) , '</span>';?>
  <div class="content"><?php echo theme('image',$field_fi_media[0]['value'],'','',array('class'=>'big'),0) , $node->content['body']['#value'] , $node->content['related']['#value'] , $comments; ?></div>
</div>
