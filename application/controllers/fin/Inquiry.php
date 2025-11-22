<?php
class Inquiry extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->views('fin/inquiry/index', array(
            'title' => 'Inquiry Cost Management',
        ));
    }

    public function detail($id){
        $this->views('fin/inquiry/detail', array(
            'id' => $id,
        ));
    }

    public function report(){
        $this->views('fin/inquiry/report');
    }
}