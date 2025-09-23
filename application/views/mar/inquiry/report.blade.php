@extends('layouts/template')

@section('contents')
    <h2 class="card-title text-2xl">Inquiry Report</h2>
    <div class="divider m-0"></div>

    <div class="flex flex-col max-w-[32rem]">
        <div class="divider divider-start">Search By Original Project</div>
        <fieldset class="fieldset">
            <legend class="fieldset-legend">Project No</legend>
            <input type="text" class="input w-full" placeholder="Type here" />
        </fieldset>

        <fieldset class="fieldset">
            <legend class="fieldset-legend">Project Name</legend>
            <input type="text" class="input w-full" placeholder="Type here" />
        </fieldset>

        <fieldset class="fieldset">
            <legend class="fieldset-legend">Shop Order</legend>
            <input type="text" class="input w-full" placeholder="Type here" />
        </fieldset>

        <fieldset class="fieldset">
            <legend class="fieldset-legend">Series</legend>
            <input type="text" class="input w-full" placeholder="Type here" />
        </fieldset>

        <fieldset class="fieldset">
            <legend class="fieldset-legend">Order Type</legend>
            <input type="text" class="input w-full" placeholder="Type here" />
        </fieldset>

        <div class="divider divider-start">Search By Inquiry Information</div>
        <fieldset class="fieldset">
            <legend class="fieldset-legend">Inquiry No.</legend>
            <input type="text" class="input w-full" placeholder="Type here" />
        </fieldset>

        <fieldset class="fieldset">
            <legend class="fieldset-legend">Inquiry Date</legend>
            <input type="text" class="input w-full" placeholder="Type here" />
        </fieldset>

        <fieldset class="fieldset">
            <legend class="fieldset-legend">What is your name?</legend>
            <input type="text" class="input w-full" placeholder="Type here" />
        </fieldset>

        <fieldset class="fieldset">
            <legend class="fieldset-legend">What is your name?</legend>
            <input type="text" class="input w-full" placeholder="Type here" />
        </fieldset>

        <fieldset class="fieldset">
            <legend class="fieldset-legend">What is your name?</legend>
            <input type="text" class="input w-full" placeholder="Type here" />
        </fieldset>

        <fieldset class="fieldset">
            <legend class="fieldset-legend">What is your name?</legend>
            <input type="text" class="input w-full" placeholder="Type here" />
        </fieldset>

        <fieldset class="fieldset">
            <legend class="fieldset-legend">What is your name?</legend>
            <input type="text" class="input w-full" placeholder="Type here" />
        </fieldset>

        <div class="divider divider-start">Search by Quotation Info.</div>
        <fieldset class="fieldset">
            <legend class="fieldset-legend">What is your name?</legend>
            <input type="text" class="input w-full" placeholder="Type here" />
        </fieldset>

        <fieldset class="fieldset">
            <legend class="fieldset-legend">What is your name?</legend>
            <input type="text" class="input w-full" placeholder="Type here" />
        </fieldset>

        <div class="flex justify-end mb-2">
            <a href="#" id="export" class="btn btn-sm btn-primary ">Export to Excel</a>
        </div>
    </div>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_inquiry.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
