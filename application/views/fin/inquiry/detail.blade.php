@extends('layouts/template')

@section('contents')
    <input type="text" name="inquiry-id" id="inquiry-id" value="{{ $id }}" class="hiddenx">
    <input type="text" id="page-id" value="{{ $mode }}" class="hiddenx">
    <input type="text" id="fin-confirm-date" class="hiddenx">
    <input type="text" id="fck-confirm-date" class="hiddenx">
    <input type="text" id="fmn-confirm-date" class="hiddenx">
    <h2 class="card-title text-2xl">Inquiry Detail</h2>
    <div class="divider m-0"></div>
    <main id="form-container" class="grid grid-cols-1 lg:grid-cols-3 gap-6 font-xs" data="viewprj|viewinfo|viewmar"></main>

    <div class="mt-6">
        <div class="divider divider-start divider-primary">
            <span class="font-extrabold text-md text-primary ps-3">Detail</span>
        </div>
        <table id="table" class="table table-zebra table-edit text-xs"></table>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3" id="additional-info">
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
    <script src="{{ $_ENV['APP_JS'] }}/fin_inqdetail.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
