@extends('layouts/template')

@section('contents')
    <h1 class="text-3xl font-sans font-[700] uppercase text-gray-700">On-Process Inquiry</h1>
    <div class="divider"></div>
    <table id="table" class="table table-zebra display text-xs"></table>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_inquiry.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection

@section('styles')
    <style>
        #table tbody tr td {
            padding-top: 8px;
            padding-bottom: 8px;
        }
    </style>
@endsection
