@extends('layouts/template')

@section('contents')
    <h2 class="card-title text-2xl">Inquiry Default Values</h2>
    <div class="divider m-0"></div>
    <table id="table" class="table table-zebra"></table>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/inqcontrol.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
