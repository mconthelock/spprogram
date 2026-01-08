<?php
class Orders extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->views('mar/orders/index', array('title'=> 'Secure Orders'));
    }
}