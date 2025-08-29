@extends('layouts/template')

@section('contents')
    {{-- <img src="https://cdn.stocksnap.io/img-thumbs/960w/sea-sunset_F9QDZ3VENO.jpg" alt=""> --}}
@endsection


@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/home.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
