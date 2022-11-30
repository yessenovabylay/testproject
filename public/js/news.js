
(()=>{ function newsList(){
    $.ajax({
        url: "/api/news", 
        type: "GET",
        dataType: 'json',
        success: function(res) {
            console.log(res);
            alert(res);
        }
    });
}
})



// $.ajax({
//         url: "https://app.asana.com/-/api/0.1/workspaces/",
//         type: 'GET',
//         dataType: 'json', // added data type
//         success: function(res) {
//             console.log(res);
//             alert(res);
//         }
//     });

// title       String       @db.VarChar(100)
//   short_title String       @db.VarChar(30)
//   description String       @db.VarChar(1000)
//   created_at  DateTime

// $("button").click(function(){
//     $.get("demo_test.asp", function(data, status){
//       alert("Data: " + data + "\nStatus: " + status);
//     });
//   });