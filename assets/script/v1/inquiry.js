// Version 0.210615.1343
var table;
$(document).on('change','#prjno', function(){
    $('#prjloading ').removeClass('d-none');
    $.ajax({
        url : host+'mar/inquiry/getproject',
        type: 'POST',
        dataType: 'json',
        data: { 'id': $(this).val() },
        success(res){
            if(res.status){
                var data = res.data;
                $('#prjname').val(data.prj_name);
                $('#series').val(data.series).change();
                $('#shoporder').val(data.order_no);
                $('#operation').val(data.operation);
                $('#spec').val(data.spec);
                $('#prdsch').val(data.amec_schdl);
                var agent = data.agent+ ' ('+data.dstn+')';
                $('#agent').val(agent).change();
                $('#country').val(data.dstn);
                $('#inqno').focus();
                getdupplicate();
                getproperties();
            }
            $('#prjloading ').addClass('d-none');
        }
    });
});

$(document).on('change','#inqno', function(){
    $('#inqloading').removeClass('d-none');
    $('#traderloading').removeClass('d-none');
    getdupplicate();
    getproperties();
});

$(document).on('change','#agent', function(){
    if($(this).val() != null){
        var agent = $(this).val();
        var data = agent.split("(");
        $('#country').val(data[1].replace(")", ""));
    }
});

$(document).on('change','.carno', function(){
    if($('#prjno').val() != ''){
        var row = $(this).closest('tr');
        $('#detailloading').removeClass('d-none');

        $.ajax({
            url: host+'mar/inquiry/getmfgorder',
            type: 'post',
            dataType: 'json',
            data: {'prjno': $('#prjno').val(), 'carno' : $(this).val() },
            success: function(result) {
                if(result.status === true){
                    row.find('.mfgno').val(result.message.mfgno);
                    row.find('.itemno').focus();
                }else{
                    row.find('.mfgno').focus();
                }
                $('#detailloading').addClass('d-none');
            }
        });
    }
});

$(document).on('change','.mfgno', function(){
    console.log('Pass');
    var row = $(this).closest('tr');
    var mfgno = $(this).val();
    var item = row.find('.itemno').val();
    var carno = row.find('.carno').val();
    if((mfgno == '' || mfgno == '-') && item == '366'){
        swal({
            title: "Item 366?",
            text: "If require full set, but no original not supply. Are you sure?",
            icon: "warning"
        });
    }

    if(mfgno != '' && item != ''){
        $('#detailloading').removeClass('d-none');
        elmesTable(mfgno, item, carno, row);
    }
});

$(document).on('change','.itemno', function(){
    var row = $(this).closest('tr');
    var mfgno = row.find('.mfgno').val();
    var item =   $(this).val();
    var carno = row.find('.carno').val();
    if((mfgno == '' || mfgno == '-') && item == '366'){
        swal({
            title: "Item 366?",
            text: "If require full set, but no original not supply. Are you sure?",
            icon: "warning"
        });
    }

    if(mfgno != '' && item != ''){
        $('#detailloading').removeClass('d-none');
        elmesTable(mfgno, item, carno, row);
    }
    $('#addline').removeClass('disabled');
    $('.savedata').removeClass('disabled');
});

$(document).on('click', '#addline:not(.disabled)', function(){
    var inqtable = $('.table-inq-detail tbody');
    var seq = inqtable.find('tr:last').find('.seq').val();
    var str =  newRows(parseInt(seq)+1, 'headline');
    inqtable.append(str);
    $('#repeat').val(0);
});

$(document).on('click', '.add-subline', function(){
    var current = $(this).closest('tr');
    var seq = (parseFloat(current.find('.seq').val())+0.01).toFixed(2);// parseFloat(current.find('.seq').val())+0.01;
    var str =  newRows((seq), 'subline');
    current.after(str);
    $('#repeat').val(0);
});

$(document).on('click', '.delete-line:not(.disabled)', function(){
    var rows = $(this).closest('tr');
    if(rows.find('.rowaction').val() == 'A'){
        rows.remove();
    }else{
        rows.find('.rowaction').val('D');
        rows.addClass('d-none');
    }

    if($('.table-inq-detail tbody').find('tr:visible').length == 1){
        $('.table-inq-detail tbody').find('tr:visible').find('.delete-line').addClass('disabled');
    }
});

