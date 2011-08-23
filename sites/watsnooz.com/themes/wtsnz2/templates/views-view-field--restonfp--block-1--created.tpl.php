<?php
$diff = time() - $row->node_created;
if ($diff>86400) { // day
  $diff = $diff / 86400;
  $txt = 'days';
  $div = 24;
  
} elseif ($diff>3600) {
  $diff = $diff/3600;
  $txt = 'hours';
  $div = 60;
} else {
  $diff = $diff/60;
  $txt = 'minutes';
  $div = 60;
}
echo '<cite rel="',date('r',time()),'" title="',t('the time that the news has been updated'),'">' , floor($diff) , '.' , sprintf('%02s',floor(($diff - floor($diff)) * $div)) , '<b>' , t('!txt ago',array('!txt'=>$txt)) , '</b></cite>'; 

