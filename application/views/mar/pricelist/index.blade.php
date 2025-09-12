@extends('layouts/template')

@section('contents')
    <input type="text" id="selected-customer" value="{{ $customer }}">
    <h2 class="card-title text-2xl" id="page-title">Price List</h2>
    <div class="divider m-0"></div>
    <table id="table" class="table table-zebra display text-xs"></table>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_pricelist.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
