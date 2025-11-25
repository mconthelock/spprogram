<?php
class Quotation extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index($id = 1){
        $this->views('mar/quotation/index', array(
            'title' => $id == 1 ? 'Issue Quotation List' : 'Quotation List',
            'id' => $id,
        ));
    }
    public function released(){
        $this->views('mar/quotation/index', array('title'=> 'Quotation List'));
    }

    public function weight(){
        $this->views('mar/quotation/index', array('title'=> 'Weight request List', 'type' => 'weight'));
    }

    public function create($id){
        $this->views('mar/quotation/detail', array('id'=> $id));
    }

    public function view($id){
        $this->views('mar/quotation/view', array('id'=> $id));
    }

    public function viewinq($id){
        $this->views('mar/quotation/view', array('id'=> $id, 'type' => 'inquiry'));
    }
}