$("#import-inquiry").uploadFile({
	url: host+'mar/inquiry/importinquiry',
	multiple:true,
	dragDrop:false,
	showDelete: true,
	showDownload: true,
	fileName:"fileupload",
    showFileCounter:false,
    onSubmit: function(){
        $('#prjloading').removeClass('d-none');
        $('#inqloading').removeClass('d-none');
        $('#traderloading').removeClass('d-none');
    },
	onSuccess: function(files,data,xhr){
        var content = $.parseJSON(data);
        if(typeof(content.icon) != "undefined"){
            var notify = $.notify({
                    icon: 'icofont-close-circled',
                    title: 'Process failure!!!',
                    message: content.text
            }, alertOption);
            notify.update('type', 'error');
            $('.txtloading').addClass('d-none');
        }else{
            importInquiry(content);
            $('#loading').addClass('d-none');
        }

        if($('.table-inq-detail tbody').find('tr:visible').length > 1){
            $('.table-inq-detail tbody').find('tr:visible').map(function(){
                $(this).find('.delete-line').removeClass('disabled');
            });
        }
    }
});

$("#attachment").uploadFile({
    url: host+'attachment/uploadattach',
	multiple:true,
	dragDrop:false,
	showDelete: true,
	showDownload: true,
	fileName:"fileupload",
    showFileCounter:false,
    onSubmit: function(){
        $('#filemsg').html('<i class="fa fa-spinner fa-spin"></i> Loading........');
    },
	onSuccess: function(files,data,xhr){
        let value = jQuery.parseJSON(data);
        if(value.status == 'error'){
            $('#filemsg').html('<div>'+value.msg+'</div>')
            setTimeout(function(){
                $('#filemsg').html('');
            }, 5000);
        }else{
            insertAttach(value);
            $('#filemsg').html('');
            $('#filemsg').next('.more-data').addClass('d-none');
        }
    }
});

$(document).on('change', '.supplier', function(){
    if($('#repeat').val() == 0){
        swal({
            title: "Apply for all?",
            text: "Would you like to apply this value to all line",
            icon: "warning",
            buttons: ["No, thanks", 'Of caurse!'],
            dangerMode: false,
        })
        .then((willDelete) => {
            if (willDelete) {
                var values = $(this).find('option:selected').val();
                $('.table-inq-detail tbody').find('tr').map(function(){
                    var supplier = $(this).find('.supplier');
                    if(supplier.val() == ''){
                        supplier.val(values);
                    }
                });

            }
        });
    }
    $('#repeat').val(1);
});

$(document).on('click', '.checkbox-unreply', function(){
    var myModal = new bootstrap.Modal(document.getElementById('reason-model'), {
        keyboard: false,
        backdrop: 'static'
    });
    var row = $(this).closest('tr').index();
    if($(this).is(':checked')){
        $('#return_result').val(row);
        $('#reason-txt').css('border-color', '#ced4da');
        $('#reason-txt').val('');
        myModal.show();
    }
});

$(document).on('click', '#unreply-submit', function(){
    var form = $(this).closest('.modal-body');
    form.find('.unable2reply').map(function(){
        if($(this).is(':checked')){
            var values = $(this).val();
            var reason = $(this).next('.unable2reason').val();
            if(reason == 'Other'){
                if($('#reason-txt').val() == ''){
                    $('#reason-txt').css('border-color', 'red');
                    return false;
                }else{
                    reason = 'Other: '+$('#reason-txt').val();
                }
            }
            var index = $('#return_result').val();
            $('.table-inq-detail tbody').find('tr:eq('+index+')').find('.checkbox-unreply').val(values);
            $('.table-inq-detail tbody').find('tr:eq('+index+')').find('.remark:not([readonly])').val(reason);
            $('#reason-model').modal('hide');
        }
    });

    form.find('.unable2reply').attr('checked', false);
});

