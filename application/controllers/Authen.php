<?php
class Authen extends MY_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function move(){
        $this->views('layouts/move');
    }

    public function error(){
        throw new Exception("API Server is not ready to service 😒😒<br/> Please contact Administrator.");
    }

    public function setSession(){
        $_SESSION['user']  = (object)$_POST['info'];
        $_SESSION['group']  = (object)$_POST['group'];
        $_SESSION['menu']  = isset($_POST['menu']) ? (object)$_POST['menu']: [];
         if($_SESSION['group'] != null && $_SESSION['group']->GROUP_HOME != null){
            $redir = $_SESSION['group']->GROUP_HOME;
        }else{
            $redir = '';
        }
        echo json_encode(['url' => $redir]);
    }

    public function logout(){
        unset($_SESSION['user']);
        unset($_SESSION['group']);
        unset($_SESSION['menu']);
        redirect($this->callback);
    }
}