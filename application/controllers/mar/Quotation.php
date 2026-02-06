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

    public function detail($id, $mode = 1){
        $lists = array('quotation|viewinfo|mar', 'quotation|viewinfo|maruser', 'quotation|viewinfo|viewmar');
        $data = array(
            'id' => $id,
            'list' => $lists[$mode-1],
            'mode' => $mode,
        );
        $this->views('mar/quotation/detail', $data);
    }

     public function preview($id = 1){
        $this->views('mar/quotation/preview', array(
            'title' => $id == 1 ? 'Issue Quotation List' : 'Quotation List',
            'id' => $id,
        ));
    }

    public function outtoout(){
        $this->views('mar/quotation/out2out', array(
            'title' => 'Import Out-Out Quotation',
        ));
    }
}