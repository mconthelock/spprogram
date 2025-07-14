var host = $('meta[name=base_url]').attr('content');
$('#loading').addClass('d-none');
display_message();

function display_message(){
    var message = $('#message');
    if(message.find('.text').html().trim().length > 0){
        $.notify({
            icon:  message.find('.icon').html(),
            title: message.find('.title').html(),
            message: message.find('.text').html()
        },{
            type: message.find('.type').html().trim(),
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
        });	
    }

    message.find('.type').html('');
    message.find('.icon').html('');
    message.find('.title').html('');
    message.find('.text').html('');
}

const $status = $('.status');
const $status_panel = $('#status-panel');

const $comment = $('.comment');
const $comment_panel = $('.target');

$(document).mouseup(e => {
    if (!$status.is(e.target) 
        && $status.has(e.target).length === 0 
        && !$status_panel.is(e.target) 
        && $status_panel.has(e.target).length === 0){

        $status_panel.addClass('d-none');
    }

    if (!$comment.is(e.target) 
        && $comment.has(e.target).length === 0 
        && !$comment_panel.is(e.target) 
        && $comment_panel.has(e.target).length === 0){

        $comment_panel.css('display', 'none');
    }
});

$('.status').on('click', function(){
    $('#status-panel').toggleClass('d-none');
    if(!$('#status-panel').hasClass('d-none')){
        var id = $('#inqno').val();
        $.ajax({
            url: host+'inquiry/getHistory',
            type: 'POST',
            data : { 'id': id },
            success(res){
                var tb = $('#status-panel').find('.table tbody');
                var content = $.parseJSON(res);
                if(content.length > 0){
                    tb.html('');                    
                    $.each(content, function(index, val){
                        var remark = '';
                        if(val.INQH_REMARK != null){
                            remark = val.INQH_REMARK;
                        }
                        var name = val.SNAME.split(" ");
                        var dspname = name[0].substring(0,1)+ name[0].substring(1, name[0].length).toLowerCase();
                        row = '<tr>';
                        row += '<td>'+val.STATUS_ACTION+'</td>';
                        row += '<td>'+dspname+' ('+val.SEMPNO+')'+'</td>';
                        row += '<td>'+val.INQH_DATE.substring(0, 16)+'</td>';
                        row += '<td>'+remark+'</td>';
                        tb.last().append(row);
                    }); 
                }else{
                    tb.last().html('<tr><td class="text-center" colspan="4">No any record found!</td></tr>')
                }
            }
        });
    }
});

$('.status-close').on('click', function(){
    $('#status-panel').addClass('d-none');
});


$(document).on('click','.insert-line', function(){
    var row = $(this).closest('tr');    
    var seq = row.find('.seq').val();
    seq = (parseFloat(seq)+0.01).toFixed(2);
    insertRow(row, seq);
});

$(document).on('click','.delete-line:not(.disabled)', function(){
    var tr = $(this).closest('tr');
    if(tr.find('.rowaction').val() == 'U'){
        tr.find('.rowaction').val('D');
        tr.fadeOut(700);
    }else{
        var cnt = tr.closest('tbody').find('tr').length;
        if(cnt == 1){
            tr.find('textarea').val('');
            tr.find('.checkbox').prop('checked', '');
            tr.find('.supplier').val('').change();
            tr.find('.seq').val(1);
        }else{
            tr.remove();
        }        
    } 
});

//Attachment Action
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
        }     
    }
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

$(document).on('click', '.deletefile:not(.disabled)', function(){
    var tr = $(this).closest('tr');
    if(tr.find('.mode').val() == 'temp'){
        (async () => {
            const rawResponse = fetch(host+'api/inquiry/deleteattachedfile', {
                method: 'POST',
                headers: {'Accept': 'application/json','Content-Type': 'application/json'},
                body: JSON.stringify({name: tr.find('.filename').val(), mode: 'temp'})
            });
            tr.remove();
        })();
    }else{
        tr.find('.mode').val('D');
        tr.fadeOut(500);
    }
});

