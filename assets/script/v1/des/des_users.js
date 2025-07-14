$(".nav-item").removeClass("active");
$(".navmenu-desiger").addClass("active");

var users = [];
var desTable;

$(document).ready(async () => {
    users = await getDesUsers();
    desTable = createTable(users);
});

$(document).on("click", ".design-user", function (e) {
    const row = desTable.row($(this).parents("tr"));
    const val = desTable.row(row).data();
    const type = $(this).val();
    const func = $(this).prop("checked");
    $.ajax({
        url: `${host}des/users/updateUser`,
        type: "post",
        data: {
            empno: val.SEMPNO,
            type: type,
            func: func ? 1 : 0
        },
        dataType: "json",
        async: false
    })

});

function createTable(dt){
    const tableid = "#tb-design";
    if ($.fn.DataTable.isDataTable(tableid)) $(tableid).DataTable().destroy();
    const opt = { ...tableOption };
    opt.dom = '<lf<"fixed-table"t><"tablefoot d-inline-flex pt-1 mt-3"i>p>';
    opt.order = [[0, "desc"]];
    opt.searching = false;
    //opt.ordering = false;
    opt.paging = false;
    opt.data =  dt;
    opt.columns = [
        {
            data: "SEMPNO",
            render: function (data, e, row) {
                return `
                <div class="users d-flex">
                    <div class="avatar">
                        <div class="w-12">
                            <img src="data:image/jpg;base64,${row.pic}" alt="${data}"/>
                        </div>
                    </div>
                    <div class="ms-3">
                        <div class="name fw-bold fs-6">${row.SNAME}</div>
                        <div class="empno fs-6">${data}</div>
                        <div class="org">${row.SDEPT} / ${row.SSEC}</div>
                    </div>
                </div>`;
            },
        },
        {
            data: "DESIGNER",
            className: "text-center",
            sortable: false,
            render: function (data, e, row) {
                return `<input class="form-check-input design-user" type="checkbox" value="1" id="designer" ${data == 1 ? 'checked': ''}>`;
            }
        },
        {
            data: "CHECKER",
            className: "text-center",
            sortable: false,
            render: function (data, e, row) {
                return `<input class="form-check-input design-user" type="checkbox" value="2" id="checker" ${data == 1 ? 'checked': ''}>`;
            }
        },
    ];
    return $(tableid).DataTable(opt);
}

function getDesUsers() {
    return new Promise((resolve) => {
      $.ajax({
        url: `${host}des/users/getUser`,
        type: "post",
        async: false,
        dataType: "json",
        success: function (res) {
          resolve(res.data);
        },
      });
    });
  }