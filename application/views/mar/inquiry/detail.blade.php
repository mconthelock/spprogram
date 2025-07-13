@extends('layouts/template')

@section('contents')
    <main id="form-container" class="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-3 gap-6" data="prj|info|mar"></main>
    <div class="bg-white p-3 sm:p-4 rounded-xl shadow-lg my-8">
        <table id="table" class="display text-xs"></table>
    </div>
@endsection

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_inqdetail.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection

@section('styles')
    <style>
        .cell-input {
            width: 100%;
            border: 2px solid transparent;
            background-color: transparent;
            padding: 5px;
            border-radius: 4px;
            transition: all 0.2s ease-in-out;
        }

        .cell-input:focus {
            outline: none;
            border-color: #3b82f6;
            background-color: #eff6ff;
        }
    </style>
@endsection
