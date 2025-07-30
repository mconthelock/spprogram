@extends('layouts/template')

@section('contents')
    <h1 class="text-3xl font-sans font-[700] uppercase mb-5 text-gray-700">Inquiry Detail</h1>
    <main id="form-container" class="grid grid-cols-1 lg:grid-cols-3 gap-6 font-xs" data="prj|info|mar"></main>
    <div class="bg-white p-3 sm:p-4 rounded-xl shadow-lg my-5">
        <table id="table" class="table table-zebra table-edit display text-xs"></table>
    </div>
    <div class="flex gap-4 mb-6">
        <div class="bg-white p-3 sm:p-4 rounded-xl shadow-xl flex-1">
            <table id="history"></table>
        </div>
        <div class="bg-white p-3 sm:p-4 rounded-xl shadow-xl flex-1">
            <table id="attachment"></table>
        </div>
    </div>
    <div class="flex gap-2 mb-6" id="btn-container"></div>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_inqdetail.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
