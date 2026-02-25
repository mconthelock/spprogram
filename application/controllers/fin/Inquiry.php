<?php
class Inquiry extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index($id = 1){
        $this->views('fin/inquiry/index', array(
            'title' => 'Inquiry\'s Cost Management',
            'id' => $id,
        ));
    }

    public function detail($id, $mode = 1){
        $this->views('fin/inquiry/detail', array(
            'id' => $id,
            'mode'=>  $mode
        ));
    }

    public function show($id, $mode = 4){
        $this->views('fin/inquiry/detail', array(
            'id' => $id,
            'mode'=>  $mode
        ));
    }

    public function report($id = 1){
        $this->views('fin/inquiry/report', array(
            'id' => $id
        ));
    }
}