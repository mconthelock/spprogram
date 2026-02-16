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
        <table id="table" class="table table-zebra table-edit text-md!"></table>
    </div>

    <div class="flex gap-2 my-3" id="btn-container"></div>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_outtoout.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