$(document).on('click', '#unreply-cancel', function(){
    var index = $('#return_result').val();
    $('.table-inq-detail tbody').find('tr:eq('+index+')').find('.checkbox-unreply').prop('checked', false);
    $('#reason-model').modal('hide');
});

$(document).on('click', '.deletefile:not(.disabled)', function(){
    var tr = $(this).closest('tr');
    if(tr.find('.mode').val() == 'temp'){
        tr.find('.mode').val('dtemp');
    }else{
        tr.find('.mode').val('D');
    }
    tr.addClass('d-none');
});

$(document).on('click', ".downloadfile", function(){
    let tr = $(this).closest('tr');
    let mode = tr.find('.mode').val();
    let fname = tr.find('.filename').val();
    let oname = tr.find('.fileoname').val();
    if(mode != 'temp'){
        mode = $('#inqno').val();
    }
    var url = host+'attachment/downloadttach/'+mode+'/'+fname;
	window.location.href = url;
});

function getdupplicate(){
    if($('#inqno').val().trim() != ''){
        $.ajax({
            url: host+'mar/inquiry/checkInquiry',
            type: 'post',
            async: false,
            dataType: 'json',
            data: {
                'id' : $('#inqno').val().trim().toUpperCase(),
                'rev': $('#inqrev').val()
            },
            success: function(result) {
                if(result.status === true){
                    $('#inqno').css('border', 'none');
                    $('#inqno').css('border-bottom', '1px solid #bdc3c7');
                    $('.table-inq-detail tbody').find('.zero').addClass('d-none');
                    $('.table-inq-detail tbody').find('.first').removeClass('d-none');
                    $('.table-inq-detail tbody').find('.first').find('.delete').addClass('disabled');
                    $('#inqloading').addClass('d-none');
                    $('#savedraft').removeClass('disabled');
                }else{
                    $('#inqno').val('');
                    $('#inqno').css('border', '2px solid red');
                    $('#inqloading').addClass('d-none');
                    var notify = $.notify({
                            icon: 'icofont-close-circled',
                            title: 'Process failure!!!',
                            message: result.message,
                    }, alertOption);
                    notify.update('type', 'error');
                }
            }
        });
    }
    $('#traderloading').addClass('d-none');
}

function getproperties(){
    var agent = $('#agent').val();
    var id =  $('#inqno').val();
    if(id != '' && agent !== null){
        agent = agent.trim().substring(0,3);
        id    = id.trim().toUpperCase();
        var prefix = '';
        if(id.substring(0,2) == 'T-'){
            prefix = id.substring(0,5);
        }else if(id.substring(0,6) == 'DIRECT'){
            prefix = 'Direct';
        }else{
            prefix = 'Any';
            if($('#agent').val() != null){
                agent = $('#agent').val().trim().substring(0,3);
            }else{
                agent = '???';
            }
        }

        $.ajax({
            url: host+'mar/inquiry/getcontrol',
            type: 'post',
            dataType: 'json',
            async: false,
            data: {'prefix' : prefix, 'agent' : agent },
            success: function(result) {
                if(result.status === true){
                    $('#term').val( result.message.CNT_TERM).change();
                    if($('#trader').val() != 'Direct'){
                        $('#trader').val(result.message.CNT_TRADER).change();
                        $('#quotation').val( result.message.CNT_QUOTATION).change();
                    }else{
                        $('#quotation').val(4).change();
                    }
                    if(result.message.CNT_WEIGHT == 1){
                        $('#pkcreq1').prop('checked', true);
                    }else{
                        $('#pkcreq0').prop('checked', true);
                    }
                    $('#method').val( result.message.CNT_METHOD).change();
                }
                $('#traderloading').addClass('d-none');
            }
        });
    }
}

