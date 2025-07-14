$.ajax({
    url: host+'fin/inquiry/getRunning',
    type: 'get',
    dataType: 'json',
    success: function(res){
        var data = res.data;
        var tb = $('#inq-home tbody:last');
        var x = 0;
        var total = 0;
        var upload = 0;
        var check = 0;
        var approve = 0;
        data.map(function(val){    
            if(x < 10){
                var str = '<tr>';
                str += '<td>'+val.INQ_NO+'</td>';
                str += '<td>'+val.STATUS_DESC+'</td>';
                str += '<td>'+val.INQ_DATE+'</td>';
                str += '<td></td>';
                str += '</tr>';
                tb.append(str);
            }
            x++;

            // 14, 15, 16, 18, 20, 21, 23
            switch(val.INQ_STATUS) {
                case '11':
                case '12':
                case '13':
                case '16':
                case '18':
                case '20':
                case '21':
                case '23':
                    upload++;
                    break;
                case '14':
                    check++;
                    break;
                case '15':
                    approve++;
                    break;
                default:
                    break;
            }
            total++;            
        });

        $('#home-sumary-total a').html(total);
        $('#home-sumary-upload a').html(upload);
        $('#home-sumary-check a').html(check);
        $('#home-sumary-approve a').html(approve);
    }
});

$.ajax({
    url: host+'fin/inquiry/getSumary',
    type: 'get',
    dataType: 'json',
    success: function(res){
        var label = [];
        var value = [];
        res.map(function(data){
            label.push(data.INQ_MONTH+'\''+data.INQ_YEAR);
            value.push(data.TOTAL);
        });               
        createChart(label, value);
    }
});

function createChart(label, data){
    var color = [];
    for(var i = 0; i < 12; i++){
        if(i == 11) color.push('#e67e22');
        else color.push('#3498db');
    }
    var myChart = new Chart($('#home-chart'), {
        type: 'bar',
        data: {
            labels: label,
            datasets: [{
                data: data,
                backgroundColor: color
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            legend: { 
                display: false
            },
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}