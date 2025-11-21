<?php
class Price extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->views('fin/items/index');
    }

    public function detail($id = ''){
        $this->views('fin/items/detail', array('id' => $id));
    }
}