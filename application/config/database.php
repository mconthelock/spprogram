<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$active_group = 'DEFAULT';
$query_builder = TRUE;

$list = $_ENV['DBLIST'];
foreach (explode(',', $list) as $db_name) {
    $db_name = trim($db_name);
    if (!empty($db_name)) {
        $db[$db_name] = array(
            'dsn'	=> '',
            'hostname' => $_ENV[strtoupper($db_name) . '_HOSTNAME'] || '',
            'username' => $_ENV[strtoupper($db_name) . '_USERNAME'] || '',
            'password' => $_ENV[strtoupper($db_name) . '_PASSWORD'] || '',
            'database' => $_ENV[strtoupper($db_name) . '_DATABASE'] || '',
            'dbdriver' => $_ENV[strtoupper($db_name) . '_DBDRIVER'] || '',
            'dbprefix' => '',
            'pconnect' => FALSE,
            'db_debug' => (ENVIRONMENT !== 'production'),
            'cache_on' => FALSE,
            'cachedir' => '',
            'char_set' => 'utf8',
            'dbcollat' => 'utf8_general_ci',
            'swap_pre' => '',
            'encrypt' => FALSE,
            'compress' => FALSE,
            'stricton' => FALSE,
            'failover' => array(),
            'save_queries' => TRUE
        );
    }
}