function elmesTable(orderno, itemno, carno, row){
    if ($.fn.DataTable.isDataTable( '#elmes-table' ) ) {
        $('#elmes-table').dataTable().api().destroy();
        $('#elmes-table tbody').empty();
    }

    var table = $('#elmes-table').DataTable( {
        dom: 'Bfrtip',
        pageLength: 10,
        ajax: {
            url: host+'elmes/showData',
            type: 'post',
            async: false,
            dataType: 'json',
            data: { 'ordno': orderno, 'item': itemno, 'carno': carno },
        },
        select: {
            style: 'multi'
        },
        columns: [
            {data: 'orderno'},
            {data: 'carno'},
            {data: 'partname'},
            {data: 'drawing'},
            {data: 'variable'},
            {
                data: 'qty',
                className: 'text-center'
            },
            {
                data: 'scndpart',
                className: 'text-center'
            },
            {
                data: 'supply',
                className: 'text-center',
                render: function ( data, type, row ) {
                    var val = '';
                    if(data == 'R'){
                        val = 'LOCAL';
                    }else if(data == 'J'){
                        val = 'MELINA';
                    }else if(data == 'U'){
                        val = '';
                    }else{
                        val = 'AMEC';
                    }
                    return val;
                }
            }
        ],
        buttons: [
            {
                text: '<i class="icofont-minus-circle"></i> Select none',
                className: 'btn btn-second ',
                action: function () {
                    table.rows().deselect();
                }
            },
            {
                text: '<i class="icofont-check-circled"></i> Select all',
                className: 'btn btn-second',
                action: function () {
                    table.rows().select();
                }
            },
            {
                text: '<i class="icofont-plus-circle"></i> Insert to Inquiry',
                className: 'btn btn-main',
                action: function () {
                    insertDatatoTable(row, table);
                    $('#modal-elmes-data').modal('hide');
                }
            }
        ],
        language: {
            search: '',
            paginate: {
                previous: '<i class="icofont-circled-left"></i>',
                next: '<i class="icofont-circled-right"></i>'
            }
        }
    });

    if(table.rows().data().length > 0){
        $('#modal-elmes-data').modal('show');
    }
    $('#detailloading').addClass('d-none');
}

function insertDatatoTable(row, table){
    var data = table.rows({ selected : true }).data();
    var index = row.index();
    var tb = row.closest('tbody');
    //var itemno = row.find('.itemno').val();
    var seq = row.find('.seq').val();
    for(i = 0; i < data.length; i++){
        insertDatatoTableDeatail(data[i], seq, row);
        row.find('.rowaction').val('A');
        if(i < (data.length-1)){
            if(parseFloat(seq).toFixed(2)%1 == 0){
                seq = (parseInt(seq)+1).toFixed(0);
                row.after('<tr class="headline">'+row.html()+'</tr>');
            }else{
                seq = (parseFloat(seq)+0.01).toFixed(2);
                row.after('<tr class="subline">'+row.html()+'</tr>');
            }
            index++;
            row = tb.find('tr:eq('+index+')');
            row.find('.rowid').val('');
        }
    }
}

function insertDatatoTableDeatail(data, seqno, row){
    var seq = seqno;
    seqno = (parseFloat(seqno)*100).toFixed(0);

    row.find('.seq').val(seq);
    row.find('.seq').attr('name', 'seq['+seqno+']');

    row.find('.itemno').val(data.itemno);
    row.find('.itemno').attr('name', 'itemno['+seqno+']');

    row.find('.mfgno').val(data.orderno);
    row.find('.mfgno').attr('name', 'mfgno['+seqno+']');

    row.find('.carno').val(data.carno);
    row.find('.carno').attr('name', 'carno['+seqno+']');

    row.find('.partname').val(data.partname);
    row.find('.partname').attr('name', 'partname['+seqno+']');

    row.find('.drawing').val(data.drawing);
    row.find('.drawing').attr('name', 'drawing['+seqno+']');

    row.find('.variable').val(data.variable);
    row.find('.variable').attr('name', 'variable['+seqno+']');

    row.find('.qty').val(data.qty);
    row.find('.qty').attr('name', 'qty['+seqno+']');

    row.find('.um').attr('name', 'um['+seqno+']');

    if(data.scndpart == '0' || data.scndpart == 'O'){
        row.find('.checkbox-second').prop('checked', true);
    }
    row.find('.checkbox-second').attr('name', 'second['+seqno+']');
    row.find('.checkbox-unreply').attr('name', 'unreply['+seqno+']');

    if(data.supply == 'R'){
        row.find('.supplier').val('LOCAL');
    }else if(data.supply == 'J'){
        row.find('.supplier').val('MELINA');
    }else if(data.supply == 'U'){
        row.find('.supplier').val('');
    }else{
        row.find('.supplier').val('AMEC');
    }

    row.find('.supplier').attr('name', 'supplier['+seqno+']');
    row.find('.remark').attr('name', 'comment['+seqno+']');
    row.find('.rowid').attr('name', 'rowid['+seqno+']');
    row.find('.rowaction').attr('name', 'rowaction['+seqno+']');

    if(!row.hasClass('first')){
        row.find('.delete').removeClass('disabled');
    }
}

