@extends('layouts/template')

@section('contents')
    <h2 class="card-title text-2xl">Inquiry Default Values</h2>
    <div class="divider m-0"></div>
    <table id="table" class="table table-zebra"></table>
    <div class="mb-1">
        <h3 class="text-sm text-gray-500 mb-2">*In case add new item, Please contact the administrator.</h3>
    </div>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/inqcontrol.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
