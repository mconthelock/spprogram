<?php
class Inquiry extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->views('mar/inquiry/index');
    }

    public function create(){
        $this->views('mar/inquiry/detail');
    }

    public function view($id){
        $this->views('mar/inquiry/view', array('id' => $id));
    }

    public function edit($id){
        $this->views('mar/inquiry/edit', array('id' => $id));
    }
}