function newRows(seqno, types){
    var seq = seqno;
    seqno = (parseFloat(seqno)*100).toFixed(0);
    var str = '<tr class="'+ types +'">';
    str += '<td><textarea class="form-control seq" name="seq['+seqno+']">'+ seq +'</textarea></td>';
    str += '<td><textarea class="form-control carno" name="carno['+seqno+']"></textarea></td>';
    str += '<td><textarea class="form-control mfgno" name="mfgno['+seqno+']"></textarea></td>';
    str += '<td><textarea class="form-control itemno" name="itemno['+seqno+']"></textarea></td>';
    str += '<td><textarea class="form-control partname" name="partname['+seqno+']"></textarea></td>';
    str += '<td><textarea class="form-control drawing" name="drawing['+seqno+']"></textarea></td>';
    str += '<td><textarea class="form-control variable" name="variable['+seqno+']"></textarea></td>';
    str += '<td><textarea class="form-control qty" name="qty['+seqno+']">1</textarea></td>';
    str += '<td><textarea class="form-control um" name="um['+seqno+']"></textarea></td>';

    str += '<td>';
    str += '<select class="form-control supplier select-item" name="supplier['+seqno+']">';
    str += '<option value=""></option>';
    str += '<option value="AMEC">AMEC</option>';
    str += '<option value="MELINA">MELINA</option>';
    str += '<option value="LOCAL">LOCAL</option>';
    str += '</select>';
    str += '</td>';

    str += '<td class="text-center"><input type="checkbox" class="form-check-input checkbox checkbox-second" name="second['+seqno+']" value="1"/></td>';
    str += '<td class="text-center"><input type="checkbox" class="form-check-input checkbox checkbox-unreply" name="unreply['+seqno+']" value="0"/></td>';

    var isMarComment = $('.table-inq-detail thead').find('.mar-remark');
    if(isMarComment.length != 0 && isMarComment.hasClass('readonly')) {
        str += '<td><textarea class="form-control remark" readonly></textarea></td>';
    }else if(isMarComment.length != 0){
        str += '<td><textarea class="form-control remark" name="comment['+seqno+']"></textarea></td>';
    }

    var isDesComment = $('.table-inq-detail thead').find('.des-remark');
    if(isDesComment.length != 0 && isDesComment.hasClass('readonly')) {
        str += '<td><textarea class="form-control remark" readonly></textarea></td>';
    }else if(isDesComment.length != 0){
        str += '<td><textarea class="form-control remark" name="des-comment['+seqno+']"></textarea></td>';
    }

    str += '<td class="action">';
    str += '<ul>';
    str += '<li><span class="add-subline"><i class="icofont-plus"></i></span></li>';
    str += '<li><span class="delete delete-line"><i class="icofont-ui-delete"></i></span></li>';
    str += '</ul>';
    str += '</td>';

    str += '<td style="display:none"><input type="hidden" name="rowid['+seqno+']" class="rowid"></td>';
    str += '<td style="display:none"><input type="hidden" name="rowaction['+seqno+']" class="rowaction" value="A"></td>';

    str += '</tr>';
    return str;
}

