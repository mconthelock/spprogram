<?php
class Quotation extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->views('mar/quotation/index', array('title'=> 'Issue Quotation List'));
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