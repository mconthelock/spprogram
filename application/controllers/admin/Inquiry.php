<?php
class Inquiry extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->views('admin/inquiry/index', array('title' => 'Inquiry List', 'pageid' => 1));
    }

    public function show($id){
        $this->views('admin/inquiry/view', array('id' => $id));
    }

    public function directsale(){
        $this->views('admin/inquiry/price', array('title' => 'Inquiry List For create Price Master'));
    }
}