@extends('layouts/template')

@section('contents')
    <input type="text" name="inquiry-id" id="inquiry-id" value="{{ $id }}" class="hidden">
    <h2 class="card-title text-2xl">Inquiry Detail</h2>
    <div class="divider m-0"></div>
    <main id="form-container" class="grid grid-cols-1 lg:grid-cols-3 gap-6 font-xs" data="viewprj|viewinfo|viewmar"></main>

    <div class="mt-6">
        <div class="divider divider-start divider-primary">
            <span class="font-extrabold text-md text-primary ps-3">Detail</span>
        </div>
        <div class="tabs tabs-lift" id="tabs-lift">
            <label class="tab flex items-center gap-2">
                <input type="radio" name="my_tabs_4" checked="checked" />
                <i class="fi fi-tr-memo-circle-check text-xl"></i>
                <span class="font-bold ">Item Detail</span>
            </label>
            <div class="tab-content bg-base-100 border-base-300 p-6">
                <table id="table" class="table table-zebra table-detail display text-xs"></table>
            </div>

            <label class="tab flex items-center gap-2">
                <input type="radio" name="my_tabs_4" />
                <i class="fi fi-tr-equality text-xl"></i>
                <span class="font-bold ">Weight Package</span>
            </label>
            <div class="tab-content bg-base-100 border-base-300 p-6">
                <table id="table-weight" class="table table-zebra table-edit text-xs">
                    <thead>
                        <tr>
                            <th rowspan="2">Sort</th>
                            <th rowspan="2">No.</th>
                            <th rowspan="2">Package Type</th>
                            <th rowspan="2">No. Of Pack</th>
                            <th colspan="2">Weight</th>
                            <th colspan="3">Dimension</th>
                            <th colspan="2">Volume (CU.M)</th>
                        </tr>
                        <tr>
                            <th>Net Weight</th>
                            <th>Gross Weight</th>
                            <th>Width (W)</th>
                            <th>Length (L)</th>
                            <th>Height (H)</th>
                            <th>(W*L*H)*10<sup>-6</sup></th>
                            <th>Round Up</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="flex-1">
            <div class="divider divider-start divider-primary">
                <span class="font-extrabold text-md text-primary ps-3">History</span>
            </div>
            <table id="history" class="table table-zebra text-xs"></table>
        </div>
        <div class="flex-1 relative">
            <div class="divider divider-start divider-primary">
                <span class="font-extrabold text-md text-primary ps-3">Attachment</span>
            </div>
            <table id="attachment" class="table table-zebra text-xs"></table>
        </div>
    </div>
    <div class="flex gap-2 my-3" id="btn-container"></div>


    <input type="checkbox" id="elmes_modal" class="modal-toggle" />
    <div class="modal" role="dialog">
        <div class="modal-box min-w-10/12 min-h-10/12 rounded-md">
            <h3 class="text-lg font-bold">General Part List</h3>
            <p class="py-4">Add drawing into inquiry by search from General Part List</p>
            <input type="text" id="elmes-target" class="hiddenx">
            <table id="tableElmes" class="table table-zebra text-xs"></table>
        </div>
    </div>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/pkc_inquiry_detail.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection

@section('styles')
    <style>
        .table tfoot th {
            text-align: right !important;
        }
    </style>
@endsection
