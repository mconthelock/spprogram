@extends('layouts/template')

@section('contents')
    <h1 class="text-3xl font-sans font-[700] uppercase mb-5 text-gray-700">Inquiry Detail</h1>
    <main id="form-container" class="grid grid-cols-1 lg:grid-cols-3 gap-6 font-xs" data="prj|info|mar"></main>
    <div class="bg-white p-3 sm:p-4 rounded-xl shadow-lg my-5">
        <table id="table" class="table table-zebra table-edit display text-xs"></table>
    </div>

    <div class="flex gap-2 mb-6">
        <button class="btn btn-primary rounded-3xl text-white transition delay-100 duration-300 ease-in-out hover:scale-110"
            type="button">
            <span class="loading loading-spinner hidden"></span>
            <span class=""><i class="icofont-save me-2"></i>Save Changes</span>
        </button>

        <button class="btn btn-neutral rounded-3xl text-white transition delay-100 duration-300 ease-in-out hover:scale-110"
            type="button">
            <span class="loading loading-spinner hidden"></span>
            <span class=""><i class="icofont-refresh text-lg me-2"></i>Reset</span>
        </button>
        <a class="btn btn-neutral rounded-3xl text-white transition delay-100 duration-300 ease-in-out hover:scale-110"
            href="{{ $_ENV['APP_ENV'] }}/mar/inquiry" type="button">
            <span class="loading loading-spinner hidden"></span>
            <span class=""><i class="icofont-arrow-right text-lg me-2"></i>Back</span>
        </a>
    </div>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_inqdetail.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
