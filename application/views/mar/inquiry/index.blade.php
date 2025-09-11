@extends('layouts/template')

@section('contents')
    <h2 class="card-title text-2xl">On-Process Inquiry</h2>
    <div class="divider m-0"></div>
    <table id="table" class="table table-zebra display text-xs"></table>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_inquiry.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
