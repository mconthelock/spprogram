$(document).on('click', '.quo-edit', function(){
    var row = $(this).closest('tr');
    row.find('.txt-desc').addClass('d-none');
    row.find('.desc').attr('type', 'text');

    row.find('.edit').toggleClass('d-none');
    row.find('.save').toggleClass('d-none');
    $('#addquotation').addClass('disabled');
});

$(document).on('click', '.quo-cancel', function(){
    var row = $(this).closest('tr');
    if(row.find('.id').val() == 0){
        row.remove();
    }
    row.find('.txt-desc').removeClass('d-none');
    row.find('.desc').attr('type', 'hidden');

    row.find('.edit').toggleClass('d-none');
    row.find('.save').toggleClass('d-none');
    $('#addquotation').removeClass('disabled');
});

$(document).on('click', '.quo-save', function(){
    var row = $(this).closest('tr');
    $.ajax({
        url: host+'mar/priceratio/updatequotationtype',
        type: 'post',
        dataType: 'json',
        data: row.find('input').serialize(),
        success: function(res){
            row.find('.txt-id').html(res.id);
            row.find('.id').val(res.id);
            row.find('.txt-id').removeClass('d-none');
            row.find('.id').attr('type', 'hidden');

            row.find('.txt-desc').html(res.data);
            row.find('.desc').val(res.data);
            row.find('.txt-desc').removeClass('d-none');
            row.find('.desc').attr('type', 'hidden');

            row.find('.edit').toggleClass('d-none');
            row.find('.save').toggleClass('d-none');
            $('#addquotation').removeClass('disabled');
        }
    });
});

$(document).on('click', '.quo-delete', function(){
    var row = $(this).closest('tr');
    $.ajax({
        url: host+'mar/priceratio/deletequotationtype',
        type: 'post',
        dataType: 'json',
        data: row.find('input').serialize(),
        success: function(){
            row.remove();
        }
    });
});

$('#addquotation:not(.disabled)').on('click', function(){
    var tb  = $('#quotation-type tbody');
    var no = tb.find('tr:last').find('.id').val();
    var row = '<tr>';
    row += '<td>';
        row += '<span class="txt-id d-none">0</span> ';
        row += '<input class="form-control id" type="text" readonly name="id" value="'+(parseInt(no)+1)+'">';
    row += '</td>';

    row += '<td>';
        row += '<span class="txt-desc d-none"></span> ';
        row += '<input class="form-control desc" type="text" name="desc" value="">';
    row += '</td>';

    row += '<td class="action text-end">';
        row += '<span class="quo-edit edit me-2 d-none"><i class="icofont-pencil-alt-5"></i></span>';
        row += '<span class="quo-delete delete edit  d-none"><i class="icofont-delete"></i></span>';

        row += '<span class="quo-save save me-2"><i class="icofont-save"></i></span>';
        row += '<span class="quo-cancel delete save"><i class="icofont-close-circled"></i></span>';
    row += '</td>';

    row += '</tr>';
    tb.append(row);
    $(this).addClass('disabled');
});

// Price Ratio
$('#addRow').click(function(){
    if($('#price-ratio tbody').find('tr:last').attr('class') != 'newline'){
        var str = '<tr class="newline">';
            str += '<td>'+ trader() +'</td>';
            str += '<td>'+ supplier() +'</td>';
            str += '<td>'+ quo() +'</td>';
            str += '<td>'+ curency() +'</td>';
            str += '<td class="txt-input"><input class="form-control formula" name="formula" type="text" value=""></td>';
            str += '<td  class="action text-end">';
            str += '<span class="saveas"><i class="icofont-save"></i></span>';
            str += '</td>';
        str += '</tr>';

        $('#price-ratio tbody').append(str);
        $('#addRow').addClass('disabled');
    }
});

$(document).on('click', '.saveas', function(){
    var row = $(this).closest('tr');
    var formdata = {
        'trader' : row.find('.trader').val(),
        'supplier' : row.find('.supplier').val(),
        'quotation' : row.find('.quotation').val(),
        'currency' : row.find('.currency').val(),
        'formula' : row.find('.formula').val()
    };
    $.ajax({
        url: host+'mar/Priceratio/insertPrice',
        type: 'post',
        dataType: 'json',
        data: formdata,
        success: function(res){
            window.location = host+'mar/priceratio';
        }
    });
});

$(document).on('click', '.edit', function(){
    var row = $(this).closest('tr');
    var val = row.find('.txt-input').html();
    row.find('.txt-input').html('<input class="form-control price" type="text" value="'+val+'" name=""price>');

    $(this).removeClass('edit');
    $(this).addClass('save');
    $(this).html('<i class="icofont-save"></i>');

    row.find('.delete').addClass('cancel');
    row.find('.cancel').removeClass('delete');
    row.find('.cancel').html('<i class="icofont-close-circled"></i>');

    $('#addRow').addClass('disabled');
});

$(document).on('click', '.cancel', function(){
    var row = $(this).closest('tr');
    var data = row.find('.price').val();
    row.find('.txt-input').html(data);
    var action = '<span class="edit"><i class="icofont-pencil-alt-5"></i></span>';
    action += '<span class="delete "><i class="icofont-delete"></i></span>';
    row.find('.action').html(action);
    $('#addRow').removeClass('disabled');
});

function trader(){
    var str = '<select class="form-control trader" name="trader">';
        str += '<option value="MTPE">MTPE</option>';
        str += '<option value="MET">MET</option>';
        str += '<option value="AMEC">AMEC</option>';
        str += '<option value="MELCO">MELCO</option>';
        str += '<option value="Direct">Direct</option>';
    str += '</select>';
    return str;
}

function supplier(){
    var str = '<select class="form-control supplier" name="supplier">';
        str += '<option value="AMEC">AMEC</option>';
        str += '<option value="MELINA">MELINA</option>';
    str += '</select>';
    return str;
}

function quo(){
    var quotype = $('.quotation_type');
    var str = '<select class="form-control quotation" name="quotation">';
        $('.quotation_type').find('li').map(function(){
            var id = $(this).attr('data-value');
            var name = $(this).html();
            str += '<option value="'+id+'">'+name+'</option>';
        });

    str += '</select>';
    return str;
}

function curency(){
    var str = '<select class="form-control currency" name="currency">';
        str += '<option value="THB">THB</option>';
        str += '<option value="USD">USD</option>';
    str += '</select>';
    return str;
}

function initTable(){
    const tableid = '#price-ratio-table';
    if ($.fn.DataTable.isDataTable(tableid))
        $(tableid).DataTable().destroy();

    const opt = { ...tableOption };
    opt.pageLength = 20;
    opt.dom = '<lf<"fixed-table"t><"goback"i>p>';
    opt.ajax = {
        url: host + 'mar/priceratio/getRatio',
        type: 'post',
        dataType: 'json'
    };
    opt.columns = [
        {data: "TRADER"},
        {data: "SUPPLIER"},
        {data: "QUOTYPE_DESC"},
        {data: "CURRENCY", className: "text-center"},
        {data: "FORMULA", className: "text-center", render: function(data){ return data == null ? '' : digits(data,2); }},
        {
            data: "TRADER",
            className: "text-center action",
            render: function(data){
                return '<span class="edit"><i class="icofont-pencil-alt-5"></i></span><span class="delete"><i class="icofont-delete"></i></span>';
            }
        },
    ];
    //opt.searching = false;
    return  $(tableid).DataTable(opt);
}