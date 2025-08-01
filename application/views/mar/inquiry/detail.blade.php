@extends('layouts/template')

@section('contents')
    <h1 class="text-3xl font-sans font-[700] uppercase mb-5 text-gray-700">Inquiry Detail</h1>
    <main id="form-container" class="grid grid-cols-1 lg:grid-cols-3 gap-6 font-xs" data="prj|info|mar"></main>

    <div class="mt-6">
        <table id="table" class="table table-zebra table-edit display text-sm"></table>
    </div>

    <div class="flex gap-4 mt-6">
        <div class="flex-1">
            <table id="history" class="table table-zebra display text-sm"></table>
        </div>
        <div class="flex-1">
            <table id="attachment" class="table table-zebra display text-sm"></table>
        </div>
    </div>

    <div class="flex gap-2 my-6" id="btn-container"></div>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_inqdetail.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
