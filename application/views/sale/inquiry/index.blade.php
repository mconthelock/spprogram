@extends('layouts/template')

@section('contents')
    <input type="text" id="pageid" class="hidden" value="{{ $pageid }}">
    <h2 class="card-title text-2xl" id="page-title">{{ $title }}</h2>
    <div class="divider m-0"></div>

    @include('layouts/datatable_load')
    <table id="table" class="table table-zebra display text-xs"></table>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/sale_inquiry.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
