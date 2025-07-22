@extends('layouts/template')

@section('contents')
    <h1 class="text-3xl font-sans font-[900] uppercase mb-5 text-gray-700">Inquiry Default values Setting</h1>
    <table id="table" class="table table-zebra"></table>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/priceratio.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
