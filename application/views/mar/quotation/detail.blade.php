@extends('layouts/template')

@section('contents')
    <input type="text" id="inquiry-id" value="{{ $id }}" class="hidden">
    <input type="text" id="inquiry-mode" value="{{ $mode }}" class="hidden">
    <h2 class="card-title text-2xl" id="inquiry-title"></h2>
    <div class="divider m-0"></div>
    <main id="form-container" class="grid grid-cols-1 lg:grid-cols-3 gap-6 font-xs" data="{{ $list }}">
    </main>
    <div class="mt-6">
        <div class="divider divider-start divider-primary">
            <span class="font-extrabold text-md text-primary ps-3">Detail</span>
        </div>

        <div id="with-tab" class="">
            <div class="tabs tabs-lift hidden" id="tabs-lift">
                <label class="tab flex items-center gap-2">
                    <input type="radio" name="my_tabs_4" checked="checked" />
                    <i class="fi fi-tr-memo-circle-check text-xl"></i>
                    <span class="font-bold ">Item Detail</span>
                </label>
                <div class="tab-content bg-base-100 border-base-300 p-6">
                    <table id="table" class="table table-zebra display text-xs"></table>
                </div>

                <label class="tab flex items-center gap-2">
                    <input type="radio" name="my_tabs_4" />
                    <i class="fi fi-tr-equality text-xl"></i>
                    <span class="font-bold ">Weight Package</span>
                </label>
                <div class="tab-content bg-base-100 border-base-300 p-6">
                    <table id="table-weight" class="table table-zebra table-all-cell-border display text-xs">
                        <thead>
                            <tr>
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

        <div id="without-tab" class="">
            <table id="table" class="table table-zebra table-second table-edit display text-md!"></table>
        </div>

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

    <div class="flex gap-2 mt-5 mb-8" id="btn-container"></div>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_quodetail.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection

@section('styles')
    <style>
        #table tfoot tr th {
            background: #eee !important;
            font-weight: bold;
        }

        #table-freight thead th {
            font-size: 0.75rem;
            text-align: center;
            vertical-align: middle;
        }

        #table-freight tbody td {
            padding: 0 !important;
        }

        #table-freight input {
            text-align: right;
            width: 100%;
            box-sizing: border-box;
            border: none;
            outline: none;
            padding: 4px 8px;
        }

        #table-freight input:not([readonly]) {
            background: rgba(26, 188, 156, 0.3);
        }
    </style>
@endsection
