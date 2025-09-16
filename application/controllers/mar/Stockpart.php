<?php
class Stockpart extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

     public function create(){
        $this->views('mar/stockpart/detail');
    }
}
