var Reporting = {
    tbodyTemplate: "",
    aoColumns: [],
    carga_info:function(){

        $.getJSON('reporting/data.json', null, function(respuesta) {
            Reporting.parsing(respuesta);
        });   
        
    },
    dias:function(fecha_referencia){
        var arreglo = fecha_referencia.month.split("-");
/*
        var fecha = new Date(arreglo[0], arreglo[1], arreglo[2]);

        alert("Anio: "+fecha.getFullYear());
        alert("Mes: "+fecha.getMonth());
        alert("Dia: "+fecha.getDay());
        alert("Dia: "+fecha.getDate());
*/
        var dias_del_mes = new Date(arreglo[0], arreglo[1], 0).getDate();
        //alert(dias_del_mes);

        var cadena_td = "";
        var cadena_th = "";
        var cadena_content = "";
        
        this.COLS_ARRAY = [];//Inicializamos el arreglo
        this.COLS_ARRAY.push({"sWidth": "5%"});
        this.COLS_ARRAY.push({"sWidth": "5%"});
        this.COLS_ARRAY.push({"sWidth": "5%"});
        for(var i=1;i<=dias_del_mes;i++){
            cadena_th += "<th>"+i+"</th>";
            cadena_td += "<td>"+i+"</td>";

            cadena_content += "<td>"+i+"</td>";
            
            this.COLS_ARRAY.push({"sWidth": "1%", "bSortable": false});
        }
        this.COLS_ARRAY.push({"sWidth": "5%"});
        this.COLS_ARRAY.push({"sWidth": "5%"});
        
        $('#reporting thead').empty();
        $('#reporting thead').html("<tr><th>Request</th><th>Team</th><th>Name</th>"+cadena_th+"<th>Total count</th><th>Availability</th></tr>");
        $('#reporting tfoot').html("<tr><td>Request</td><td>Team</td><td>Name</td>"+cadena_td+"<td>Total count</td><td>Availability</td></tr>");
        return cadena_content;
    },
    creaTemplate:function(fecha){
        var arreglo = fecha.split("-");
        var anio = arreglo[0];
        var mes = arreglo[1];
        var dias_del_mes = new Date(anio, mes, 0).getDate();
            
        var theadTemplate = "";
        this.tbodyTemplate = "";
        var tfootTemplate = "";
        
        this.aoColumns = [];//Inicializamos el arreglo
        this.aoColumns.push({"sWidth": "5%"});
        this.aoColumns.push({"sWidth": "5%"});
        this.aoColumns.push({"sWidth": "5%"});        
        theadTemplate = "<tr><th>Request</th><th>Team</th><th>Name</th>";
        tfootTemplate = "<tr><td>Request</td><td>Team</td><td>Name</td>";
        //this.tbodyTemplate = "<tr>";
        for(var i=1;i<=dias_del_mes;i++){
            theadTemplate += "<th>" + i + "</th>";
            this.tbodyTemplate += "<td>${d"+anio+mes+("0" + i).slice(-2)+"}</td>";
            tfootTemplate += "<td>" + i + "</td>";

            this.aoColumns.push({"sWidth": "1%", "bSortable": false});
        }
        theadTemplate += "<th>Total Count</th><th>Availability</th></tr>";
        tfootTemplate += "<td>Total Count</td><td>Availability</td></tr>";
        //this.tbodyTemplate += "</tr>";
        this.aoColumns.push({"sWidth": "5%"});
        this.aoColumns.push({"sWidth": "5%"});
            
        $( "#reporting thead" ).html(theadTemplate);
        $( "#reporting tfoot" ).html(tfootTemplate);
    },
    parsing:function(json){       
        if(json.data.length>0){
            
            this.creaTemplate(json.ref);

            var rowTemplate = "<tr><td>${request}</td><td>${team}</td><td>${name}</td>"+Reporting.tbodyTemplate+"<td>${count}</td><td>${availability}</td></tr>";
            $.template( "row", rowTemplate );
            $( "#reporting tbody" ).html( $.tmpl("row", json.data ) );

            $('#reporting').dataTable({
                "sScrollY": 200,
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "bAutoWidth": false,
                "aoColumns": Reporting.aoColumns
            });

        }
    }
};