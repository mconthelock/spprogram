<?php
class Inquiry extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->views('pkc/inquiry/index');
    }

    public function detail($id){
        $this->views('pkc/inquiry/detail', ['id' => $id]);
    }
}