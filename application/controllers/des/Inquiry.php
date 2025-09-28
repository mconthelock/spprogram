<?php
class Inquiry extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->views('des/inquiry/index', array('title' => 'Assign Designer', 'type' => 20));
    }

    public function design(){
        $this->views('des/inquiry/index', array('title' => 'Declare Inquiry', 'type' => 20));
    }

    public function check(){
        $this->views('des/inquiry/index', array('title' => 'Recheck Inquiry', 'type' => 21));
    }

    public function reassign(){
        $this->views('des/inquiry/index', array('title' => 'Reassign Designer', 'type' => 'reassign'));
    }

    public function report(){
        $this->views('des/inquiry/report', array('title' => 'Report', 'type' => 'report'));
    }

}