<?php
class Inquiry extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->views('des/inquiry/index', array('title' => 'Assign Designer', 'pageid' => 1));
    }

    public function design(){
        $this->views('des/inquiry/index', array('title' => 'Declare Inquiry', 'pageid' => 2));
    }

    public function check(){
        $this->views('des/inquiry/index', array('title' => 'Recheck Inquiry',  'pageid' => 3));
    }

    public function reassign(){
        $this->views('des/inquiry/index', array('title' => 'Reassign Designer'));
    }

    public function report(){
       $this->views('des/inquiry/report', array('title' => 'Report'));
    }

    public function detail($id){
        $this->views('des/inquiry/detail', array('title' => 'Inquiry Detail', 'id' => $id));
    }

   public function show($id){
        $this->views('des/inquiry/view', array('id'=> $id, 'title' => 'Inquiry View'));
    }
}