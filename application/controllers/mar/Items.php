<?php
class Items extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->views('mar/items/index');
    }

    public function detail($id = ''){
        $this->views('mar/items/detail', array('id' => $id));
    }
}