<?php
class Inquiry extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){

    }

    public function create(){
        $this->views('mar/inquiry/detail');
    }
}