//View Comment
$(document).on('click', '.comment:not(.disabled)', function(){
    $('.target').hide();    
    $(this).removeClass('iscomment');
    $(this).closest('td').find('.target').toggle();
});

$(document).on('click', '.comment-close', function(){
    $(this).closest('.target').hide();
});   

$(document).on('change', '.new-comment', function(){
    if($(this).val() != '')
    {
        $(this).closest('td').find('.comment').css('color', '#f44336');
        $(this).closest('td').find('.comment').addClass('hasComment');
    }
});

//View history
$(document).on('click', '.history:not(.disabled)', function(){
    var seqno = $(this).closest('tr').find('.seq').html();
    var inqid = $('#inqid').val();
    $.ajax({
        url: host+'inquiry/getHistoryDetail',
        type: 'post',
        data: {'id': inqid, 'seqno' : seqno },
        success: function(res) {
            var content = $.parseJSON(res);  
            if(content.status == 'success'){
                $('#history-model-body').html(content); 
                $('#history-model').modal('show');
            }
        }
    });
});

//Input inquiry detail table
$(document).on('change','.carno', function(){   
    if($('#prjno').val() != ''){
        var row = $(this).closest('tr');
        var col = row.find('.mfgno').closest('td'); 
        col.append('<div class="txtloading"><i class="fa fa-spinner fa-spin"></i></div>');
        var txtfield = $(this);
        $.ajax({
            url: host+'marketing/getmfgorder',
            type: 'post',
            data: {'prjno': $('#prjno').val(), 'carno' : $(this).val() },
            success: function(res) {
                var content = $.parseJSON(res);
                if(content.status == 'success'){
                    txtfield.closest('tr').find('.mfgno').val(content.data[0].mfgno); 
                    txtfield.closest('tr').find('.itemno').focus();
                }else{
                    txtfield.closest('tr').find('.mfgno').focus();
                }
                col.find('.txtloading').remove();
            }
        });
    }
});

$(document).on('change','.mfgno', function(){
    var row = $(this).closest('tr');
    var mfgno = $(this).val();
    var item = row.find('.itemno').val();     
    if(mfgno == '' && item == '366'){
        swal({
            title: "Item 366?",
            text: "If require full set, but no original not supply. Are you sure?",
            icon: "warning"
        });	
    }

    if(mfgno != '' && item != ''){
        showModal(mfgno, item, row);
    }
});

$(document).on('change','.sp-itemno', function(){
    var col = $(this).closest('tr').find('.partname').closest('td'); 
    col.append('<div class="txtloading"><i class="fa fa-spinner fa-spin"></i></div>');

    item = $(this);
    if(item.val() === '' || Number.isNaN(parseInt(item.val()))){
        item.val('');
        item.css('border', '2px solid red');  
        setTimeout(function(){ 
            item.css('border', 'none');
        }, 5000, item);
        return false;
    }else{
        //Checking is complete set data
        var data = ['GPQ3', 'GPW4', 'GPS4', 'GPQ4', 'GPS5' ];
        var isrecon_series = data.indexOf($('#series').val().substring(0, 4));
        
        var data = ['203', '214', '231'];
        var isrecon_items = data.indexOf($(this).val());
        if(isrecon_series >= 0 && isrecon_items >= 0){         
            swal({
                title: "Recon Part?",
                text: "Is it a complete set? If \"Yes\" please handle as Recon",
                icon: "warning"
            });	
        }

        //Check Item no
        var itemno = parseInt(item.val());
        if(itemno < 100 || itemno > 999){
            item.val('');
            item.css('border', '2px solid red');  
            setTimeout(function(){ 
                item.css('border', 'none');
            }, 5000, item);
            return false;
        }else{
            item.css('border', 'none');
        }

        var row = $(this).closest('tr');
        var mfgno = row.find('.mfgno').val();
        var item = $(this).val();
        if(mfgno == '' && item == '366'){
            swal({
                title: "Item 366?",
                text: "Is it a complete set? If \"Yes\" please handle as Recon",
                icon: "warning"
            });	
        }
        if(mfgno != '' && item != ''){
            showModal(mfgno, item, row);
        }
        $('.txtloading').addClass('d-none');
    }
});

