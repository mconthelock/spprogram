<!DOCTYPE html>
<html lang="en" data-theme="light">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    <meta name="base_url" content="{{ $_ENV['APP_ENV'] }}">
    <meta name="appname" content="{{ $_ENV['APP_NAME'] }}">
    <meta name="appstatus" content="{{ $_ENV['STATE'] }}">
    <meta name="theme-color" content="#C0C0C0">
    <title>SPARE PART 🚀 DIRECT SALE PART [2025 Version]</title>

    <link rel="manifest" href="{{ $_ENV['APP_ENV'] }}/manifest.json">
    <link rel="shortcut icon" href="{{ $_ENV['APP_IMG'] }}/favicon.ico">
    <link rel="apple-touch-icon" href="{{ $_ENV['APP_IMG'] }}/favicon.ico">
    <link rel="apple-touch-startup-image" href="{{ $_ENV['APP_IMG'] }}/cube.png">
    <link rel="stylesheet" href="{{ $_ENV['APP_CSS'] }}/tailwind.css?ver={{ $GLOBALS['version'] }}">
    @yield('styles')

    <script src="{{ $_ENV['APP_ENV'] }}/script.js"></script>
</head>

<body class="flex flex-col min-h-screen">
    <input type="hidden" id="appid" value="{{ $_ENV['APP_ID'] }}">
    <div id="big-screen" class="hidden md:block">
        <!-- Navbar -->
        <div id="navbar" class="max-w-full!"></div>
        <div class="drawer md:drawer-open">
            <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content flex flex-col items-center justify-start w-full h-full">
                <!-- Page content here -->
                <div class="flex-1 flex flex-col w-full px-4 my-5 md:px-4">
                    <div class="card bg-primary/5 border border-primary/30 min-h-[calc(100vh-3rem)]">
                        <div class="card-body">
                            @yield('contents')
                        </div>
                    </div>
                </div>
            </div>
            <div class="drawer-side z-51! md:px-3 md:py-5">
                <div id="sidebar" class="max-h-[75vh]"></div>
            </div>
        </div>
    </div>
    <div class="toast toast-end z-50 min-w-80" id="toast-alert"></div>
    <script src="{{ $_ENV['APP_JS'] }}/apps.js?ver={{ $GLOBALS['version'] }}"></script>
    @section('scripts')
    @show
</body>

</html>
