@extends('layouts/template')

@section('contents')
    <h2 class="card-title text-2xl">Designer Users</h2>
    <div class="divider m-0"></div>
    <table id="table" class="table table-zebra display text-xs">
        <thead>
            <tr>
                <th rowspan="2">User ID</th>
                <th rowspan="2">Department</th>
                <th rowspan="2">Section</th>
                <th colspan="4">Group</th>
                <th rowspan="2">Designer</th>
                <th rowspan="2">Checker</th>
            </tr>
            <tr>
                <th>EME</th>
                <th>EEL</th>
                <th>EAP</th>
                <th>ESO</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/des_users.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection

@section('styles')
    <style>
        .filterBtnDt {
            align-items: center !important;
            margin-left: 10px;
        }

        .filter-btn-dt:not(.btn-primary) {
            border: 1px solid var(--color-gray-500);
        }

        .filter-btn-dt.btn-primary {
            color: white;
        }
    </style>
@endsection
