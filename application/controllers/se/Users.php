<?php
class Users extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->views('sale/users/index');
    }
}