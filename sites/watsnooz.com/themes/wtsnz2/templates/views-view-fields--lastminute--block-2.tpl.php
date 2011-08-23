<?php
echo '<em>', t('related news'), '</em>',$fields['title']->content , '<cite>' , substr(date('l',$row->node_created),0,3) . date(' M d,g:i A',$row->node_created) , '</cite>';
