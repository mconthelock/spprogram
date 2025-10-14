<?php
class Inquiry extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->views('des/inquiry/index', array('title' => 'Assign Designer', 'min' => 12, 'max' => 20));
    }

    public function design(){
        $this->views('des/inquiry/index', array('title' => 'Declare Inquiry', 'min' => 21, 'max' => 22));
    }

    public function check(){
        $this->views('des/inquiry/index', array('title' => 'Recheck Inquiry', 'min' => 23, 'max' => 25));
    }

    public function reassign(){
        $this->views('des/inquiry/index', array('title' => 'Reassign Designer'));
    }

    public function report(){
        $this->views('des/inquiry/report', array('title' => 'Report', 'type' => 'report'));
    }

    public function detail($id){
        $this->views('des/inquiry/detail', array('title' => 'Inquiry Detail', 'id' => $id));
    }
    public function view(){
        $this->views('des/inquiry/view', array('title' => 'Inquiry View'));
    }
}