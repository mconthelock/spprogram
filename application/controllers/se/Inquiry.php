<?php
class Inquiry extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->views('sale/inquiry/index');
    }

    public function edit($id){
        $this->views('sale/inquiry/edit', array('id'=> $id));
    }

    public function detail($id){
        $this->views('sale/inquiry/edit', array('id'=> $id));
    }

    public function view($id){
        $this->views('sale/inquiry/view', array('id'=> $id));
    }
}