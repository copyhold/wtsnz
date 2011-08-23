<?php
if (empty($fields['name']->raw)) {
  if (!empty($fields['tid_2']->raw)) {
    $by = l($fields['tid_2']->content,'news/'.$fields['tid_2']->content,array('attributes'=>array('class'=>'author term term-'.$fields['tid_2']->raw)));
  } else $by = t('nobody');
} else {
  $by = l($fields['name']->content,'author/'.$fields['name']->content,array('attributes'=>array('class'=>'author user user-'.$fields['name']->raw)));
}
$by = t('By !BY',array('!BY'=>$by));
$nextview = views_get_view('lastminute');
preg_match('~term-(\d+)~',$fields['tid_1']->content,$matches);
$next = $nextview->execute_display('block_2',array($matches[1],$row->nid));
?>
<?php echo $fields['tid_1']->content , '<span>' , theme('image',$row->node_data_field_fi_media_field_fi_media_value,'','',null,0)  , '</span><div><h2>' , $fields['title']->content , '</h2><div class="field-body">' , $fields['body']->content , '</div>' ;?>
<dl class="meta">
<dt><?php echo $by;?>.</dt>
<dt><?php echo t('views !N',array('!N'=>$fields['totalcount']->raw)) ;?>.</dt>
<dt><?php echo t('!N comments',array('!N'=>$fields['comments_count']->raw)) ;?>.</dt>
<dt>no shares</dt>
</dl>

<dl class="icons">
<dt class="country">US</dt>
<dt class="comment">comment</dt>
<dt class="refresh"></dt>
<dt class="link">link to this post</dt>
<dt class="time"><?php echo $fields['created']->content;?></dt>
</dl></div>

<?php echo $next['content']; ?>
