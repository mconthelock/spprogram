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
        <table id="table" class="table table-zebra table-edit display text-sm"></table>
    </div>
    <div class="flex gap-2 my-3" id="btn-container"></div>

    <input type="checkbox" id="new-stock-item" class="modal-toggle" />
    <div class="modal " role="dialog">
        <div class="modal-box w-full rounded-none min-w-[100vw] min-h-[100vh]">
            <h3 class="text-lg font-bold pb-2">Price List item!</h3>
            <table id="table-price-list" class="table table-zebra table-edit display text-sm"></table>
            <div class="flex gap-3 mt-5">
                <button class="btn btn-primary rounded-none text-white hover:bg-primary/70" type="button"
                    id="price-list-confirm"><i class="fi fi-rr-insert text-xl"></i>Confirm</button>
                <button class="btn btn-error rounded-none" type="button" id="price-list-cancel"><i
                        class="fi fi-bs-cross text-xl"></i>Cancel</button>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/inquiryui.js?ver={{ $GLOBALS['version'] }}"></script>
    <script src="{{ $_ENV['APP_JS'] }}/mar_inqstock.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection

@section('styles')
    <style>
        #table tbody tr td.item-no {
            background-color: rgba(59, 186, 158, 0.25) !important;
        }

        #table tbody tr td input {
            background: transparent !important;
            border: none !important;
        }

        #table-price-list thead tr th:first-child::after {
            display: none;
        }
    </style>
@endsection
