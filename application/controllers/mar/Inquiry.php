<?php
class Inquiry extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index($id = 1){
        $this->views('mar/inquiry/index', array(
            'title' => $id == 1 ? 'On-Process Inquiry' : 'Pending pre-BM Inquiry',
            'id' => $id,
        ));
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