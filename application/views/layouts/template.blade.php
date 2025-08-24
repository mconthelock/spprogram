<!DOCTYPE html>
<html lang="en" data-theme="light">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="base_url" content="{{ $_ENV['APP_HOST'] }}">
    <meta name="appname" content="{{ $_ENV['APP_NAME'] }}">
    <meta name="appstatus" content="{{ $_ENV['STATE'] }}">
    <link rel="manifest" href="{{ $_ENV['APP_HOST'] }}manifest.json">
    <meta name="theme-color" content="#C0C0C0">
    <link rel="shortcut icon" href="{{ $_ENV['APP_IMG'] }}/favicon.ico">
    <link rel="apple-touch-icon" href="{{ $_ENV['APP_IMG'] }}/favicon.ico">
    <link rel="apple-touch-startup-image" href="{{ $_ENV['APP_IMG'] }}/icon_512.png">
    <title>SPARE PART 🚀 DIRECT SALE PART [2025 Version]</title>
    <link rel="stylesheet" href="{{ $_ENV['APP_CDN'] }}/select2/css/select2.min.css">
    <link rel="stylesheet"
        href="{{ $_ENV['APP_HOST'] }}/form/assets/dist/css/tailwind.css?ver={{ $GLOBALS['version'] }}">
    <link rel="stylesheet" href="{{ $_ENV['APP_CSS'] }}/tailwind.css?ver={{ $GLOBALS['version'] }}">
    <script src="{{ $_ENV['APP_HOST'] }}script.js"></script>
    @yield('styles')
</head>

<body class="flex flex-col min-h-screen">
    <div class="drawer md:drawer-open md:sidebar-collapsed" id="drawer-wrapper">
        <input id="mastermenu" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col items-center justify-start w-full h-full">
            <!-- Navbar -->
            <div id="navbar" class=""></div>
            <!-- Page content here -->
            <div class="flex-1 flex flex-col w-full px-4 md:px-8 mt-20 md:mt-4">
                @yield('contents')
            </div>
            <!-- Footer -->
            {{-- @include('layouts.footer') --}}
        </div>
        <div class="drawer-side bg-white" style="box-shadow: 8px 0 12px rgba(0,0,0,0.25);">
            <div id="sidebar"></div>
        </div>
    </div>

    {{-- <input type="checkbox" id="loading-box" class="modal-toggle" />
    <div class="modal" role="dialog">
        <div class="loader"></div>
    </div> --}}

    <dialog id="confirm_box" class="modal">
        <div class="modal-box">
            <form method="dialog" class="">
                <h3 class="text-lg font-bold flex items-center gap-3" id="confirm_title"></h3>
                <p class="py-4" id="confirm_message"></p>
                <textarea class="textarea textarea-bordered w-full h-24 hidden" id="confirm_reason"
                    placeholder="Please enter your reson"></textarea>
                <span class="text-xs text-red-500" id="confirm_error"></span>
                <input type="hidden" id="confirm_key">
                <div class="modal-action">
                    <button class="btn btn-primary text-white" id="confirm_accept"><span
                            class="loading loading-spinner hidden"></span>
                        Confirm</button>
                    <button class="btn btn-error text-white" id="confirm_close">Discard</button>
                </div>
            </form>
        </div>
    </dialog>

    <input type="checkbox" id="handleErrorBox" class="modal-toggle" />
    <div class="modal" role="dialog">
        <div class="modal-box">
            <h3 class="text-lg font-bold text-red-500"><i class="icofont-warning-alt text-2xl mr-1"></i> System Error!
            </h3>
            <div id="handleErrorBox_msg" class="py-4">
                <h1 class="pb-5"></h1>
                <div class="w-full text-xs text-center text-gray-600">Automatic reload within:</div>
                <div class="countdown font-mono w-full justify-center">
                    <span class="text-6xl" id="countdown" style="--value:10;" aria-live="polite" aria-label="10"></span>
                </div>
            </div>
        </div>
    </div>

    <div class="toast toast-end z-50" id="toast-alert"></div>
    <script src="{{ $_ENV['APP_JS'] }}/app.js?ver={{ $GLOBALS['version'] }}"></script>
    @yield('scripts')
</body>

</html>
