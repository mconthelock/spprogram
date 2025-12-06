@extends('layouts/template')

@section('contents')
    <h2 class="card-title text-2xl">Price Management</h2>
    <div class="divider m-0"></div>
    <table id="table" class="table table-zebra display text-xs table-second">
        <thead>
            <tr>
                <th rowspan="2">Item</th>
                <th rowspan="2">Part Name</th>
                <th rowspan="2">Drawing</th>
                <th rowspan="2">Variable</th>
                <th rowspan="2">Class</th>
                <th rowspan="2">Unit</th>
                <th colspan="3" id="current-period"></th>
                <th colspan="3" id="last-period"></th>
            </tr>
            <tr>
                <th>Factory Cost</th>
                <th>%</th>
                <th>Total Cost</th>
                <th>Factory Cost</th>
                <th>%</th>
                <th>Total Cost</th>
            </tr>
        </thead>
    </table>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/fin_pricelist.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
