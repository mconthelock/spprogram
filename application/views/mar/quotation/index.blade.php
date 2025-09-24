@extends('layouts/template')

@section('contents')
    <input type="text" id="prebm" class="hidden" value="{{ $prebm }}">
    <h2 class="card-title text-2xl">{{ $title }}</h2>
    <div class="divider m-0"></div>
    <table id="table" class="table table-zebra display text-xs"></table>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_quotation.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
