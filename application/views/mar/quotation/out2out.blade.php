@extends('layouts/template')

@section('contents')
    <h2 class="card-title text-2xl">Add Out to Out Transaction</h2>
    <div class="divider m-0"></div>
    <main id="form-container" class="grid grid-cols-1 lg:grid-cols-3 gap-6 font-xs" data="prjout|info|mar"></main>
    <input type="file" name="importfile" id="importouttooutfile" class="hidden"
        accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />

    <div class="mt-6">
        <div class="divider divider-start divider-primary">
            <span class="font-extrabold text-md text-primary ps-3">Detail</span>
        </div>
        <table id="table" class="table table-zebra table-second table-edit display text-xs"></table>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div class="flex-1">
            <div class="divider divider-start divider-primary">
                <span class="font-extrabold text-md text-primary ps-3">History</span>
            </div>
            <table id="history" class="table table-zebra table-second display text-xs"></table>
        </div>
        <div class="flex-1 relative">
            <div class="divider divider-start divider-primary">
                <span class="font-extrabold text-md text-primary ps-3">Attachment</span>
            </div>
            <button class="btn btn-neutral btn-md btn-circle text-white shadoe-lg absolute top-0 right-0"
                id="add-attachment">
                <div class="tooltip tooltip-left" data-tip="Add attachment"><i class="fi fi-br-clip text-lg"></i></div>
            </button>
            <table id="attachment" class="table table-zebra table-second display text-xs"></table>
        </div>
    </div>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_outtoout.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
