<?php
class Quotation extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->views('mar/quotation/index');
    }

    public function released(){
        $this->views('mar/quotation/index');
    }

    public function weight(){
        $this->views('mar/quotation/index');
    }

    public function create(){
        $this->views('mar/quotation/detail');
    }

    public function view($id){
        $this->views('mar/quotation/view', array('id'=> $id));
    }
}