$.ajax({
    url: host+'mar/inquiry/getRunning',
    type: 'get',
    dataType: 'json',
    success: function(res){
        var tb = $('#inq-home tbody:last');
        var x = 0;
        var total = 0;
        var de_status = ['2','3'];
        var is_status = ['20', '22'];
        var fin_status = ['11', '12', '13', '14', '15', '16', '18', '21', '23'];
        var your_status = ['1', '17', '19', '24'];
        var de = 0;
        var is = 0;
        var fin = 0;
        var your  = 0;
        res.map(function(val){    
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
            if(de_status.includes(val.INQ_STATUS)) de++;
            if(is_status.includes(val.INQ_STATUS)) is++;
            if(fin_status.includes(val.INQ_STATUS)) fin++;
            if(your_status.includes(val.INQ_STATUS)) your++;
            total++;            
        });

        $('#home-sumary-total a').html(total);
        $('#home-sumary-de a').html(de);
        $('#home-sumary-is a').html(is);
        $('#home-sumary-fin a').html(fin);
        $('#home-sumary-your a').html(your);
    }
});

$.ajax({
    url: host+'mar/inquiry/getSumary',
    type: 'get',
    dataType: 'json',
    success: function(res){
        var label = [];
        var inq = [];
        var secure = [];
        var bypasss = [];
        res.map(function(data){
            label.push(data.INQ_MONTH+'\''+data.INQ_YEAR);
            inq.push(data.INQNO);
            secure.push(data.SECURE);
            bypasss.push(data.BYPASS);
        });  
        createChart(label, inq, secure, bypasss);
    }
});

function createChart(label, inq, secure, bypasss){
    var color = [];
    for(var i = 0; i < 12; i++){
        if(i == 11) color.push('#34495e');
        else color.push('#3498db');
    }
    var myChart = new Chart($('#home-chart'), {
        type: 'bar',
        data: {
            labels: label,
            datasets: [                
                {
                    label: 'Secure Inquiry',
                    data: secure,
                    backgroundColor: color
                },
                {
                    label: 'Bypass Inquiry',
                    data: bypasss,
                    backgroundColor: '#e67e22'
                },
                {
                    label: 'Total Inquiry',
                    type: 'line',
                    data: inq,
                    borderColor: '#95a5a6'
                }
            ]
        },
        options: {
            scales:{ 
                y:{ beginAtZero: true }
            },
            legend: { position: 'bottom' },
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}