@extends('layouts/template')

@section('contents')
    <h2 class="card-title text-2xl">On-Process Inquiry</h2>
    <div class="divider m-0"></div>
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
