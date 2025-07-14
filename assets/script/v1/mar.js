var alertOptions = {
    type: 'error',
    placement: {from: "bottom",align: "right" },
    offset: {x:50, y:50},
    delay: 5000,
    animate: {
        enter: 'animated bounceInUp',
        exit: 'animated bounceOutDown'
    },
    template: '<div data-notify="container" class="alert alert-{0}" role="alert">' +
        '<div class="row">' +
        '<div class="icon"><div data-notify="icon" class="alert-icon"></div></div>' +
        '<div class="title">' +
        '<div data-notify="title" class="alert-title">{1}</div>' +
        '<hr>'+
        '<span data-notify="message" class="alert-message">{2}</span>' +
        '</div>' +
        '</div>'
};

$(document).on('change','#prjno', function(){
    $('#prjloading').find('.fa-spin').removeClass('d-none');
    $('.txtloading ').removeClass('d-none');
    $.ajax({
        url : host+'marketing/getproject',
        type: 'POST',
        data: { 'id': $(this).val() }, 
        success(res){
            var content = $.parseJSON(res);        
           if(content.length > 0){
                $('#prjname').val(content[0].prj_name);
                $('#series').val(content[0].series).change();
                $('#shoporder').val(content[0].order_no);
                $('#operation').val(content[0].operation);
                $('#spec').val(content[0].spec);
                $('#prdsch').val(content[0].amec_schdl);
                var agent  = content[0].agent+ ' ('+content[0].dstn+')';
                $('#agent').val(agent).change();
                $('#country').val(content[0].dstn);  

                $('#inqno').focus();    
                $('#prjloading').find('.fa-spin').addClass('d-none');
                getdupplicate();  
                getproperties();
                $('.txtloading ').addClass('d-none');
            }else{
                $('#prjname').focus();
                $('#prjloading').find('.fa-spin').addClass('d-none');
                $('.txtloading ').addClass('d-none');
            }
        }
    });
    //
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

$("#import-file").uploadFile({
	url: host+'attachment/importinquiry',
	multiple:true,
	dragDrop:false,
	showDelete: true,
	showDownload: true,
	fileName:"fileupload",
    showFileCounter:false,
    onSubmit: function(){
        $('#loading').removeClass('d-none');
        $('#inqloading').removeClass('d-none');
        $('#traderloading').removeClass('d-none');  
    },
	onSuccess: function(files,data,xhr){  
        var content = $.parseJSON(data);   
        if(typeof(content.icon) != "undefined"){
            $('#message').find('.type').html(content.type);
            $('#message').find('.icon').html(content.icon);
            $('#message').find('.title').html(content.title);
            $('#message').find('.text').html(content.text);
            $('#loading').addClass('d-none');
            $('.txtloading').addClass('d-none');  
            display_message();
        }else{
            importInquiry(content);
            $('.txtloading').addClass('d-none');  
            $('#loading').addClass('d-none');
        }
    }
});

$(document).on('click','#addline', function(){
    var tb = $('.table-inq-detail tbody');
    var tr = tb.find('tr:last');
    var seq = parseInt(tr.find('.seq').val())+1;
    insertRow(tr, seq);
});

//Add stock part inquiry 
$('#cusid').on('change', function(){
    $('#cusloading').removeClass('d-none');
    $.ajax({
        url: host+'mar/customers/getCustomer',
        type: 'post',
        data: { 'cusid': $(this).val() },
        success: function(res){
            var content = $.parseJSON(res);  
            if(content.status == 'success'){
                $('#cuscur').val(content.data[0].CUS_CURENCY);
                $('#currency').val(content.data[0].CUS_CURENCY);
                $('#prjname').val(content.data[0].CUS_NAME + ' STOCK');
                //$('#prjno').val('');
            
                var agent  = content.data[0].CUS_AGENT+ ' ('+content.data[0].CUS_COUNTRY+')';        
                $('#agent').val(agent).change();
                $('#country').val(content.data[0].CUS_COUNTRY);
                $('#shipment').val(content.data[0].CUS_LT).change();
                $('#quotation').val(content.data[0].CUS_QUOTATION).change();
                $('#term').val(content.data[0].CUS_TERM).change();
                $('#method').val(2).change();        
                $('#inqno').focus();
            }
            $('#cusloading').addClass('d-none');
        }
    });
});

$(document).on('change','.diritem', function(){
    var cusid = $('#cusid').val();
    var item = $(this).val();
    var row = $(this).closest('tr');
    var col = row.find('.partname').closest('td'); 
    col.append('<div class="txtloading"><i class="fa fa-spinner fa-spin"></i></div>');
    $.ajax({
        url: host+'mar/customers/showmodel',
        type: 'post',
        data: { cusid: cusid, item: item },
        success: function(res) {
            var content = $.parseJSON(res);
            if(content.status == 'success'){
                $('#detail-model').html(content.data);
                var table = $('#table-modal').DataTable( {
                    dom: 'Bfrtip',
                    pageLength: 10,
                    select: {
                        style: 'multi'
                    },            
                    buttons: [
                        {
                            text: '<i class="fa fa-square-o"></i> Select none',
                            className: 'btn btn-main ',
                            action: function () {
                                table.rows().deselect();
                            }
                        },
                        {
                            text: '<i class="fa fa-check-square"></i> Select all',
                            className: 'btn btn-main btn-secondary',
                            action: function () {
                                table.rows().select();
                            }
                        },
                        {
                            text: '<i class="fa fa-paper-plane"></i> Insert to Inquiry',
                            className: 'btn btn-main btn-primary',
                            action: function () {
                                insertDataDirect(row, table);
                                $('#modal-ext-data').modal('hide');
                            }
                        }
                    ],
                    language: {
                        search: '',
                        paginate: {
                            previous: '<i class="fa fa-chevron-circle-left"></i>',
                            next:	'<i class="fa fa-chevron-circle-right"></i>',
                        }
                    }                       
                });
    
                $('#modal-ext-data').modal('show');
            }else{
                $('#message').find('.type').html(content.data.type);
                $('#message').find('.icon').html(content.data.icon);
                $('#message').find('.title').html(content.data.title);
                $('#message').find('.text').html(content.data.text);
                $('#loading').addClass('d-none');
                display_message();
            }
            col.find('.txtloading').remove();
        }
    });
});

$(document).on('change','.dirqty', function(){
    var qty = $(this);
    if(qty.val() === '' || Number.isNaN(parseInt(qty.val()))){
        qty.val('');
        qty.css('border', '2px solid red');  
        setTimeout(function(){ 
            qty.css('border', 'none');
        }, 5000, qty);
        return false;
    }else{
        qty.css('border', 'none');
    }

    var row = $(this).closest('tr');
    var item = row.find('.itemno').val();
    var partname = row.find('.partname').val().trim();
    if(item == '101' && partname == 'T/M' && $(this).val() > 1){
        var seq = row.find('.seq').val();
        var drawing = row.find('.drawing').val();
        var variable = row.find('.variable').val();
        var um = row.find('.um').val();
        var supplier = row.find('.supplier').val();
        var price = row.find('.price').val(); 
        for(var i = 0 ; i < $(this).val()-1 ; i++){            
            seq = parseInt(seq)+1;
            insertRow(row, seq);            
            row = row.next();
            row.find('.itemno').val(item);
            row.find('.partname').val(partname);
            row.find('.drawing').val(drawing);
            row.find('.variable').val(variable);
            row.find('.um').val(um);
            row.find('.supplier').val(supplier);
            row.find('.dirqty').val(1);
            row.find('.price').val(price);
            row.find('.total').val(price);            
        }
        $(this).val(1);
    }else{
        var price = row.find('.price').val();
        var total = price * $(this).val();
        row.find('.total').val(total);
    }

    //var row = $(this).closest('tr');
    
});

function importInquiry(data){ 
    var tb = $('.table-inq-detail tbody');
    if(tb.find('tr').length ==1 && tb.find('tr:first .mfgno').val() == ''){
        index = 0;
    }else{
        index = tb.find('tr:last').index();
    }
    
    if(index == 0){ 
        var agent  = data[0].agent+ ' ('+data[0].dstn+')';       
        $('#agent').val(agent).change();
        $('#prdsch').val(data[0].amec_schdl);
        $('#country').val(data[0].dstn);
        $('#inqno').val(data[0].inqno);
        $('#operation').val(data[0].operation);
        $('#shoporder').val(data[0].order_no);        
        $('#prjname').val(data[0].prj_name);
        $('#prjno').val(data[0].prj_no);
        $('#series').val(data[0].series).change();
        $('#spec').val(data[0].spec);
        if(data[0].agent !== ''){
            getproperties();
        }
    }

    $('#inqloading').addClass('d-none');
    var row = tb.find('tr:eq('+index+')');
    for(i = 0; i < data.length; i++){ 
        if(index > 0){
            tb.find('tr:last').after('<tr>'+row.html()+'</td>');
        }
        var currentRow = tb.find('tr:last');
        //Reset comment and action
        currentRow.find('.rowaction').val('A');
        currentRow.find('.rowid').val('');
        currentRow.find('.comment-row').remove();
        currentRow.find('.action .comment').removeClass('iscomment');
        currentRow.find('.new-comment').html('');

        //Apply new data
        currentRow.find('.seq').val(data[i].seqno);            
        currentRow.find('.mfgno').val(data[i].mfgno);
        currentRow.find('.carno').val(data[i].carno);
        currentRow.find('.itemno').val(data[i].item);
        currentRow.find('.partname').val(data[i].partname);
        currentRow.find('.drawing').val(data[i].drawing);
        currentRow.find('.variable').val(data[i].viriable);
        currentRow.find('.qty').val(data[i].qty);
        currentRow.find('.um').val(data[i].um);
        if(data[i].remark != ''){
            currentRow.find('.new-comment').val(data[i].remark);
            currentRow.find('.comment').addClass('hasComment');
            currentRow.find('.comment').css('color', '#f44336');
        }
        index++;
    }
    $('.savedata').removeClass('disabled');    
}

function getdupplicate(){
    if($('#inqno').val().trim() != ''){
        $.ajax({
            url: host+'mar/inquiry/checkInquiry',
            type: 'post',
            async: false,
            data: {'id' : $('#inqno').val().trim().toUpperCase() },
            success: function(res) {
                var content = $.parseJSON(res);  
                if(content.status == 'availiable'){
                    $('#inqloading').addClass('d-none');
                    $('.savedata').removeClass('disabled');
                }else{
                    $('#inqno').val('');                
                    $('#inqno').css('border', '2px solid red');
                    $('#inqno').addClass('has-error');
                    $('#inqloading').addClass('d-none');

                    $('#message').find('.type').html(content.data.type);
                    $('#message').find('.icon').html(content.data.icon);
                    $('#message').find('.title').html(content.data.title);
                    $('#message').find('.text').html(content.data.text);
                    $('#loading').addClass('d-none');
                    display_message();
                }
            }
        });
    }
    $('#traderloading').addClass('d-none');
}

function getproperties(){
    var id =  $('#inqno').val().trim().toUpperCase();    
    if(id != ''){       
        var prefix = '';
        var agent = '';
        if(id.substring(0,2) == 'T-'){
            prefix = id.substring(0,5);         
        }else if(id.substring(0,1) == 'D'){
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
            //async: false,
            data: {'prefix' : prefix, 'agent' : agent },
            success: function(res) {
                var content = $.parseJSON(res);   
                if(content.status == 'success'){
                    $('#term').val( content.data.CNT_TERM).change();

                    if($('#trader').val() != 'Direct'){
                        $('#trader').val(content.data.CNT_TRADER).change(); 
                        $('#quotation').val( content.data.CNT_QUOTATION).change();
                    }else{
                        $('#quotation').val(4).change();
                    }

                    if(content.data.CNT_WEIGHT == 1){
                        $('#pkcreq1').prop('checked', true);
                    }else{
                        $('#pkcreq0').prop('checked', true);
                    }

                    $('#method').val( content.data.CNT_METHOD).change();
                    
                }
                $('#traderloading').addClass('d-none');  
            }
        });
    }
}

function insertDataDirect(row, table){
    var data = table.rows({ selected : true }).data();
    var index = row.index();
    var tb = row.closest('tbody');   
    var itemno = row.find('.itemno').val();
    var seq = row.find('.seq').val();
    
    for(i = 0; i < data.length; i++){         
        if(i > 0){
            var rows = tb.find('tr:eq('+index+')').after('<tr>'+row.html()+'</td>');
            index++;            
            if(parseFloat(seq).toFixed(2)%1 == 0){
                seq = (parseInt(seq)+1).toFixed(0);
            }else{
                seq = (parseFloat(seq)+0.01).toFixed(2);
            }
            row = tb.find('tr:eq('+index+')');
        }

        row.find('.seq').val(seq);
        row.find('.itemno').val(itemno);
        row.find('.partname').val(data[i][1]);
        row.find('.drawing').val(data[i][2]);
        row.find('.variable').val(data[i][3]); 
        row.find('.um').val(data[i][4]); 
        row.find('.supplier').val(data[i][5]); 
        row.find('.dirqty').val(1); 
        row.find('.tccost').val(data[i][6]);
        row.find('.tcrate').val(data[i][7]);
        row.find('.unitprice').val(data[i][9]);
        row.find('.total').val(data[i][9]);
    }
}