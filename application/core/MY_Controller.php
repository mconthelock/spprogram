<?php
    defined('BASEPATH') OR exit('No direct script access allowed');
    use Coolpraz\PhpBlade\PhpBlade;
    class MY_Controller extends CI_Controller {
        protected $views = APPPATH . 'views';
        protected $cache = APPPATH . 'cache';
        protected $blade;
        protected $callback;

        public function __construct(){
            parent::__construct();
            $this->blade = new PhpBlade($this->views, $this->cache);
            $GLOBALS['version'] = $_ENV['STATE'] == 'development' ? time() : $_ENV['VERSION'];
            //$this->callback = $_ENV['APP_HOST'].'/form/authen/index/99/';
            //$this->callback = 'https://' . $_SERVER['HTTP_HOST'].'/wsd';
            //$this->session_expire();
            // $this->load->database();
            // $this->load->library('mail');
        }

        public function views($view_name, $data = array()){
            echo $this->blade->view()->make($view_name, $data);
        }

        public function session_expire(){
            if(!isset($_SESSION['user'])){
                if ($this->isAjaxRequest()) {
                    echo json_encode(['status' => '403', 'url' => $this->callback]);
                    exit;
                } else {
                    redirect($this->callback);
                    session_write_close();
                    exit;
                }
            }

            return;
        }

        public function isAjaxRequest() {
            return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
        }

        public function _servername(){
            return strtolower(preg_replace('/\d+/u', '', gethostname()));
        }
    }