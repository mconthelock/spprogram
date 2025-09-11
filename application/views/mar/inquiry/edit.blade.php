@extends('layouts/template')

@section('contents')
    <input type="hidden" name="inquiry-id" id="inquiry-id" value="{{ $id }}">
    <h2 class="card-title text-2xl">Inquiry Detail</h2>
    <main id="form-container" class="grid grid-cols-1 lg:grid-cols-3 gap-6 font-xs" data="prj|info|mar"></main>

    <div class="mt-6">
        <table id="table" class="table table-zebra table-edit display text-sm"></table>
    </div>

    <div class="flex gap-4 mt-6">
        <div class="flex-1">
            <table id="history" class="table table-zebra display text-xs"></table>
        </div>
        <div class="flex-1">
            <table id="attachment" class="table table-zebra display text-xs"></table>
        </div>
    </div>

    <div class="flex gap-2 mt-2 mb-8" id="btn-container"></div>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_inqedit.js?ver={{ $GLOBALS['version'] }}"></script>
    <script src="{{ $_ENV['APP_JS'] }}/inquiryui.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
