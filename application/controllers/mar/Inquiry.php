<?php
class Inquiry extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $data = array('title' => 'On-Process Inquiry', 'prebm' => '0');
        $this->views('mar/inquiry/index', $data);
    }

    public function prebm(){
        $data = array('title' => 'Pending Pre-BM Inquiry', 'prebm' => '1');
        $this->views('mar/inquiry/index', $data);
    }

    public function create(){
        $this->views('mar/inquiry/detail');
    }

    public function edit($id){
        $this->views('mar/inquiry/detail', array('id' => $id));
    }

    public function view($id){
        $this->views('mar/inquiry/view', array('id' => $id));
    }

    public function report(){
        $this->views('mar/inquiry/report');
    }

}