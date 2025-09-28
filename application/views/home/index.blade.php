@extends('layouts/template')

@section('contents')
    <i class="fi fi-tr-subscription-user"></i>
@endsection


@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/home.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
