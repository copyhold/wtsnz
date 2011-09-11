<?php
if (empty($block->node->user_name)) {
  $source = current($block->tags[3]);
  if (!empty($source->name)) {
    $by = l($source->name,'taxonomy/term/'.$source->tid , array('attributes'=>array('class'=>'author term term-'.$fields['tid_2']->raw)));
  } else $by = t('nobody');
} else {
  $by = l($block->node->user_name,'author/'.$block->node->user_name,array('attributes'=>array('class'=>'author user user-'.$fields['name']->raw)));
}
$by = t('By !BY',array('!BY'=>$by));
$category = current($block->tags[2]); // vid=2 - categories
?>
<div id="block-views-lastminute-block_1">
<div class="content block-content"><h1 class="title"><?php print t('last minute...'); ?></h1>
<?php echo l($category->name,'taxonomy/term/'.$category->tid,array('attributes'=>array('class'=>'category'))) , '<span>' , theme('image',$block->node->media,'','',null,0)  , '</span><div><h2>' , l($block->node->title,'node/'.$block->node->nid) , '</h2><div class="field-body">' , $content , '</div>' ;?>
<dl class="meta">
<dt><?php echo $by;?>.</dt>
<dt><?php echo t('views !N',array('!N'=>$node->node_statistics)) ;?>.</dt>
<dt><?php echo t('!N comments',array('!N'=>$node->comment_count)) ;?>.</dt>
<dt>no shares</dt>
</dl>

<dl class="icons">
<dt class="country">US</dt>
<dt class="comment">comment</dt>
<dt class="refresh"></dt>
<dt class="link">link to this post</dt>
<dt class="time"><?php echo wtsnz::formatTimeAgo($block->node->created);?></dt>
</dl></div>
<p class="next">
<?php echo '<em>', t('related news'), '</em>',l($block->next->title,'node/'.$block->next->nid) , '<cite>' , substr(date('l',$block->next->created),0,3) . date(' M d,g:i A',$block->next->created) , '</cite>';?>
</p>
</div>
</div> <!-- /.block -->
