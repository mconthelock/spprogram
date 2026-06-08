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
}