$(document).on('change','.qty', function(){
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
        var carno = row.find('.carno').val();
        var mfgno = row.find('.mfgno').val();
        var drawing = row.find('.drawing').val();
        var variable = row.find('.variable').val();
        for(var i = 0 ; i < $(this).val()-1 ; i++){            
            seq = parseInt(seq)+1;
            insertRow(row, seq);            
            row = row.next();
            row.find('.carno').val(carno);
            row.find('.mfgno').val(mfgno);
            row.find('.itemno').val(item);
            row.find('.partname').val(partname);
            row.find('.drawing').val(drawing);
            row.find('.variable').val(variable);
            row.find('.qty').val(1);
        }
        $(this).val(1);
    }
});

$(document).on('change', '.supplier', function(){
    var isBlank = false;    
    var rowindex = $(this).closest('tr').index();    
    var tb  = $(this).closest('tbody');
    tb.find('tr').map(function(){
        if($(this).find('.supplier').val() == '' && $(this).index() != rowindex){ isBlank = true;}
    });

    if(isBlank === true && $('#repeat').length != 1){
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
                tb.find('tr').map(function(){
                    var supplier = $(this).find('.supplier');                
                    if(supplier.val() == ''){
                        supplier.val(values);
                    }
                });
            }
        });
        $('body').append('<input type="hidden" value="1" id="repeat"/>');
    }
});

$(document).on('click', '.checkbox-unreply', function(){
    if($(this).prop('checked') === true){
		var row_index = $(this).closest('tr').index();
		$('#return_row').val(row_index);
		$('#reason-model').modal({backdrop: 'static', keyboard: false});
        $(this).closest('tr').addClass('unreply');
        $(this).closest('tr').find('.comment').removeClass('disabled');
	}else{
		$(this).val('0');
		$(this).closest('tr').find('.des_remark').val('');
        $(this).closest('tr').find('.new-comment').val('');
        $(this).closest('tr').removeClass('unreply');
	}
});

$('#reason-model').on('hidden.bs.modal', function () {
	var li = $(this).find('.unable2reply');
	var xli = $(this).find('.unable2reason');
	var code =  '';
	var remark = '';
	for(var i=0; i < li.length; i++){
		if(li[i].checked === true){
			code = li[i].value;
			remark = xli[i].value;
			if(code == 99 && xli[i].value == 'Other'){
               remark += ':'+$('#reason-txt').val();
			}
		}
	}
	var row = $('#return_row').val();    
    var targetrow = $('.table-inq-detail tbody').find('tr:eq('+row+')');

    if(code == ''){        
        targetrow.find('.checkbox-unreply').prop('checked', false);
        targetrow.removeClass('unreply');
        return false;
    }else if(code == 99 && remark === "") {
        targetrow.find('.checkbox-unreply').prop('checked', false);
        targetrow.removeClass('unreply');
        return false;
    }
    targetrow.find('.checkbox-unreply').val(code);
	targetrow.find('.new-comment').val(remark);
    targetrow.find('.comment').addClass('hasComment');
});

//---- Update seq no
$('#realign').on('click', function(){
    var tb = $('.table-inq-detail tbody');
    var i = 0;
    var x = 0.01;
    tb.find('tr:visible').map(function(){
        var watch = $(this).find('.seq').val();
        if(parseFloat(watch).toFixed(2)%1 == 0){
            seq = (parseInt(i)+1).toFixed(0);
            $(this).find('.seq').val(seq);
            x = 0.01;
            i++;
        }else{
            seq = (parseFloat(i)+x).toFixed(2);
            $(this).find('.seq').val(seq);
            x = x+0.01;
        }
    });
});

