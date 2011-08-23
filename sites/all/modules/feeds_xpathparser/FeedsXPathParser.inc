<?php
// $Id: FeedsXPathParser.inc,v 1.1.2.12 2010/09/21 22:49:31 twistor Exp $

/**
 * @file
 *
 * Provides the HTML and XML Classes for Feeds XPath Parser.
 */

define('FEEDS_XPATH_PREG', '/(\/{0,2})(?<![=:\'"-\s[])\b(\w+)\b(?!:)(?![\(\s])/i');

class FeedsXPathParserHTML extends FeedsXPathParserBase {

  /**
   * Implementation of FeedsParser::parse().
   */
  public function parse(FeedsImportBatch $batch, FeedsSource $source) {
    parent::parse($batch, $source);

    $dom = new DOMDocument();
    $raw = $batch->getRaw();
    /**
     * This is currently unsupported.
     */
    if ($this->source_config['tidy']['tidy']) {
      $config = array(
        'merge-divs'       => FALSE,
        'merge-spans'      => FALSE,
        'join-styles'      => FALSE,
        'drop-empty-paras' => FALSE,
        'wrap'             => 0,
        'tidy-mark'        => FALSE,
      );
      $raw = tidy_repair_string($raw, $config);
    }
    $success = @$dom->loadHTML($raw);

    if (!$success) {
      throw new Exception(t('There was an error parsing the HTML document.'));
    }

    $xml = simplexml_import_dom($dom);
    unset($dom);
    $batch->setItems($this->query($xml));
  }

  /**
   * Source form.
   */
  public function sourceForm($source_config) {
    $form = parent::sourceForm($source_config);

    return $form;
  }
}

class FeedsXPathParserXML extends FeedsXPathParserBase {

  /**
   * Implementation of FeedsParser::parse().
   */
  public function parse(FeedsImportBatch $batch, FeedsSource $source) {
    parent::parse($batch, $source);
    $raw = $batch->getRaw();

    if ($this->source_config['tidy']['tidy']) {
      $config = array(
        'input-xml' => TRUE,
        'wrap'      => 0,
        'tidy-mark' => FALSE,
      );
      $raw = tidy_repair_string($raw, $config);
    }

    $xml = new SimpleXMLElement($raw);
    $batch->setItems($this->query($xml));
  }
}

/**
 * Base class for the HTML and XML parsers.
 */
class FeedsXPathParserBase extends FeedsParser {

  /**
   * Implementation of FeedsParser::parse().
   */
  public function parse(FeedsImportBatch $batch, FeedsSource $source) {
    $this->source_config = $source->getConfigFor($this);
    $this->rawXML = array_keys(array_filter($this->source_config['rawXML']));
  }

  /**
   * Starts the parsing. First runs the context query, then queries each
   * item from the context with the field queries.
   *
   * @param $xml
   *   A SimpleXMLElement object.
   * @return array
   *   Returns a structured array suitable for adding to a batch object with
   *   $batch->setItems().
   */
  protected function query($xml) {
    // Fetch the namespaces defined in the XML document.
    $this->namespaces = $xml->getNamespaces(TRUE);

    $all_items = $this->namespacedXPathQuery($xml, $this->source_config['context']);
    unset($xml);

    $parsed_items = array();
    foreach ($all_items as $item) {
      $parsed_item = array();
      foreach ($this->source_config['sources'] as $source => $query) {
        $parsed_item[$source] = $this->parseSourceElement($item, $query, $source);
      }
      $parsed_items[] = $parsed_item;
    }
    return $parsed_items;
  }

  /**
   * Executes an XPath query with namespace support.
   *
   * @param $xml
   *   The XML element to execute the query on.
   * @param $query
   *   An XPath query.
   * @return array
   *   An array containing the results of the query.
   */
  private function namespacedXPathQuery($xml, $query) {

    foreach ($this->namespaces as $prefix => $namespace) {
      if ($prefix === '') {
        $xml->registerXPathNamespace('__default__', $namespace);
        // Replace all the elements without prefix by the default prefix.
        $query = preg_replace(FEEDS_XPATH_PREG, '$1__default__:$2', $query);
      }
      else {
        $xml->registerXPathNamespace($prefix, $namespace);
      }
    }
    // Perfom xpath query.
    $results = $xml->xpath($query);

    // SimpleXMLElement::xpath doesn't throw warnings or raise exceptions on
    // errors, it simply returns FALSE.
    if ($results === FALSE) {
      throw new Exception(t('There was an error with the XPath query: <em>%query</em>', array('%query' => $query)));
    }
    return $results;
  }

  /**
   * Parses one item from the context array.
   *
   * @param $item
   *   A  SimpleXMLElement from the context array.
   * @param $query
   *   An XPath query.
   * @ $source
   *   The name of the source for this query.
   * @return array
   *   An array containing the results of the query.
   */
  protected function parseSourceElement($item, $query, $source) {
    if (empty($query)) {
      return;
    }
    $results = $this->namespacedXPathQuery($item, $query);
    unset($xml);
    /**
     * Iterate through the results of the xpath query.  If this source is
     * configured to return raw xml make it so.
     */
    foreach ($results as &$result) {
      if (in_array($source, $this->rawXML)) {
        $result = $result->asXML();
      }
      else {
        $result = (string) $result;
      }
    }

    /**
     * If their is one result, return it directly.  If there is more than one,
     * return the array. If there are no results return an empty string.
     *
     * @TODO: Determine if an empty string is appropriate. Add in some kind of check
     *   that makes the title only return one result (maybe).
     */
    $count = count($results);
    if ($count == 1) {
      return $results[0];
    }
    if ($count > 1) {
      return $results;
    }
  }

