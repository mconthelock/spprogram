@extends('layouts/template')

@section('contents')
    <h1 class="text-3xl font-sans font-[900] uppercase mb-5 text-gray-700">On-Process Inquiry</h1>
    <table id="table" class="table table-zebra table-edit display text-xs"></table>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_inquiry.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
