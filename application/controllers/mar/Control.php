<?php
class Control extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->views('mar/master/control');
    }
}