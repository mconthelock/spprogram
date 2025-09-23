@extends('layouts/template')

@section('scripts')
    <script src="{{ $_ENV['APP_JS'] }}/mar_quotation.js?ver={{ $GLOBALS['version'] }}"></script>
@endsection
