@extends('layouts/template')

@section('contents')
    <h2 class="card-title text-2xl">Direct Sale's item Management</h2>
    <input type="text" id="itemid" class="hidden" value="{{ $id }}" />
    <div class="divider m-0"></div>
    <div class="flex gap-8">
        <div class="flex-1">
            <div class="card">
                <div class="card-header mb-3 ms-2 font-bold text-md text-gray-500">Item Detail</div>
                <div class="card-body bg-base-100 border border-gray-300 rounded-lg flex-row gap-6 p-8">
                    <div class="flex-1">
                        <fieldset class="fieldset flex gap-4">
                            <div class="flex-none">
                                <legend class="fieldset-legend">Item No.<span class="text-red-500">*</span></legend>
                                <input type="text" class="input w-full field-data" data-map="ITEM_NO" />
                            </div>
                            <div class="flex-1">
                                <legend class="fieldset-legend">Part Name<span class="text-red-500">*</span></legend>
                                <input type="text" class="input w-full field-data" data-map="ITEM_NAME" />
                            </div>
                        </fieldset>

                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">Drawing No.<span class="text-red-500">*</span></legend>
                            <input type="text" class="input w-full field-data" data-map="ITEM_DWG" />
                        </fieldset>

                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">Variable:</legend>
                            <textarea class="textarea w-full field-data" data-map="ITEM_VARIABLE"></textarea>
                        </fieldset>

                        <fieldset class="fieldset flex gap-4">
                            <div class="flex-1">
                                <legend class="fieldset-legend">Item Type</legend>
                                <select class="select w-full field-data" id="item-type" data-map="ITEM_TYPE">
                                    <option disabled selected value=""></option>
                                    <option value="1">Elevator Part</option>
                                    <option value="2">Escalator Part</option>
                                </select>
                            </div>

                            <div class="flex-1">
                                <legend class="fieldset-legend">Class</legend>
                                <select class="select w-full field-data" id="item-class" data-map="ITEM_CLASS">
                                    <option disabled selected value=""></option>
                                    <option value="Bulk Part">Bulk Part</option>
                                    <option value="Assembly Part">Assembly Part</option>
                                    <option value="Sub Assembly Part">Sub Assembly Part</option>
                                    <option value="JOP Orders Part">JOP Orders Part</option>
                                    <option value="Subcontract Part">Subcontract Part</option>
                                </select>
                            </div>

                            <div class="flex-1">
                                <legend class="fieldset-legend">Unit.</legend>
                                <input type="text" class="input w-full field-data" data-map="ITEM_UNIT" />
                            </div>
                        </fieldset>

                        <fieldset class="fieldset flex gap-4">
                            <div class="flex-1">
                                <legend class="fieldset-legend">Supplier<span class="text-red-500">*</span></legend>
                                <select class="select w-full field-data" id="item-supplier" data-map="ITEM_SUPPLIER">
                                    <option value=""></option>
                                    <option value="AMEC" {{ $id ? '' : 'selected' }}>AMEC</option>
                                    <option value="MELINA">MELINA</option>
                                    <option value="LOCAL">LOCAL</option>
                                </select>
                            </div>

                            <div class="flex-1">
                                <legend class="fieldset-legend">Category</legend>
                                <select class="select w-full field-data" id="item-category" data-map="CATEGORY">
                                    <option disabled selected value=""></option>
                                </select>
                            </div>

                            <div class="flex-1">
                                <legend class="fieldset-legend">Model</legend>
                                <input type="text" class="input w-full field-data" data-map="ITEM_MODEL" />
                            </div>
                        </fieldset>

                        <fieldset class="fieldset flex gap-4">
                            <div class="flex-1">
                                <legend class="fieldset-legend">AMEC PUR. Item Code</legend>
                                <input type="text" class="input w-full field-data" data-map="ITEM_AMEC_PUR" />
                            </div>

                            <div class="flex-1">
                                <legend class="fieldset-legend">Customer Item Code</legend>
                                <input type="text" class="input w-full field-data" data-map="ITEM_CUS_PUR" />
                            </div>
                        </fieldset>

                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">Remark:</legend>
                            <textarea class="textarea w-full field-data" data-map="ITEM_REMARK"></textarea>
                        </fieldset>

                        <fieldset class="fieldset flex gap-4">
                            <div class="flex-1">
                                <legend class="fieldset-legend">Factory Cost</legend>
                                <input type="text" class="input w-full field-data" data-map="FCCOST" />
                            </div>

                            <div class="flex-1">
                                <legend class="fieldset-legend">%</legend>
                                <input type="text" class="input w-full field-data" data-map="FCBASE" value="1.3"
                                    readonly />
                            </div>

                            <div class="flex-1">
                                <legend class="fieldset-legend">Total Cost</legend>
                                <input type="text" class="input w-full field-data" data-map="TCCOST" />
                            </div>
                        </fieldset>

                        <div class="flex mt-3 gap-3" id="action-row">
                            {{-- <button class="btn btn-primary text-white items-center" id="save-data" type="button"
                                data-action="{{ $id ? 'edit' : 'add' }}">
                                <span class="loading loading-spinner hidden"></span>
                                <span class="flex items-center"><i class="fi fi-sr-disk text-xl me-2"></i>Save
                                    Data</span>
                            </button>
                            <a class="btn btn-accent text-white items-center" href="{{ $_ENV['APP_ENV'] }}/mar/items">
                                <span class="loading loading-spinner hidden"></span>
                                <span class="flex items-center"><i
                                        class="fi fi-ts-arrow-circle-left text-xl me-2"></i>Back</span>
                            </a> --}}
                        </div>
                    </div>

                    <div class="flex-none w-80 mt-8">
                        <div class="card" id="image-dropzone">
                            {{-- <div
                                class="card-body bg-base-100 border border-gray-300 px-4 py-2 rounded-lg h-80 flex items-center justify-center">
                                <span class="text-gray-400">No Image</span>
                            </div> --}}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex-none w-80">
            <div class="card">
                <div class="card-header mb-3 ms-2 font-bold text-md text-gray-500">Customer</div>
                <div class="card-body bg-base-100 border border-gray-300 px-4 py-2 rounded-lg">
                    <ul class="menu " id="customer"></ul>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_items_detail.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection


@section('styles')
    <style>
        .drop-list img {
            width: 100% !important;
            max-width: 100%;
            height: auto;
        }

        .drop-remove,
        .drop-remove-db {
            background: transparent !important;
            right: 5px;
        }

        .drop-remove::before,
        .drop-remove-db::before {
            content: "\f422";
            font-family: uicons-solid-rounded !important;
            font-style: normal;
            background: transparent !important;
            /* display: block; */
            text-align: center;
            color: red;
            cursor: pointer;

        }
    </style>
@endsection
