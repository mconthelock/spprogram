function design_person(){
    var result = true;
    if($('#desclass').val() == ''){
        $('#desclass').next().find('span.select2-selection').css('border-bottom', '1.5px solid red');
        $('#marusers').focus();
        result = false;
    }else{
        $('#desclass').next().find('span.select2-selection').css('border-bottom', '1px solid #dee2e6');
   }

    if($('#designer').val() == ''){
        $('#designer').next().find('span.select2-selection').css('border-bottom', '1.5px solid red');
        $('#marusers').focus();
        result = false;
    }else{
        $('#designer').next().find('span.select2-selection').css('border-bottom', '1px solid #dee2e6');
    }

    if($('#checker').val() == ''){
        $('#checker').next().find('span.select2-selection').css('border-bottom', '1.5px solid red');
        $('#marusers').focus();
        result = false;
    }else{
        $('#checker').next().find('span.select2-selection').css('border-bottom', '1px solid #dee2e6');
    }
    return result;
}

function check_second(){
    var second = true;
    var attached = $('#table-attach tbody tr').length;
    $('.table-inq-detail tbody tr').map(function(){
        if($(this).find('.checkbox-second').prop('checked') && attached == 0){
            second = false;
        }
    });
    
    if(second ===false){
        $('#message').find('.type').html('error');
        $('#message').find('.icon').html('fa fa-check-circle-o');
        $('#message').find('.title').html('Assign Designer');
        $('#message').find('.text').html('Please add some attached file to support Secoundary Part List!!');
        display_message();
    }
   return second; 
}