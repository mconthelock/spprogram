@extends('layouts/template')

@section('contents')
    <input type="text" id="inquiry-id" value="{{ $id }}" class="hidden">
    <h2 class="card-title text-2xl" id="inquiry-title">Inquiry Detail</h2>
    <div class="divider m-0"></div>
    <main id="form-container" class="grid grid-cols-1 lg:grid-cols-3 gap-6 font-xs" data="viewprj|viewinfo|viewmar"></main>

    <div class="mt-6">
        <div class="divider divider-start divider-primary">
            <span class="font-extrabold text-md text-primary ps-3">Detail</span>
        </div>
        <table id="table" class="table table-zebra display text-sm"></table>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3">
        <div class="flex-1">
            <div class="divider divider-start divider-primary">
                <span class="font-extrabold text-md text-primary ps-3">History</span>
            </div>
            <table id="history" class="table table-zebra display text-sm"></table>
        </div>
        <div class="flex-1 relative">
            <div class="divider divider-start divider-primary">
                <span class="font-extrabold text-md text-primary ps-3">Attachment</span>
            </div>
            <table id="attachment" class="table table-zebra display text-sm"></table>
        </div>
    </div>

    <div class="flex gap-2 mt-1 mb-8" id="btn-container"></div>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_inqviews.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection

@section('styles')
    <style>
        /* #table thead tr th, */
        #table tbody tr td {
            /* padding: 8px 7px !important; */
            border: 1px solid rgba(125, 125, 125, .5);
        }
    </style>
@endsection
