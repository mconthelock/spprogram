summaryTable();
//คำนวณราคาค่า Freight
$('#table-freight tbody tr').map(function(){
    calfreight($(this));
});

//เปลี่ยนค่า Freight
$('#table-freight').find('input').on('change', function(){   
    var row = $(this).closest('tr');
    calfreight(row);
});

//เปลี่ยน Trader
$('#trader').on('change', function(){
    getRatio();
});
//เปลี่ยน Quotation type
$('#quotation').on('change', function(){
    getRatio();
});

//Update TC Cost ** not AMEC Supplier
$('.tccost').on('change', function(){
    var row = $(this).closest('tr');
    calUnitprice(row);
    summaryTable();
});

$('.pkcreq').map(function(){
    if($(this).prop('checked')){
        if($(this).val() == 0){
            $('.package').addClass('d-none');
        }
    }
});

function getRatio(){
    $('#loading').removeClass('d-none');   
    var trader = $('#trader option:selected').val();
    var quotation = $('#quotation option:selected').val();  
    var formula = 0;
    var tmpsupplier  = '';
    $('.table-inq-detail tbody tr').map(function(){
        var supplier = $(this).find('.supplier').html();      
        var row = $(this);
        if(tmpsupplier != supplier){
            $.ajax({
                url: host+'inquiry/getFormaula',
                type: 'post',
                dataType: 'json',
                async: false,
                data: { 'trader': trader, 'quotation': quotation, 'suplier' : supplier },
                success: function(res){
                    formula = res;                    
                }
            });
            tmpsupplier = supplier;
        }
        row.find('.tcrate').val(formula);
        calUnitprice(row);
    });
    summaryTable();
    $('#loading').addClass('d-none');
}


function calUnitprice(row){
    var tc = intVal(row.find('.tccost').val());
    var tcrate = intVal(row.find('.tcrate').val());
    var unitprice = Math.ceil(tc*tcrate);
    row.find('.unitprice').val(unitprice);

    var qty = row.find('.qty').html();
    row.find('.amount').val(unitprice * qty);
    summaryTable();
}

function calfreight(row){
    var volumn = row.find('.volumn').val();
    var freight = row.find('.freight').val();
    var total = freight * volumn;
    row.find('.total').val(total);   
}

function intVal( i ) {
    return typeof i === 'string' ? i.replace(/[\$,]/g, '')*1 : (typeof i === 'number' ? i : 0 );
};


function summaryTable(){
    var amount = 0;    
    var grandtotal = 0;
    $('.table-inq-detail tbody tr').map(function(){
        amount  += intVal($(this).find('.unitprice').val());        
        grandtotal += intVal($(this).find('.amount').val()); 
    });
    $('#total-tc').html(amount);
    $('#total-tc-input').html(amount);
    $('#total').html(grandtotal);
    $('#total-input').html(grandtotal);
}



$('#as400').on('click', function(){
    $('#loading').removeClass('d-none');
    $.ajax({
        url : host+'inquiry/sendprebm',
        type: 'post',
        dataType: 'json',
        data: { 'inqid': $('#inqid').val() },
        success: function(res){
            $('#loading').addClass('d-none');
        }
    });
});

$('#cancel').on('click', function(){
    $('#loading').removeClass('d-none');
    $.ajax({
        url : host+'inquiry/cancelInquiry',
        type: 'post',
        dataType: 'json',
        data: { 'inqid': $('#inqid').val() },
        success: function(res){
            window.location  = host+'mar/quotation/show/'+res;
        }
    });
});

$(document).on('click', '.savedata:not(.disabled)', function(){
    $('#loading').removeClass('d-none');
    $.ajax({
        url: host+'inquiry/modifyData',
        type: 'post',
        dataType: 'json',
        async: false,
        data: $('#forms').serialize(),
        success: function(res){
            if(res.status === true){
                $.ajax({
                    url: host+'mar/quotation/create',
                    type: 'post',
                    dataType: 'json',
                    async: false,
                    data: $('#forms').serialize(),
                    success: function(res){
                        window.location = host+'mar/quotation/show/'+res.data;
                    }
                });
            }
        }
    });
});