function importInquiry(data){
    $('#prjno').val(data[0].prj_no);
    $('#prjname').val(data[0].prj_name);
    $('#series').val(data[0].series).change();
    $('#shoporder').val(data[0].order_no);
    $('#operation').val(data[0].operation);
    $('#spec').val(data[0].spec);
    $('#prdsch').val(data[0].amec_schdl);

    var agent  = data[0].agent+ ' ('+(data[0].dstn).toUpperCase()+')';
    $('#agent').val(agent).change();
    $('#country').val(data[0].dstn);
    $('#inqno').val(data[0].inqno);

    getdupplicate();
    if(data[0].agent !== null){
        getproperties();
    }
    $('.txtloading ').addClass('d-none');

    var tb = $('.table-inq-detail tbody');
    var row = tb.find('tr:last');
    for(i = 0; i < data.length; i++){
        data[i].supply = 'U';
        insertDatatoTableDeatail(data[i], data[i].seqno, row);
        if(i < (data.length-1)){
            row.after('<tr class="headline">'+row.html()+'</tr>');
            row = tb.find('tr:last');
        }
    }

    $('#addline').removeClass('disabled');
    $('.savedata').removeClass('disabled');
}

function insertAttach(data){
    var tb = $('#table-attach tbody');
    let hidden = '<input class="filename" type="hidden" name="filename[]" value="'+data.file_name+'"/>';
    hidden += '<input class="fileoname" type="hidden" name="fileoname[]" value="'+data.file_old_name+'"/>';
    hidden +='<input class="filesize" type="hidden" name="filesize[]" value="'+data.file_size+'"/>';
    hidden +='<input class="filetype" type="hidden" name="filetype[]" value="'+data.file_type+'"/>';
    hidden +='<input class="fileclass" type="hidden" name="fileclass[]" value="'+data.file_class+'"/>';
    hidden += '<input class="mode" type="hidden" name="mode[]" value="temp"/>';

    let row = '<tr>';
    row += '<td width="10px"><div class="deletefile"><i class="icofont-ui-delete"></i></div></td>';
    row += '<td><div class="downloadfile"><i class="mr-2 icofont-file-'+ data.file_class+ ' ' +data.file_class +'"></i>'+data.file_old_name+'</div>'+hidden+'</td>';
    row += '<td class="text-right">'+data.file_size+'KB</td>';
    row += '</tr>';
    tb.last().append(row);
}

// Use in add stock part page
$('#cusid').on('change', function(){
    $('#cusloading').removeClass('d-none');
    var cusid = $(this).val();
    $.ajax({
        url: host+'mar/customers/getCustomers',
        type: 'get',
        dataType: 'json',
        success: function(res){
            $.each(res.data, function(i, data) {
                if(cusid == data.CUS_ID){
                    $('#cuscur').val(data.CUS_CURENCY);
                    $('#currency').val(data.CUS_CURENCY);
                    $('#prjname').val(data.CUS_NAME + ' STOCK');
                    //$('#prjno').val('');

                    var agent  = data.CUS_AGENT+ ' ('+data.CUS_COUNTRY+')';
                    $('#agent').val(agent).change();
                    $('#country').val(data.CUS_COUNTRY);
                    $('#shipment').val(data.CUS_LT).change();
                    $('#quotation').val(data.CUS_QUOTATION).change();
                    $('#term').val(data.CUS_TERM).change();
                    $('#method').val(2).change();
                    $('#inqno').focus();
                }
            });
            $('#cusloading').addClass('d-none');
        }
    });
});

