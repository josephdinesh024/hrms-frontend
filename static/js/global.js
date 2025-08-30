async function AccessCheck() {
    try {
        ProgressLoading(true)
        fetch(`${DomainURL}/my/access`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`
            },
        }).then(res => res.ok ? res.json() : showAlertMessage("warning", "API error", `${res.status} ${res.statusText}`))
            .then(data => {
                if (data.status) {
                    $.cookie("my_access", JSON.stringify(data.access))
                    $.cookie("my_status", data.my_status)
                    $("#sidebar").load("sidebar.html")
                    if ([0, 5, 6].includes(data.my_status) && !window.location.pathname.split("/").pop().includes("onboard.html"))
                        window.location.href = "onboard.html"
                } else {
                    $.removeCookie("access_token")
                    window.location.reload()
                }
                ProgressLoading(false)
            })
    } catch (error) {
        ProgressLoading(false)
        showAlertMessage("warning", "API error", error)
    }
    setTimeout(() => { AccessCheck() }, 50000)
    setTimeout(() => { NotificationModule() }, 500)
}

setTimeout(() => {
    $(document).ready(function () {
        $("#header").load("header.html")
        AccessCheck()
    });
}, 100)


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
    });
});

// Search

$(document).on("input", "input#search", function () {
    document.getElementById("searchresult").innerHTML = ''
    var query = $(this).val()
    try {
        ProgressLoading(true)
        fetch(`${DomainURL}/search?q=${query}`, {
            // headers: {
            //     "Content-Type": "application/json",
            //     Authorization: `Bearer ${access_token}`
            // },
            method: "GET"
        })
            .then(res => res.ok ? res.json() : showAlertMessage("warning", "API error", `${res.status} ${res.statusText}`))
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
                                    ${StatusColourCode(element.status)}
                                </td>
                            </tr>
                    `)
                    })
                }
            });
    } catch (error) {
        ProgressLoading(false)
        showAlertMessage("warning", "API error", error)
    }
})

// logout
$(function () {
    $(document).on("click", "button#logoutbutton", function () {
        $.removeCookie("access_token")
        $.removeCookie("my_access")
        $.removeCookie("my_status")
        $.removeCookie("user_name")
        window.location.reload()
    })
})


const navURL = {
    "travel": "travel-request.html",
    "expense": "travel-request.html",
    "leave": "leave-request.html",
}

function NotificationModule() {
    let notif = $("#header #notification")
    notif.find("#request-list").html(`
                   <span class="text-center text-textPrimary font-medium py-4">No notification</span>
        `)

    try {
        ProgressLoading(true)
        fetch(`${DomainURL}/notification`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`
            },
        }).then(res => res.ok ? res.json() : showAlertMessage("warning", "API error", `${res.status} ${res.statusText}`))
            .then(data => {
                if (data.status) {
                    // console.log(data)
                    if (data?.notification?.requests) {
                        notif.find("#request-list").empty()
                        data?.notification?.requests.forEach(element => {
                            notif.find("#request-list").append(`
                                <a href="${navURL[element["module_type"]]}?request_id=${element["request_id"]}" class="w-full bg-gradient-to-r from-primary via-purple-600 to-blue-800 bg-clip-text hover:text-transparent p-2 hover:shadow-md">
                                    <h6 class="font-medium px-2">${capitalizeFirstLetter(element["user_name"])}</h6>
                                    <h6 class="text-textPrimary text-sm w-full py-1 px-4" >${capitalizeFirstLetter(element["message"])}</h6>
                                </a>
                                <hr>
                            `)
                        });

                        if (data.notification.viewed) {
                            notif.find("#notification-count").show()
                            notif.find("#notification-count").text(data.notification.requests.length)
                            notif.find("i").toggleClass("fa-regular fa-solid")
                            notif.click(function () { NotificationViewed(data.notification.id, false) })
                        } else {
                            notif.find("#notification-count").hide()
                        }
                    }
                } else {
                    showAlertMessage("warning", "Notification", data.message)
                }
                ProgressLoading(false)
            })
    } catch (error) {
        ProgressLoading(false)
        showAlertMessage("warning", "API error", error)
    }
}

function NotificationViewed(ID, status) {

    try {
        ProgressLoading(true)
        fetch(`${DomainURL}/notification/${ID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`
            },
            body: JSON.stringify({
                "viewed": status  // true or false
            })
        }).then(res => res.ok ? res.json() : showAlertMessage("warning", "API error", `${res.status} ${res.statusText}`))
            .then(data => {
                if (data.status == 0) {
                    showAlertMessage("warning", "Notification", data.message)
                }
                ProgressLoading(false)
            })
    } catch (error) {
        ProgressLoading(false)
        showAlertMessage("warning", "API error", error)
    }
}
