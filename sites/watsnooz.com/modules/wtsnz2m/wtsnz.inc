<?php
class wtsnz {
  const CATEGORIESVID = 2;
  const TERMSVID = 1;
  public static function nicetime($date) {
    if(empty($date)) {
      return "No date provided";
    }

    $periods         = array("second", "minute", "hour", "day", "week", "month", "year", "decade");
    $lengths         = array("60","60","24","7","4.35","12","10");

    $now             = time();
    $unix_date       = $date;

    // check validity of date
    if(empty($unix_date)) {
      return "Bad date";
    }

    // is it future date or past date
    if($now > $unix_date) {
      $difference     = $now - $unix_date;
      $tense         = "ago";

    } else {
      $difference     = $unix_date - $now;
      $tense         = "from now";
    }

    for($j = 0; $difference >= $lengths[$j] && $j < count($lengths)-1; $j++) {
      $difference /= $lengths[$j];
    }

    $difference = round($difference);

    if($difference != 1) {
      $periods[$j].= "s";
    }

    return t("$difference $periods[$j] {$tense}");
  }
  public static function regionCountries($region) {
    if (array_key_exists($region,$GLOBALS['conf']['countries'])) {
      $countries = explode(',',$GLOBALS['conf']['countries'][$region]);
      return $countries;
    } 
    return null;
  }
  public static function formatTimeAgo($ts) {
    $diff = time() - $ts;
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
    return '<cite rel="'.date('r',time()).'" title="'.t('the time that the news has been updated').'">' . floor($diff) . '.' . sprintf('%02s',floor(($diff - floor($diff)) * $div)) . ' <b>' . t('!txt ago',array('!txt'=>$txt)) . '</b></cite>'; 
  }
  public static function getFilteredNodes($get=null,$count=4,$page=0) {
    $get = is_array($get)?$get:$_GET;
    $filter = array();
    if (preg_match('~taxonomy/term/(\d+)~',$get['q'],$matches)) {
      $filter[] = 'AND tncategory.tid='.$matches[1];
    }
    if ($get['region']) {
    $countrytids = db_result(db_query('select group_concat(tid) from term_data where name in ("' . join('","',wtsnz::regionCountries($_GET['region'])) . '")'));
      $filter[] = 'AND tnregion.tid IN ('.$countrytids.')';
    }
    if ($get['author']) {
    $filter[] = 'AND user.uid=' . (int)$get['author'];
    }
    if (count($filter)) $filter = join(' ',$filter);
    else $filter = '';
    
    $q = <<<EOQ
SELECT node.nid
FROM node
INNER JOIN term_node tncategory ON tncategory.nid=node.nid
INNER JOIN term_node tnregion   ON tnregion.nid=node.nid
WHERE node.status <>0
AND node.type='feed_item'
$filter
ORDER BY created DESC
LIMIT $page,$count
EOQ;
    return db_query($q);
  }
}