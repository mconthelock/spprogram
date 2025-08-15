@extends('layouts/template')

@section('contents')
    <input type="text" id="inquiry-id" value="{{ $id }}" class="hidden">
    <h1 class="text-3xl font-sans font-[700] uppercase mb-5 text-gray-700" id="inquiry-title"></h1>
    <main id="form-container" class="grid grid-cols-1 lg:grid-cols-3 gap-6 font-xs" data="viewprj|viewinfo|viewmar"></main>
    <div class="mt-6">
        <table id="table" class="table table-zebra text-xs"></table>
    </div>
    <div class="flex gap-4 mt-6">
        <div class="flex-1">
            <table id="history" class="table table-zebra display text-xs"></table>
        </div>
        <div class="flex-1">
            <table id="attachment" class="table table-zebra display text-xs"></table>
        </div>
    </div>
    <div class="flex gap-2 mt-1 mb-8" id="btn-container"></div>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_inqviews.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
