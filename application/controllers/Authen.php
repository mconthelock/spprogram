<?php
class Authen extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        // if(!isset($_SESSION['user'])){
        //     $this->session_expire();
        // }
        $this->views('home/index');
        //echo "xxx";
    }


    public function move(){
        $this->views('layouts/move');
    }

    public function setSession(){
        $_SESSION['user']  = (object)$_POST['info'];
        $_SESSION['group']  = (object)$_POST['group'];
        $_SESSION['menu']  = isset($_POST['menu']) ? (object)$_POST['menu']: [];
		$_SESSION['profile-img'] = $_POST['info']['image'];
         if($_SESSION['group'] != null && $_SESSION['group']->GROUP_HOME != null){
            $redir = $_SESSION['group']->GROUP_HOME;
        }else{
            $redir = '';
        }
        echo json_encode(['url' => $redir]);
    }
}