//Add row 
function insertRow(row, seqno){
    row.after('<tr>'+ row.html() +'</tr>');
    var nextrow = row.next();
    nextrow.find('textarea').val('');
    nextrow.find('select').val('');
    nextrow.find('.checkbox').attr('checked', false);
    nextrow.find('.target').find('.container').html('');
    nextrow.find('.comment').removeClass('hasComment');
    nextrow.find('.rowid').val('');

    nextrow.find('.seq').val(seqno);
    nextrow.find('.rowaction').val('A');
    nextrow.find('.rowid').val('');

    nextrow.find('.comment-row').remove();
    nextrow.find('.action .comment').removeClass('iscomment');
    nextrow.find('.new-comment').val('');
    nextrow.find('.delete-line').removeClass('disabled');
    nextrow.find('.view-history').addClass('disabled');
    nextrow.find('textarea').removeClass('update');
    nextrow.find('select').removeClass('update');
    nextrow.find('input').removeClass('update');
}
//Display Elmes data
function showModal(orderno, itemno, row){
    $.ajax({
        url: host+'elmes/showModel',
        type: 'post',
        data: { ordno: orderno, item: itemno}, 
        success: function(res) {
            $('.table-inq-detail').find('.txtloading').remove();
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
                                insertData(row, table);
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
            }
        }
    });
}

//Copy data from Elmes table into Inquiry table
function insertData(row, table){
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
        row.find('.mfgno').val(data[i][0]);
        row.find('.carno').val(data[i][1]);
        row.find('.partname').val(data[i][2]);
        row.find('.drawing').val(data[i][3]); 
        row.find('.variable').val(data[i][4]); 
        row.find('.qty').val(data[i][5]); 
        if(data[i][6] == '0' || data[i][6] == 'O'){
            row.find('.checkbox-second').prop('checked', true); 
        }

        if(data[i][7] == 'R'){
            row.find('.supplier').val('LOCAL'); 
        }else if(data[i][7] == 'J'){
            row.find('.supplier').val('MELINA'); 
        }
    }
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
    row += '<td width="10px"><div class="deletefile"><i class="icofont-bin"></i></div></td>';
    row += '<td><div class="downloadfile"><i class="fa '+data.file_class+'"></i>'+data.file_old_name+'</div>'+hidden+'</td>';
    row += '<td class="text-right">'+data.file_size+'KB</td>';    
    row += '</tr>';
    tb.last().append(row);
}

function verifydata(){
    // 1. Check inquiry
    var result = true;
    var supplier = true;
    if($('#inqno').val() == '') {
        $('#inqno').css('border', '2px solid red');
        return false;
    }

    $('.table-inq-detail tbody tr:visible').map(function(){
        if($(this).find('.itemno').length == 1){
            var item = $(this).find('.itemno');
            if(item.val() == ''){
                item.css('border', '2px solid red');  
                setTimeout(function(){ 
                    item.css('border', 'none');
                }, 5000, item);
                result =  false;
                return false;
            }
            var itemno = parseInt(item.val());                
            if(itemno < 100 || itemno > 999){
                item.val('');
                item.css('border', '2px solid red');  
                setTimeout(function(){ 
                    item.css('border', 'none');
                }, 5000, item);
                result =  false;
                return false;
            }
        }
        
        //Variable should be right format
		if($(this).find('.variable').length == 1){
			var variable = $(this).find('.variable');
			if(variable.val() != ''){
				var chkvar = chkVariable(variable.val());		
				if(chkvar === false){
					variable.css('border', '2px solid red'); 
					setTimeout(function(){ 
						variable.css('border', 'none');
					}, 5000, qty);
					result =  false;
					return false;
				}
			}
		}

        //Qty cannot be letter
        if($(this).find('.qty').length == 1){
            var qty = $(this).find('.qty');
            if(qty.val() == '' || Number.isNaN(parseInt(qty.val()))){
                qty.val('');
                qty.css('border', '2px solid red');  
                setTimeout(function(){ 
                    qty.css('border', 'none');
                }, 5000, qty);
                result =  false;
                return false;
            }
        }

        //If would like to sen inquiry to Pre-BM, you must put drawing no 
        if(($('#status').val() == 20 || $('#status').val() == 9 ) && $(this).find('.drawing').val() == ''){
            var dwg = $(this).find('.drawing');
            dwg.val('');
            dwg.css('border', '2px solid red');  
            setTimeout(function(){ 
                dwg.css('border', 'none');
            }, 5000, dwg);
            result =  false;
            return false;
        }
        
    });
    return result;
}

