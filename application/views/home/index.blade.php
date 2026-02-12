@extends('layouts/template')

@section('contents')
@endsection


@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/home.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
