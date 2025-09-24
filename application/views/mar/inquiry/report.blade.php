@extends('layouts/template')

@section('contents')
    <h2 class="card-title text-2xl">Inquiry Report</h2>
    <div class="divider m-0"></div>

    {{-- <div id="start-report" class="flex justify-center my-6 min-h-[50vh]">
        <span class="loading loading-spinner"></span>
    </div> --}}

    <table id="table" class="table table-zebra display text-xs"></table>

    <form action="#" id="form-container" class="hidden" autocomplete="off">
        <div class="flex gap-8">
            <div class="flex-1 flex flex-col py-6 px-12 bg-white rounded-lg shadow">
                <div class="divider divider-start font-bold text-primary">Search By Inquiry Information</div>
                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Inquiry No.</legend>
                    <input type="text" class="input w-full uppercase" name="LIKE_INQ_NO" placeholder="" />
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Inquiry Date</legend>
                    <div class="flex w-full items-center">
                        <label class="input">
                            <input type="text" class="grow fdate" placeholder="yyyy-mm-dd" name="GE_INQ_DATE" />
                            <i class="fi fi-tr-calendar-clock text-xl"></i>
                        </label>
                        <div class="divider divider-horizontal"><i class="fi fi-ts-arrow-right text-2xl"></i></div>
                        <label class="input">
                            <input type="text" class="grow fdate" placeholder="yyyy-mm-dd" name="LE_INQ_DATE" />
                            <i class="fi fi-tr-calendar-clock text-xl"></i>
                        </label>
                    </div>
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">MAR Send Date</legend>
                    <div class="flex w-full items-center">
                        <label class="input">
                            <input type="text" class="grow fdate" placeholder="yyyy-mm-dd" name="timeline.GE_MAR_SEND" />
                            <i class="fi fi-tr-calendar-clock text-xl"></i>
                        </label>
                        <div class="divider divider-horizontal"><i class="fi fi-ts-arrow-right text-2xl"></i></div>
                        <label class="input">
                            <input type="text" class="grow fdate" placeholder="yyyy-mm-dd" name="timeline.LE_MAR_SEND" />
                            <i class="fi fi-tr-calendar-clock text-xl"></i>
                        </label>
                    </div>
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Trader</legend>
                    <select class="select w-full" id="trader" name="INQ_TRADER">
                        <option disabled selected></option>
                    </select>
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Agent</legend>
                    <select class="select w-full" id="agent" name="INQ_AGENT">
                        <option disabled selected></option>
                    </select>
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Country</legend>
                    <select class="select w-full" id="country" name="INQ_COUNTRY">
                        <option disabled selected></option>
                    </select>
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Status</legend>
                    <select class="select w-full" id="status" name="INQ_STATUS">
                        <option disabled selected></option>
                    </select>
                </fieldset>
            </div>

            <div class="flex-1 flex flex-col py-6 px-12 bg-white rounded-lg shadow">
                <div class="divider divider-start font-bold text-primary">Search By Original Project</div>
                <fieldset class="fieldset">
                    <legend class="fieldset-legend ">Project No</legend>
                    <input type="text" class="input w-full uppercase" placeholder="" name="LIKE_INQ_PRJNO" />
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Project Name</legend>
                    <input type="text" class="input w-full" placeholder="" name="LIKE_INQ_PRJNAME" />
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Shop Order</legend>
                    <input type="text" class="input w-full" placeholder="" name="LIKE_INQ_SHOPORDER" />
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Series</legend>
                    <select class="select w-full" id="series" name="INQ_SERIES">
                    </select>
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Order Type</legend>
                    <select class="select w-full" id="ordertype" name="INQ_ORDER_TYPE"></select>
                </fieldset>

                <div class="divider divider-start font-bold text-primary">Search by Quotation Info.</div>
                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Issue Date</legend>
                    <div class="flex w-full items-center">
                        <label class="input">
                            <input type="text" class="grow fdate" placeholder="yyyy-mm-dd"
                                name="quotation.GE_QUO_DATE" />
                            <i class="fi fi-tr-calendar-clock text-xl"></i>
                        </label>
                        <div class="divider divider-horizontal"><i class="fi fi-ts-arrow-right text-2xl"></i></div>
                        <label class="input">
                            <input type="text" class="grow fdate" placeholder="yyyy-mm-dd" name="LE_QUO_DATE" />
                            <i class="fi fi-tr-calendar-clock text-xl"></i>
                        </label>
                    </div>
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Validation Date</legend>
                    <div class="flex w-full items-center">
                        <label class="input">
                            <input type="text" class="grow fdate" placeholder="yyyy-mm-dd"
                                name="quotation.GE_QUO_VALIDITY" />
                            <i class="fi fi-tr-calendar-clock text-xl"></i>
                        </label>
                        <div class="divider divider-horizontal"><i class="fi fi-ts-arrow-right text-2xl"></i></div>
                        <label class="input">
                            <input type="text" class="grow fdate" placeholder="yyyy-mm-dd"
                                name="quotation.LE_QUO_VALIDITY" />
                            <i class="fi fi-tr-calendar-clock text-xl"></i>
                        </label>
                    </div>
                </fieldset>
            </div>
        </div>
        <div class="flex justify-start my-3 gap-3">
            <a href="#" id="search" class="btn btn-primary rounded-none text-white">
                <i class="fi fi-ts-assessment text-xl"></i>Search
            </a>
            <button type="reset" class="btn btn-outline btn-neutral rounded-none" id="reset-form">
                <i class="fi fi-ts-feedback-cycle-loop text-xl"></i>Reset
            </button>
        </div>
    </form>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_inq_report.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