function getheader(){
    var header = {};
    $('.form-header').find('input[type="text"]').map(function(){
        var name = $(this).attr('name');
        var value = $(this).val();
        header[name] = value;
    });
    $('.form-header').find('input[type="hidden"]').map(function(){
        var name = $(this).attr('name');
        var value = $(this).val();
        header[name] = value;
    });
    $('.form-header').find('input[type="radio"]').map(function(){
        if($(this).prop('checked')){
            var name = $(this).attr('name');
            var value = $(this).val();
            header[name] = value;
        }    
    });
    $('.form-header').find('select').map(function(){
        var name = $(this).attr('name');
        var value = $(this).val();
        header[name] = value;
    });
    $('.form-header').find('textarea').map(function(){
        var name = $(this).attr('name');
        var value = $(this).val();
        header[name] = value;
    });
    header['owner'] = $('#users').val();
    return header;
}

function getfooter(){
    var footer = {};   
    $('.table-inq-detail tbody tr.summary').map(function(){    
        $(this).find('td').map(function(){
            if($(this).find('input[type="text"]').length == 1 || $(this).find('input[type="hidden"]').length == 1){
                var name = $(this).find('input').attr('name');
                var value = $(this).find('input').val();
                footer[name] = value;
            }
        });
    });
    return footer;
}

function getGroup(){
    var group = [];
    var groups = [];      
    $('.table-inq-detail tbody tr:not(.summary)').map(function(){
        //var item =  parseInt($(this).find('.itemno').val()/100);
        var item = 0;
        if($(this).find('.itemno').hasClass('form-control') === true){
            var items = $(this).find('.itemno').val();
            var item = parseInt((items.substring(0, 1)));
        }else if($(this).find('.itemno').length == 1){
            var items = $(this).find('.itemno').html();
            var item = parseInt((items.substring(0, 1)));
        }   
        
        var action = $(this).find('.rowaction').val()
        if(group.indexOf(item) == -1 && action != 'D'){
            group.push(item);
        }       
    });
    var desclass = '';
    var assign = '';
    var designer = '';
    var checker = '';
    var assigndate = '';
    var designdate = '';
    var checkdate = ''; 

    if($('#desclass').length == 1){ desclass = $('#desclass').val(); }
    if($('#assign').length == 1){ assign = $('#assign').val(); }    
    if($('#designer').length == 1){ designer = $('#designer').val(); }
    if($('#checker').length == 1){ checker = $('#checker').val(); }
    if($('#assigndate').length == 1){ assigndate = $('#assigndate').val(); }
    if($('#designdate').length == 1){ designdate = $('#designdate').val(); }
    if($('#checkdate').length == 1){ checkdate = $('#checkdate').val(); }

    for(var i=0; i < group.length; i++){
        var tmpObj = {};
        tmpObj['item'] = group[i];
        tmpObj['desclass'] = desclass;
        tmpObj['assign'] = assign;
        tmpObj['designer'] = designer;
        tmpObj['checker'] = checker;
        tmpObj['assigndate'] = assigndate;
        tmpObj['designdate'] = designdate;
        tmpObj['checkdate'] = checkdate
        groups.push(tmpObj);
    }
    return groups;       
}

