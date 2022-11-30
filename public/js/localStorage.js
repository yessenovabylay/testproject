
(()=>{
    if( !document.getElementById("name")) return
    const getuser = JSON.parse(localStorage.getItem("user"));
    document.getElementById("name").innerHTML = `getuser.firstName + " " + getuser.lastName;`
    console.log(13312312321312)
    
})()