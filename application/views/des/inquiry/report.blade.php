@extends('layouts/template')

@section('contents')
    <h2 class="card-title text-2xl">Inquiry Report</h2>
    <div class="divider m-0"></div>
    <form action="#" id="form-container" class="hidden" autocomplete="off">
        <input type="text" name="INQ_TYPE" value="SP" class="hidden">
        <div class="flex gap-8">
            <div class="flex-1 flex flex-col py-6 px-12 bg-white rounded-lg shadow">
                <div class="divider divider-start font-bold text-primary">Search By Inquiry Information</div>
                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Inquiry No.</legend>
                    <input type="text" class="input w-full uppercase" name="INQ_NO" placeholder="" />
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Inquiry Date</legend>
                    <div class="flex w-full items-center">
                        <label class="input">
                            <input type="text" class="grow fdate sdate-report" placeholder="yyyy-mm-dd"
                                name="START_INQ_DATE" />
                            <i class="fi fi-tr-calendar-clock text-xl"></i>
                        </label>
                        <div class="divider divider-horizontal"><i class="fi fi-ts-arrow-right text-2xl"></i></div>
                        <label class="input">
                            <input type="text" class="grow fdate edate-report" placeholder="yyyy-mm-dd"
                                name="END_INQ_DATE" />
                            <i class="fi fi-tr-calendar-clock text-xl"></i>
                        </label>
                    </div>
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">MAR Send Date</legend>
                    <div class="flex w-full items-center">
                        <label class="input">
                            <input type="text" class="grow fdate sdate-report" placeholder="yyyy-mm-dd"
                                name="timeline.START_MAR_SEND" />
                            <i class="fi fi-tr-calendar-clock text-xl"></i>
                        </label>
                        <div class="divider divider-horizontal"><i class="fi fi-ts-arrow-right text-2xl"></i></div>
                        <label class="input">
                            <input type="text" class="grow fdate edate-report" placeholder="yyyy-mm-dd"
                                name="timeline.END_MAR_SEND" />
                            <i class="fi fi-tr-calendar-clock text-xl"></i>
                        </label>
                    </div>
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Trader</legend>
                    <select class="select w-full s2" id="trader" name="INQ_TRADER">
                        <option disabled selected></option>
                    </select>
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Agent</legend>
                    <select class="select w-full s2" id="agent" name="INQ_AGENT">
                        <option disabled selected></option>
                    </select>
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Country</legend>
                    <select class="select w-full s2" id="country" name="INQ_COUNTRY">
                        <option disabled selected></option>
                    </select>
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Status</legend>
                    <select class="select w-full s2" id="status" name="INQ_STATUS">
                        <option disabled selected></option>
                    </select>
                </fieldset>
            </div>

            <div class="flex-1 flex flex-col py-6 px-12 bg-white rounded-lg shadow">
                <div class="divider divider-start font-bold text-primary">Search By Original Project</div>

                <div class="flex gap-2">
                    <fieldset class="fieldset flex-none">
                        <legend class="fieldset-legend ">Project No</legend>
                        <input type="text" class="input w-full uppercase" placeholder="" name="LIKE_INQ_PRJNO" />
                    </fieldset>

                    <fieldset class="fieldset flex-1">
                        <legend class="fieldset-legend">Project Name</legend>
                        <input type="text" class="input w-full" placeholder="" name="LIKE_INQ_PRJNAME" />
                    </fieldset>
                </div>


                {{-- <fieldset class="fieldset">
                    <legend class="fieldset-legend">Shop Order</legend>
                    <input type="text" class="input w-full" placeholder="" name="LIKE_INQ_SHOPORDER" />
                </fieldset> --}}
                <div class="flex gap-2">
                    <fieldset class="fieldset flex-1">
                        <legend class="fieldset-legend">Series</legend>
                        <select class="select w-full s2" id="series" name="INQ_SERIES">
                        </select>
                    </fieldset>

                    <fieldset class="fieldset flex-1">
                        <legend class="fieldset-legend">Order Type</legend>
                        <select class="select w-full s2" id="ordertype" name="INQ_ORDER_TYPE"></select>
                    </fieldset>
                </div>


                <div class="divider divider-start font-bold text-primary">Search by DE action.</div>
                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Assigner</legend>
                    <select class="select w-full s2" id="de_leader" name="inqgroup.INQG_ASG">
                        <option disabled selected></option>
                    </select>
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Designer</legend>
                    <select class="select w-full s2" id="designer" name="inqgroup.INQG_DES">
                        <option disabled selected></option>
                    </select>
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Checker</legend>
                    <select class="select w-full s2" id="de_checker" name="inqgroup.INQG_CHK">
                        <option disabled selected></option>
                    </select>
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">DE Receive</legend>
                    <div class="flex w-full items-center">
                        <label class="input">
                            <input type="text" class="grow fdate sdate-report" placeholder="yyyy-mm-dd"
                                name="timeline.START_DE_READ" />
                            <i class="fi fi-tr-calendar-clock text-xl"></i>
                        </label>
                        <div class="divider divider-horizontal"><i class="fi fi-ts-arrow-right text-2xl"></i></div>
                        <label class="input">
                            <input type="text" class="grow fdate sdate-report" placeholder="yyyy-mm-dd"
                                name="timeline.END_DE_READ" />
                            <i class="fi fi-tr-calendar-clock text-xl"></i>
                        </label>
                    </div>
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">DE Confirm</legend>
                    <div class="flex w-full items-center">
                        <label class="input">
                            <input type="text" class="grow fdate sdate-report" placeholder="yyyy-mm-dd"
                                name="timeline.START_DE_CONFIRM" />
                            <i class="fi fi-tr-calendar-clock text-xl"></i>
                        </label>
                        <div class="divider divider-horizontal"><i class="fi fi-ts-arrow-right text-2xl"></i></div>
                        <label class="input">
                            <input type="text" class="grow fdate sdate-report" placeholder="yyyy-mm-dd"
                                name="timeline.END_DE_CONFIRM" />
                            <i class="fi fi-tr-calendar-clock text-xl"></i>
                        </label>
                    </div>
                </fieldset>
            </div>
        </div>
        <div class="btn-container flex justify-start my-3 gap-3"></div>
    </form>

    <div id="report-table">
        @include('layouts/datatable_load')
        <table id="table" class="table table-zebra display text-xs"></table>
    </div>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/des_inqreport.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
