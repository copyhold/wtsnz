<div id="block-wtsnz2m-filter">
<h3><?php echo t('news filter');?></h3>
<div class="countryfilter">
<h4><?php echo t('by regions');?></h4>
<map id="countriesmap" name="countriesmap">
<area shape="poly" title="Oceania" id="oceania" coords="212,95, 227,86, 227,72, 246,83, 242,92, 246,99, 234,113, 224,108, 209,112" href="<?php echo url($_GET['q'],array('fragment'=>'!regions/oceania'));?>" />
<area shape="poly" title="Asia" id="asia" coords="137,9, 147,12, 159,8, 168,4, 180,3, 183,5, 238,11, 233,24, 224,17, 214,20, 227,33, 227,41, 221,44, 217,38, 214,41, 218,50, 225,68, 216,83, 204,83, 200,72, 196,62, 192,54, 185,67, 176,54, 170,50, 163,50, 146,28, 137,19" type="region" rel="asia" />
<area shape="poly" title="Europe" id="europe" coords="109,20, 130,8, 137,8, 137,16, 137,19, 146,28, 138,33, 137,33, 133,37, 128,38, 121,33, 113,40, 112,37, 109,33" type="region" rel="europe" />
<area shape="poly" title="Middle East" id="middleeast" coords="137,34, 151,34, 159,50, 163,50, 167,54, 154,62, 142,44, 145,44, 145,38, 137,38" type="region" rel="middle-east" />
<area shape="poly" title="Alaska" id="alaska" coords="4,20, 16,8, 41,9, 53,0, 112,0, 103,12, 79,29, 66,32, 66,28, 55,33, 53,28, 24,28, 24,20" type="region" rel="alaska" />
<area shape="poly" title="United States" id="us" coords="24,28, 53,28, 55,33, 66,29, 66,32, 50,50, 49,50, 49,46, 37,49, 36,47, 29,44, 20,44, 20,37" type="regions" rel="us" />
<area shape="poly" title="Central America" id="centralamerica" coords="21,44, 29,44, 36,49, 37,55, 41,55, 42,54, 49,53, 62,55, 55,59, 42,63, 29,59, 24,51" type="regions" rel="central-america" >
<area shape="poly" title="Africa" id="africa" coords="142,45, 150,59, 154,63, 160,63, 160,71, 150,79, 153,86, 163,87, 155,101, 146,99, 141,108, 129,108, 126,95, 128,82, 124,75, 124,71, 120,67, 109,70, 103,62, 103,51, 112,41, 124,38, 126,42, 132,46, 133,41" type="region" rel="africa" />
<area shape="poly" title="South America" id="southamerica" coords="47,75, 50,71, 53,63, 62,66, 67,67, 75,70, 79,75, 87,78, 87,83, 87,87, 87,95, 79,100, 67,116, 71,128, 65,128, 59,121, 57,95, 47,80" type="region" rel="south-america"/>
</map>
<img class="countriesimage" src="/sites/watsnooz.com/themes/wtsnz2/images/spacer.gif" usemap="#countriesmap"/>
<img class="countriesimage selected" src="/sites/watsnooz.com/themes/wtsnz2/images/spacer.gif" />
<p><?php echo t('Choose region on the map or from the list');?></p>
</div>
<div id="filterbysource">
<h4><?php echo t('by sources');?></h4>
<cite class="checked"><?php echo t('News network');?></cite>
<cite><?php echo t('Nooz writers');?></cite>
<div class="select">
<span></span>
<i>Keegan deVitte</i>
<i>Ilya Nuevo</i>
<i>Menahem Begin</i>
</div>
</div>
<div class="footer"><em><?php echo t('Reset all filter');?></em><strong><?php echo t('Apply');?></strong></div>
</div>
