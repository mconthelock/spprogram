<?php
class Out2out extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->views('mar/quotation/index');
    }
}