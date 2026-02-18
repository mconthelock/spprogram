<?php
class Inquiry extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->views('sale/inquiry/index');
    }

    public function detail($id){
        $this->views('sale/inquiry/detail', array('id'=> $id));
    }

    public function show($id){
        $this->views('sale/inquiry/view', array('id'=> $id));
    }

    public function report(){
        $this->views('sale/inquiry/report');
    }
}