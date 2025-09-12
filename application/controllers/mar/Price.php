<?php
class Price extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index($cus = "1"){
        $this->views('mar/pricelist/index', array('customer'=> $cus));
    }
}