function getdetail(){
    var detail = [];   
    $('.table-inq-detail tbody tr').map(function(){ 
        var tmpObj = {};       
        $(this).find('td').map(function(){
            if($(this).find('textarea').length == 1){
                var name = $(this).find('textarea').attr('name');
                var value = $(this).find('textarea').val();
                tmpObj[name] = value;
            }

            if($(this).find('input[type="text"]').length == 1 || $(this).find('input[type="hidden"]').length == 1){
                var name = $(this).find('input').attr('name');
                var value = $(this).find('input').val();
                tmpObj[name] = value;
            }

            if($(this).find('input[type="checkbox"]').length == 1){
                var name = $(this).find('input').attr('name');
                if($(this).find('input').prop('checked') === true){
                    var value = $(this).find('input').val();
                }else{
                    var value = null;
                }
                tmpObj[name] = value;
            }           
            if($(this).find('select').length == 1){
                var name = $(this).find('select').attr('name');
                var value = $(this).find('select option:selected').val();
                tmpObj[name] = value;
            }
        });
        detail.push(tmpObj);
    });
    return detail;
}

function getAttachment(){
    var files = [];   
    $('#table-attach tbody tr').map(function(){
        var tmpObj = {};
        tmpObj['filename'] = $(this).find('.filename').val();
        tmpObj['fileoname'] = $(this).find('.fileoname').val();
        tmpObj['filesize'] = $(this).find('.filesize').val();
        tmpObj['filetype'] = $(this).find('.filetype').val();
        tmpObj['fileclass'] = $(this).find('.fileclass').val();
        tmpObj['mode'] = $(this).find('.mode').val();
        files.push(tmpObj);
    });
    return files;
}

function createAction(task, data){
    var result = '';
    switch (task) {
        case 'update':
            result = '<a class="btn-action" href="{{ base_url() }}mar/inquiry/update/'+data+'"><i class="fa fa-edit"></i></a>';
            break;
        case 'delete':
            result = '<a class="btn-action delete-inquiry" href="#" data-value="'+data+'"><i class="fa fa-trash-o"></i></a>';
            break;
        case 'assign':
            result = '<a class="btn-action" href="{{ base_url() }}des/inquiry/assigning/'+data+'"><i class="fa fa-calendar-plus-o"></i></a>';
            break;    
        case 'declare':
            result = '<a class="btn-action" href="{{ base_url() }}des/inquiry/designing/'+data+'"><i class="fa fa-th-list"></i></a>';
            break;
        case 'check':
            result = '<a class="btn-action" href="{{ base_url() }}des/inquiry/designing/'+data+'"><i class="fa fa-th-list"></i></a>';
            break;
        case 'revise-dev':
            result = '<a class="btn-action" href="{{ base_url() }}des/inquiry/designing/'+data+'"><i class="fa fa-edit"></i></a>';
            break;
        case 'export':
            result = '<a class="btn-action" href="{{ base_url() }}des/inquiry/designing/'+data+'"><i class="fa fa-external-link"></i></a>';
            break;
        default:
            break;
    }
    return result;
}

function checkDesign(data){
    if(data == null){
        return '';
    }
    
    if(data == 9){
        return '<i class="fa  fa-check-circle complete"></i>';
    }else if(data == -1){
        return '<i class="fa  fa-check-circle bypass"></i>';
    }else{
        return '<i class="fa  fa-check-circle"></i>';
    }         
}
function createTable(target, xurl, q, xcolumns){
    var table = $(target).DataTable({
        pageLength: 10,
        lengthChange : false,
        language: {
            search: '',
            paginate: {
                previous: '<i class="fa fa-chevron-circle-left"></i>',
                next:	'<i class="fa fa-chevron-circle-right"></i>',
            },            
        },
        ajax: {
            url: xurl,
            type: 'POST',
            async: false,
            data:  q,
            dataSrc:{}
        },
        
        columnDefs: [
            { targets: 'action-tool', orderable: false, className: "text-center"}
        ],
        columns: xcolumns,
        order:[[0, "desc"]]
    });
    if($('.pagination').find('li').hasClass('active') === false){
        $('.pagination').addClass('d-none');
    }
    return table;
}

function chkVariable(data){	
	var res = data.split(",");
	var i = 0;
	var fvar = '';
	var result =  true;
	res.map(function(){
		var val = res[i].split('=');
		if(val.length == 1 && fvar == ''){			
			result = false;
		}else{
			fvar = val[0];
		}
		i++;
	});	
	return result;
}