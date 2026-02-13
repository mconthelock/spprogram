@extends('layouts/template')

@section('contents')
    <input type="text" name="inquiry-id" id="inquiry-id" value="{{ $id }}" class="hidden">
    <h2 class="card-title text-2xl">Inquiry Detail</h2>
    <div class="divider m-0"></div>
    <main id="form-container" class="grid grid-cols-1 lg:grid-cols-3 gap-6 font-xs" data="customers|info|mar"></main>

    <div class="mt-6">
        <div class="divider divider-start divider-primary">
            <span class="font-extrabold text-md text-primary ps-3">Detail</span>
        </div>
        <table id="table" class="table table-zebra table-edit text-xs"></table>
    </div>
    <div class="flex gap-2 my-3" id="btn-container"></div>

    <input type="checkbox" id="new-stock-item" class="modal-toggle" />
    <div class="modal" role="dialog">
        <div class="modal-box min-w-9/12">
            @include('layouts/datatable_load')
            <table id="table-price-list" class="table table-zebra table-second display text-xs"></table>
        </div>
    </div>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_inqstock.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
