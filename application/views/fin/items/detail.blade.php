@extends('layouts/template')

@section('contents')
    <h2 class="card-title text-2xl">Direct Sale's item Management</h2>
    <input type="text" id="itemid" class="hidden" value="{{ $id }}" />
    <div class="divider m-0"></div>
    <div class="flex gap-8">
        <div class="flex-1">
            <div class="card">
                <div class="card-body bg-base-100 border border-gray-300 rounded-lg flex-row gap-6 p-8">
                    <div class="flex-1 max-w-200">
                        <fieldset class="fieldset flex gap-4">
                            <div class="flex-none">
                                <legend class="fieldset-legend">Item No.<span class="text-red-500">*</span></legend>
                                <input type="text" class="input w-full field-data req" data-map="ITEM_NO"
                                    maxlength="3" />
                            </div>
                            <div class="flex-1">
                                <legend class="fieldset-legend">Part Name<span class="text-red-500">*</span></legend>
                                <input type="text" class="input w-full field-data req" data-map="ITEM_NAME" />
                            </div>
                        </fieldset>

                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">Drawing No.<span class="text-red-500">*</span></legend>
                            <input type="text" class="input w-full field-data req uppercase" data-map="ITEM_DWG" />
                        </fieldset>

                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">Variable:</legend>
                            <textarea class="textarea w-full field-data uppercase" data-map="ITEM_VARIABLE"></textarea>
                        </fieldset>

                        <fieldset class="fieldset flex gap-4">
                            <div class="flex-1">
                                <legend class="fieldset-legend">Item Type</legend>
                                <select class="select w-full field-data" data-map="ITEM_TYPE">
                                    <option value="1" selected>Elevator Part</option>
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
                                <select class="select w-full field-data req" id="item-supplier" data-map="ITEM_SUPPLIER">
                                    <option value=""></option>
                                    <option value="AMEC" {{ $id ? '' : 'selected' }}>AMEC</option>
                                    <option value="MELINA">MELINA</option>
                                    <option value="LOCAL">LOCAL</option>
                                </select>
                            </div>

                            <div class="flex-1 hidden">
                                <legend class="fieldset-legend">Category<span class="text-red-500">*</span></legend>
                                <select class="select w-full field-data req" id="item-category" data-map="CATEGORY">
                                    <option disabled value=""></option>
                                    <option value="99" selected>FIN MASTER</option>
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
                                <legend class="fieldset-legend">Factory Cost<span class="text-red-500">*</span></legend>
                                <input type="text" class="input w-full field-data req price-change" data-map="FCCOST"
                                    id="fccost" />
                            </div>

                            <div class="flex-1">
                                <legend class="fieldset-legend">%<span class="text-red-500">*</span></legend>
                                <input type="text" class="input w-full field-data req price-change" data-map="FCBASE"
                                    value="1.3" id="fcrate" />
                            </div>

                            <div class="flex-1">
                                <legend class="fieldset-legend">Total Cost</legend>
                                <input type="text" class="input w-full field-data req" data-map="TCCOST" readonly
                                    id="tccost" />
                            </div>
                        </fieldset>
                        <div class="flex mt-3 gap-3" id="btn-container"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/fin_items_detail.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
