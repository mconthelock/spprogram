<?php
class Inquiry extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->views('sale/inquiry/index', array('title' => 'Assign Engineer'));
    }

    public function detail($id){
        $this->views('sale/inquiry/detail', array('id'=> $id, 'title' => 'Inquiry Detail'));
    }

    public function show($id){
        $this->views('sale/inquiry/view', array('id'=> $id, 'title' => 'Inquiry View'));
    }

    public function report(){
        $this->views('sale/inquiry/report', array('title' => 'Inquiry Report'));
    }
}