<?php
$page = $_REQUEST['page']?(int)$_REQUEST['page']+1:1;
$query = array('page'=>$page);
if ($_POST['url']) $url = trim($_POST['url'],'/');
else $url = $_GET['q'];
$pagerlink = l(t('More news'),$url,array('query'=>$query,'attributes'=>array('class'=>'more')));
?>
<?php if ($admin_links): ?>
<div class="views-admin-links views-hide"><?php print $admin_links; ?></div>
<div class="sort"><b><?php echo t('Latest');?></b><i><?php echo t('Category');?></i><u><?php echo t('Share');?></u></div>
<?php endif; ?>
<?php echo $rows , $pagerlink; ?>

