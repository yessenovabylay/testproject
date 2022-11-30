


function registration(e){
    e.preventDefault()
    const firstName = $("[name=firstName]").val()
    const lastName = $("[name=lastName]").val()
    const fatherName = $("[name=fatherName]").val()
    const phoneNumber = $("[name=phoneNumber]").val()
    const password = $("[name=password]").val()
    const IIN = $("[name=IIN]").val()
    console.log(firstName)
    $.ajax({url: "/api/user/registration", 
        type: "POST",
        data: {
            firstName, lastName, fatherName, phoneNumber, password, IIN
        },
        error: function(xhr,status,error){
            alert(error)
        },
        
        success: function(result){
            localStorage.setItem('token', result.data.token)
            localStorage.setItem('user', JSON.stringify(result.data.user))
            document.location = '/home'
         }
    });
};

function login(e){
    e.preventDefault()
    const phoneNumber = $("[name=phoneNumber]").val()
    const password = $("[name=password]").val()
    $.ajax({url: "/api/user/login", 
    type: "POST",
    data: {
        phoneNumber, password
    },
    error: function(xhr,status,error){
        alert(error)
    },
    
    success: function(result){
        localStorage.setItem('token', result.data.token)
        localStorage.setItem('user', JSON.stringify(result.data.user))

        document.location = '/home'
     }
});
}


function verify(e){
    e.preventDefault()
    const first1 = $("[name=first1]").val()
    const second2 = $("[name=second2]").val()
    const three3 = $("[name=three3]").val()
    const four4 = $("[name=four4]").val()

    const code = first1+second2+three3+four4;
    console.log(code)
    $.ajax({url: "/api/user/verification/number", 
    type: "POST",
    headers: {
        'Authorization': localStorage.getItem('token')
    },
    data: {
        code: code 
    },
    error: function(xhr,status,error){
        alert(error)
    },
    
    success: function(result){
        alert(result)
        document.location = '/home'
     }
});
}

(()=> {
    if(['/login', '/registration', '/home'].includes(document.location.pathname)) return
    $.ajax({url: "/api/user/check", 
        type: "POST",
        headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type':'application/json'
        },
        error: function(xhr,status,error){
            document.location = '/login'
        }
    });
})()