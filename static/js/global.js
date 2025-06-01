const access_token = $.cookie("access_token");
if (!access_token)
        window.location.href = '/frontend/login.html'

const scripts = [
    
    "./static/js/confic.js",
    "./static/js/util.js"
];

scripts.forEach(src => loadScript(src));

const styles = [
    "./static/css/floatinput.css"
];

styles.forEach(href => loadCSS(href));

async function AccessCheck(){
    try {
        fetch(`${DomainURL}/my/access`,{
            method : "GET",
            headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access_token}`
                    },
        }).then(res => res.json())
        .then(data =>{
            if(data.status){
                $.cookie("my_access",JSON.stringify(data.access)) 
                $.cookie("my_status",data.my_status) 
                if(["pending","onboard"].includes(data.my_status) && !window.location.pathname.split("/").pop().includes("onboard.html"))
                    window.location.href = "onboard.html"
            }else{
                $.removeCookie("access_token")
                window.location.reload()
            }
        })
    } catch (error) {
        showAlertMessage("warning","API error", error)
    }
    setTimeout(()=>{AccessCheck()},50000)
}

setTimeout(()=>{AccessCheck()},500)


$("#sidebar").load("sidebar.html")
$("#header").load("header.html")


const userName = $.cookie("user_name");
setTimeout(() => {
    if (userName)
        $("#profilelogo").append(`<h1 class="text-md font-semibold">${userName}</h1>`)
}, 300)

$(document).ready(function () {
    $("input#search").focus(function () {
        $("#searchresult").fadeIn(1000)
    }).blur(function () {
        $("#searchresult").fadeOut(1000)
        if ($("input#search").val() == "")
            document.getElementById("searchresult").innerHTML = ''
    })
})

// Search

$(document).on("input", "input#search", function () {
    document.getElementById("searchresult").innerHTML = ''
    var query = $(this).val()
    try {
       fetch(`${DomainURL}/search?q=${query}`, {
        // headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${access_token}`
        // },
        method: "GET"
    })
        .then(res => res.json())
        .then(data => {
            if (data.status) {
                data.data.forEach(element => {
                    $("#searchresult").append(`
                        <tr class="border-b bg-gray-200 hover:bg-gray-50 transition">
                                <td class="p-4">${element.user.user_name}</td>
                                <td class="p-4">${element.user.email}</td>
                                <td class="p-4">${capitalizeFirstLetter(element.first_name)} ${element.last_name}</td>
                                <td class="p-4">${capitalizeFirstLetter(element.user.role.name) || "--"}</td>
                                <td class="p-4">
                                    ${element.user.status === "active" ? `<span class="px-2 py-1 text-xs font-bold text-yellow-700 bg-yellow-100 rounded-md">Active</span>` :
                            element.user.status === "block" ? `<span class="block w-max px-3 py-1 text-xs font-bold text-white bg-red-600 rounded-md"> Blocked </span>` : ""}
                                </td>
                            </tr>
                    `)
                })
            }
        }); 
    } catch (error) {
        showAlertMessage("warning","API error", error)
    }
})

// logout
$(function () {
    var popprofile = false
    // $("div").on("click",function(){
    //     if (popprofile)
    //         popprofile = false
    //     console.log("function click",popprofile)
    // })
    $(document).on("click", "#profilelogo", function (e) {
        popprofile = !popprofile
        popprofile ? $("#popuprofile").removeClass('hidden') : $("#popuprofile").addClass('hidden')
    })
    $(document).on("click", "button#logoutbutton", function () {
        $.removeCookie("access_token")
        $.removeCookie("my_access") 
        $.removeCookie("my_status") 
        $.removeCookie("user_name") 
        window.location.reload()
    })
})


// SideBar
$(document).ready(function () {

    $("#sidebar").mouseover(function () {
        $("#sidebar .baricon").each(function () {
            $(this).removeClass("hidden")
        })
    })
    $("#sidebar").mouseleave(function () {
        $("#sidebar .baricon").each(function () {
            $(this).addClass("hidden")
        })
    })

    $(document).on("click", "#sidebar .baricon", function () {
        if ($(this).attr("index") === "open") {
            $("#sidebar #fullsidebar").removeClass("hidden")
            $("#sidebar #minisidebar").addClass("hidden")
            $("#sidebar").width("180px")
        }
        else {
            $("#sidebar #minisidebar").removeClass("hidden")
            $("#sidebar #fullsidebar").addClass("hidden")
            $("#sidebar").width("64px")
        }
    })
})


function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    script.onload = () => {
        // console.log(`${src} loaded.`);
        if (callback) callback();
    };

    script.onerror = () => console.error(`Failed to load ${src}`);

    document.head.appendChild(script);
}


function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;

    // link.onload = () => console.log(`CSS loaded.`);
    link.onerror = () => console.error(`Failed to load CSS: ${href}`);

    document.head.appendChild(link);
}


function showAlertMessage(type, title, message, autoClose = true, duration = 5000) {
    const id = `AlertMessage-${Date.now()}`;

    const config = {
      success: {
        icon: "✅",
        bg: "bg-green-100",
        border: "border-l-4 border-green-600",
        text: "text-green-900"
      },
      error: {
        icon: "❌",
        bg: "bg-red-100",
        border: "border-l-4 border-red-600",
        text: "text-red-900"
      },
      warning: {
        icon: "⚠️",
        bg: "bg-yellow-100",
        border: "border-l-4 border-yellow-600",
        text: "text-yellow-900"
      },
      info: {
        icon: "ℹ️",
        bg: "bg-blue-100",
        border: "border-l-4 border-blue-600",
        text: "text-blue-900"
      }
    };

    const toast = `
      <div id="${id}" class="${config[type].bg} ${config[type].border} ${config[type].text} rounded shadow-md px-4 py-3 flex items-start gap-3 animate-fade-in">
        <div class="text-lg mt-0.5">${config[type].icon}</div>
        <div class="flex-1">
          <strong class="font-semibold">${title}</strong>
          <div class="text-sm mt-1">${message}</div>
        </div>
        <button onclick="$('#${id}').remove()" class="text-xl font-bold leading-none hover:text-gray-700">&times;</button>
      </div>
    `;

    $('#AlertMessageContainer').append(toast);

    if (autoClose) {
      setTimeout(() => {
        $(`#${id}`).fadeOut(700, function() {
          $(this).remove();
        });
      }, duration);
    }
  }