$(document).on('change','.diritem', function(){
    if($('#cusid').val() === ''){
        return false;
    }
    var rowindex = $(this).closest('tr').index();
    var myModal = new bootstrap.Modal(document.getElementById('showPriceList'), {
        keyboard: false,
        backdrop: 'static'
    });

    var table = $('#priceListTable').DataTable({
        ajax: {
            url: host+'mar/price/showPricelist',
            type: 'post',
            data: {
                'customer': $('#cusid').val(),
                'item' : $(this).val()
            },
        },
        dom: 'Bfrtip',
        order:[[0, "ASC"]],
        destroy: true,
        autoWidth: false,
        select: {
            style: 'multi'
        },
        columns: [
            // { data: 'ITEM_ID' },
            { data: 'ITEM_NO' },
            {
                data: 'ITEM_NAME',
                width: '250px',
            },
            {
                data: 'ITEM_DWG',
                width: '250px'
            },
            {
                data: 'ITEM_VARIABLE',
                //className: 'text-250'
            },
            {
                data: 'ITEM_UNIT',
                className: 'text-center',
                width: '100px'

            },
            {
                data: 'TCCOST',
                className: 'text-end',
                width: '120px',
                render: function(data){
                    return data = (data === null) ? 0 : data.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
            },
            {
                data: 'FORMULA',
                className: 'text-center ',
                width: '120px',
                render: function(data, type, row){
                    data = parseFloat(data).toFixed(3);
                    return data;
                }

            },
            {
                data: 'TCCOST',
                className: 'text-end',
                width: '120px',
                render: function(data, type, row){
                    var rate = parseFloat(row.FORMULA).toFixed(3);
                    var price = parseFloat(data).toFixed(0);
                    var unitprice = Math.ceil(price*rate);
                    return unitprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }

            },
            {
                data: 'AD_PRICE',
                className: 'text-end',
                width: '120px',
                render: function(data, type, row){
                    var rate = parseFloat(row.FORMULA).toFixed(3);
                    var price = parseFloat(row.TCCOST).toFixed(0);
                    var unitprice = Math.ceil(price*rate);
                    unitprice = unitprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return (data === null) ? unitprice  : data.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
            },
        ],
        buttons: [
            {
                text: '<i class="icofont-minus-circle"></i> Select none',
                className: 'btn btn-second ',
                action: function () {
                    table.rows().deselect();
                }
            },
            {
                text: '<i class="icofont-check-circled"></i> Select all',
                className: 'btn btn-second',
                action: function () {
                    table.rows().select();
                }
            },
            {
                text: '<i class="icofont-plus-circle"></i> Insert',
                className: 'btn btn-main',
                action: function () {
                    insertDataDirect(rowindex, table);
                    myModal.hide();
                }
            }
        ],
        language: {
            paginate: {
                previous: '<i class="icofont-circled-left"></i>',
                next: '<i class="icofont-circled-right"></i>'
            }
        }
    });
    myModal.show();
});

function insertDataDirect(index, table){
    var data = table.rows({ selected : true }).data();
    var row = $('.table-inq-detail-direct tbody').find('tr:eq('+index+')');
    var seq = row.find('.seq').val();

    for(i = 0; i < data.length; i++){
        if(i > 0){
            row = row.clone().removeAttr("id").appendTo( row.parent() );
            seq = (parseInt(seq)+1).toFixed(0);
        }

        row.find('.rowaction').val('A');
        row.find('.rowid').val('');
        row.find('.seq').val(seq);
        row.find('.diritem').val(data[i].ITEM_NO);
        row.find('.partname').val(data[i].ITEM_NAME);
        row.find('.drawing').val(data[i].ITEM_DWG);
        row.find('.variable').val(data[i].ITEM_VARIABLE);
        row.find('.um').val(data[i].ITEM_UNIT);
        row.find('.supplier').val(data[i].ITEM_SUPPLIER);
        row.find('.dirqty').val(1);
        row.find('.tccost').val(data[i].TCCOST);
        row.find('.tcrate').val(data[i].FORMULA);
        row.find('.fccost').val(data[i].FCCOST);
        row.find('.fcrate').val(data[i].FCBASE);

        if(data[i].AD_PRICE === null){
            var rate = parseFloat(data[i].FORMULA).toFixed(3);
            var price = parseFloat(data[i].TCCOST).toFixed(0);
            var unitprice = Math.ceil(price*rate);
        }else{
            unitprice =data[i].AD_PRICE;
        }
        row.find('.unitprice').val(unitprice);
        row.find('.total').val(unitprice);
        row.find('.delete').removeClass('disabled');
    }
    if($('.table-inq-detail tbody').find('tr:visible').length == 1){
        $('.table-inq-detail tbody').find('tr:visible').find('.dirdelete').addClass('disabled');
    }else{
        $('.table-inq-detail tbody').find('tr:eq(0)').find('.dirdelete').removeClass('disabled');
    }

    $('#adddirline').removeClass('disabled');
    $('#savedirdraft').removeClass('disabled');
    $('#savedir').removeClass('disabled');

}

$(document).on('click', '.dirdelete:not(.disabled)', function(){
    var rows = $(this).closest('tr');
    if(rows.find('.rowaction').val() == 'A'){
        rows.remove();
    }else{
        rows.find('.rowaction').val('D');
        rows.addClass('d-none');
    }

    if($('.table-inq-detail tbody').find('tr:visible').length == 1){
        $('.table-inq-detail tbody').find('tr:visible').find('.dirdelete').addClass('disabled');
    }
});

$(document).on('click', '#adddirline:not(.disabled)', function(){
    var row = $('.table-inq-detail-direct tbody').find('tr:visible:last');
    console.log(row);
    var seq = row.find('.seq').val();

    row = row.clone().removeAttr("id").appendTo( row.parent() );
    seq = (parseInt(seq)+1).toFixed(0);
    row.map(function(){
        $(this).find('textarea').val('');
    });
    row.find('.seq').val(seq);
    row.find('.diritem').focus();
});

$(document).on('change', '.dirqty', function(){
    var row = $(this).closest('tr');
    var seq = row.find('.seq').val();
    var unitprice = row.find('.unitprice').val();
    var item = row.find('.diritem').val();
    var partname = row.find('.partname').val();
    var actqty = $(this).val();
    if((item == '101' && partname == 'T/M' && $(this).val() > 1) ||
    (item == '125' && partname == 'SAFETY GEAR(GSC-400)' && $(this).val() > 1)
    ){
        $(this).val(1);
        for(var i=1; i< actqty; i++){
            row = row.clone().removeAttr("id").appendTo( row.parent() );
            seq = (parseInt(seq)+1).toFixed(0);
            row.find('.seq').val(seq);
        }
    }else{
        var total = parseInt($(this).val()) * parseInt(unitprice);
        row.find('.total').val(total);
    }
});

$(document).on('click', '.timeline', function(){
    var timeline = new bootstrap.Modal(document.getElementById('timeline-modal'), {
        keyboard: false,
        backdrop: 'static'
    });
    var id = $(this).closest('tr').find('.rowid').val();
    var table = $('#timeline-table').DataTable({
        ajax: {
            url: host+'inquiry/getTimeline/'+id,
            type: 'POST',
        },
        pageLength: 25,
        order:[[0, "desc"]],
        autoWidth: false,
        destroy: true,
        columns: [
            { data: 'INQD_MFGORDER', className: 'text-nowrap' },
            { data: 'INQD_CAR' },
            { data: 'INQD_ITEM' },
            { data: 'INQD_PARTNAME', className: 'text-nowrap',},
            { data: 'INQD_DRAWING', className: 'text-nowrap', },
            { data: 'INQD_VARIABLE' },
            { data: 'INQD_QTY' },
            {
                data: "INQD_SENDPART",
                className: "text-center",
                render: function( data, type, row ) {
                   return (data !== null) ? '<i class="icofont-check-circled"></i>' : '';
                }
            },
            {
                data: "INQD_UNREPLY",
                className: "text-center",
                render: function ( data, type, row ) {
                    return (data !== null) ? '<i class="icofont-check-circled"></i>' : '';
                }
            },
            { data: "INQD_MAR_REMARK" },
            { data: "INQD_DES_REMARK" },
            {
                data: "UPDATE_AT" ,
                className: 'text-nowrap',
                render: function ( data, type, row ) {
                    return data;
                }
            },
            {
                data: "UPDATE_BY" ,
                className: 'text-nowrap',
                render: function ( data, type, row ) {
                    var sname = data.toLowerCase(data);
                    var ArrName = sname.split(' ');
                    return ArrName[0].charAt(0).toUpperCase()+ArrName[0].slice(1);
                }
            }
        ],
        language: {
            paginate: {
                previous: '<i class="icofont-circled-left"></i>',
                next: '<i class="icofont-circled-right"></i>'
            }
        }
    });
    timeline.show();
});