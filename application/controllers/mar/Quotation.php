<?php
class Quotation extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index($id = 1){
        $this->views('mar/quotation/index', array(
            'title' => $id == 1 ? 'Issue Quotation List' : 'Quotation Release List',
            'id' => $id,
        ));
    }

    public function detail($id = 1){
        $this->views('mar/quotation/detail', array(
            'title' => $id == 1 ? 'Issue Quotation List' : 'Quotation List',
            'id' => $id,
        ));
    }
}