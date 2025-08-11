<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Error</title>
    <style type="text/css">
        html,
        body {
            font-family: Helvetica, Arial, sans-serif;
            min-width: 90vw;
            min-height: 90vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #container {
            background-image: url(https://amecweb.mitsubishielevatorasia.co.th/cdn/theme/assets/image/dribbble_1.gif);
            background-position: center;
            background-repeat: no-repeat;
            height: 500px;
            width: 100%;
        }

        #container h1,
        #container p,
        #container a {
            text-align: center;
            color: #697a8d;
        }
         #container div {
            text-align: center;
            color: #697a8d;
         }
         #container a {
            text-decoration: none;
            color: #697a8d;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div id="container">
        <h1><?php echo get_class($exception); ?></h1>
        <p><?php echo $message; ?></p>
        <div>
            <a href="http://localhost:8080/spprogram/">🛬 Go back</a>
        </div>
    </div>
</body>

</html>