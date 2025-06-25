<?php
class Home extends MY_Controller {
    public function __construct(){
        parent::__construct();
        $this->session_expire();
    }

    public function index(){
        $this->views('home/index');
    }
}