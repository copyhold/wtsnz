<?php
$country = new stdClass(); // have to be set for each node on commit stage.
$country->nativename = 'United Kingdom';
$country->code = 'uk';

$img = $fields['field_fi_media_value']->raw?'<span><img src="'.$fields['field_fi_media_value']->raw.'" /></span>':'';
$flag = theme('country',$country);
?>
<div class="time">
<?php echo $fields['created']->content;?>
</div>
<div class="category">
<?php echo $fields['tid_2']->content,str_replace('>, <','><',$fields['tid']->content);?>
</div>
<div class="content <?php if ($img) echo 'img';?>">
<?php echo $img ;?>
<h3><?php echo $fields['title']->content;?></h3>
<p><?php echo $fields['teaser']->content;?></p>
<cite><?php echo t('by !BY',array('!BY'=>$fields['tid_1']->content));?><span><?php echo $fields['totalcount']->content;?></span><span><?php echo $fields['comment_count']->content;?></span><?php echo $flag;?></cite>
</div>
<div class="score"></div>
