<?php
class Inquiry extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index($id = 1){
        $this->views('fin/inquiry/index', array(
            'title' => $id == 1 ? 'Inquiry\'s Cost Management' : 'Cost Confirmed Inquiry',
            'id' => $id,
        ));
    }

    public function detail($id){
        $this->views('fin/inquiry/detail', array(
            'id' => $id,
        ));
    }

    public function view($id){
        $this->views('fin/inquiry/detail', array(
            'id' => $id,
        ));
    }

    public function report(){
        $this->views('fin/inquiry/report');
    }
}