  /**
   * Source form.
   */
  public function sourceForm($source_config) {
    $form = array();
    $form['#weight'] = -10;

    $mappings_ = feeds_importer($this->id)->processor->config['mappings'];
    $uniques = $mappings = array();

    foreach ($mappings_ as $mapping) {
      if (strpos($mapping['source'], 'xpathparser:') === 0) {
        $mappings[$mapping['source']] = $mapping['target'];
        if ($mapping['unique']) {
          $uniques[] = $mapping['target'];
        }
      }
    }

    if (empty($mappings)) {
      $form['error_message']['#value'] = 'FeedsXPathParser: No mappings were defined.';
      return $form;
    }

    $form['context'] = array(
      '#type'          => 'textfield',
      '#title'         => t('Context'),
      '#required'      => TRUE,
      '#description'   => t('This is the base query, all other queries will run in this context.'),
      '#default_value' => isset($source_config['context']) ? $source_config['context'] : '',
    );

    $form['sources'] = array(
      '#type' => 'fieldset',
    );

    if (!empty($uniques)) {
      $items = array(
        format_plural(count($uniques),
          t('Field <strong>!column</strong> is mandatory and considered unique: only one item per !column value will be created.',
            array('!column' => implode(', ', $uniques))),
          t('Fields <strong>!columns</strong> are mandatory and values in these columns are considered unique: only one entry per value in one of these columns will be created.',
            array('!columns' => implode(', ', $uniques)))),
      );
      $form['sources']['help']['#value'] = '<div class="help">' . theme('item_list', $items) . '</div>';
    }
    else {
      $form['sources']['help']['#value'] = '<div class="help">It is <strong>strongly</strong> recommended that you select at least one unique target.</div>';
    }

    foreach ($mappings as $source => $target) {
      $form['sources'][$source] = array(
        '#type'          => 'textfield',
        '#title'         => $target,
        '#description'   => t('The XPath query to run.'),
        '#default_value' => isset($source_config['sources'][$source]) ? $source_config['sources'][$source] : '',
      );
    }

    $form['rawXML'] = array(
      '#type'          => 'checkboxes',
      '#title'         => t('Select the queries you would like to return raw XML or HTML'),
      '#options'       => $mappings,
      '#default_value' => isset($source_config['rawXML']) ? $source_config['rawXML'] : array(),
    );

    if (extension_loaded('tidy')) {
      $form['experimental'] = array(
        '#type' => 'fieldset',
        '#collapsible' => TRUE,
        '#collapsed' => TRUE,
        '#title' => 'Experimental',
      );
      $form['experimental']['tidy'] = array(
        '#type'          => 'checkboxes',
        '#title'         => t('Use Tidy'),
        '#description'   => t('The Tidy PHP extension has been detected.
                              Slect this to clean the markup before parsing.'),
        '#options'       => array('tidy' => ''),
        '#default_value' => isset($source_config['tidy']) ? $source_config['tidy'] : array(),
      );
    }

    return $form;
  }

  /**
  * Override parent::getMappingSources().
  */
  public function getMappingSources() {
    return array(
      'xpathparser:0' => array(
        'name' => t('XPath Expression'),
        'description' => t('Allows you to configure an XPath expression that will populate this field.'),
      ),
    ) + parent::getMappingSources();
  }

  /**
   * Define defaults.
   */
  public function sourceDefaults() {
    return array();
  }

  /**
   * Override parent::sourceFormValidate().
   *
   * Simply trims all XPath values from the form. That way when testing them
   * later we can be sure that there aren't any strings with spaces in them.
   *
   * @param &$values
   *   The values from the form to validate, passed by reference.
   */
  public function sourceFormValidate(&$values) {
    $values['context'] = trim($values['context']);
    foreach ($values['sources'] as &$query) {
        $query = trim($query);
    }
  }
}

/**
 * Implementation of hook_form_feeds_ui_mapping_form_alter().
 *
 * This is an interesting bit of work. Each source name has to be unique,
 * but we have no idea how many to create with getMappingSources() because we
 * don't know how many targets there are going to be.
 *
 * Solution is to keep track in the form how many have been added.
 */
function feeds_xpathparser_form_feeds_ui_mapping_form_alter($form, &$form_state) {
  $newest_xpath_mapping = array();
  foreach ($form['#mappings'] as $mapping) {
    if (strpos($mapping['source'], 'xpathparser:') === 0) {
      $newest_xpath_mapping = $mapping;
    }
  }
  if (!empty($newest_xpath_mapping)) {
    list($a, $count) = explode(':', $newest_xpath_mapping['source']);
    $default_source = $a . ':' . '0';
    $label = $form['source']['#options'][$default_source];
    unset($form['source']['#options'][$default_source]);
    $form['source']['#options'][$a . ':' . ++$count] = $label;
  }
  return $form;
}
