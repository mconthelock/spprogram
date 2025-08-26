@extends('layouts/template')

@section('contents')
    <h1 class="text-3xl font-sans font-[900] uppercase text-gray-700">Part supply inquiry</h1>
    <div class="divider"></div>
    <table id="table" class="table table-zebra display text-xs"></table>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/se_inquiry.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
