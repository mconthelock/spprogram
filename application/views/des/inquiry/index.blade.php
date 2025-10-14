@extends('layouts/template')

@section('contents')
    <input type="text" id="minstatus" class="hiddenx" value="{{ $min }}">
    <input type="text" id="maxstatus" class="hiddenx" value="{{ $max }}">
    <h2 class="card-title text-2xl">{{ $title }}</h2>
    <div class="divider m-0"></div>
    <table id="table" class="table table-zebra display text-xs"></table>
@endsection


@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/des_inquiry.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
