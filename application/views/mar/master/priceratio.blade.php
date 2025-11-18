@extends('layouts/template')

@section('contents')
    <h2 class="card-title text-2xl">Price Ratio Management</h2>
    <div class="divider m-0"></div>
    <table id="table" class="table table-zebra display text-xs"></table>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/priceratio.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
