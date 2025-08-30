
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let attendanceData = []
let DataURL = { time_sheets: "/timesheet/", leave_requests: "/manage/request/", travel_requests: "/manage/request/" }
let UserID = ''
let CalType = ''

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    // renderCalendar();
    initAttendFun(UserID, new Date(currentYear, currentMonth, 1).toLocaleDateString("fr-BE"), new Date(currentYear, currentMonth + 1, 0).toLocaleDateString("fr-BE"))
}

function initAttendFun(ID, stDate = '', eDate = '') {
    try {
        ProgressLoading(true)
        fetch(`${DomainURL}/timesheet/attendance?${ID ? "user_id=" + ID + "&" : ""}start_date=${stDate}&end_date=${eDate}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`
            },
        }).then(res => res.ok ? res.json() : showAlertMessage("warning", "API error", `${res.status} ${res.statusText}`))
            .then(data => {
                if (data.status) {
                    attendanceData = data.data
                    // console.log(attendanceData)

                    renderCalendar(CalType)
                } else {
                    showAlertMessage("error", "Onboard", "Error to fetch details. " + data?.message)
                }
                ProgressLoading(false)
            })
    } catch (error) {
        ProgressLoading(false)
        showAlertMessage("warning", "API error", error)
    }

    if (ID)
        UserID = ID
}


function renderCalendar(calType = "") {
    const calendar = $("#calendar-grid");
    calendar.empty();

    const label = $("#monthYearLabel");
    const monthName = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" });
    label.text(`Attendance - ${monthName} ${currentYear}`);

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calendar.append(`<div></div>`);
    }

    for (let day = 1; day <= totalDays; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        let bgColor = 'bg-gray-300', note = 'Nil';
        let modalData = { time_sheets: [], leave_requests: [], travel_requests: [] };
        if (attendanceData != null) {
            const dayEntries = attendanceData.filter(i => i.date === dateStr);

            const timesheets = dayEntries.filter(i => i.module_type === "time_sheets");
            const workedHours = timesheets.reduce((sum, entry) => sum + (entry.total || 0), 0);
            if (workedHours && calType != "leave") {
                note = `${workedHours}h`;
                bgColor = `bg-green-400`
                timesheets.forEach(e => modalData[e.module_type].push(e.module_id));
            }

            const leaves = dayEntries.filter(i => i.module_type === "leave_requests");
            const approvedLeave = leaves.find(l => l.status === 3);
            const approvedTravel = dayEntries.find(i => i.module_type === "travel_requests" && i.status === 3);

            if (approvedLeave && approvedLeave.total === 0.5 && workedHours) {
                note = `${workedHours}h / Half`;
                bgColor = calType === "leave" ? 'bg-green-400' : 'bg-yellow-400';
                modalData[approvedLeave.module_type].push(approvedLeave.module_id);
            }

            if (calType === "leave" || calType === "") {
                // Approved leave'

                const futureLeave = leaves.find(l => {
                    const leaveDate = new Date(l.date);
                    if (calType === "")
                        return l.status !== 3 && leaveDate > new Date();
                    else if (calType === "leave")
                        return l.status !== 3
                });

                if (approvedLeave) {
                    if (approvedLeave.total === 0.5 && !workedHours) {
                        note = `Leave`;
                        bgColor = calType === "leave" ? 'bg-green-400' : 'bg-red-400';
                        modalData[approvedLeave.module_type].push(approvedLeave.module_id);
                    } else if (approvedLeave.total != 0.5) {
                        note = `Leave`;
                        bgColor = calType === "leave" ? 'bg-green-400' : 'bg-red-400';
                        modalData[approvedLeave.module_type].push(approvedLeave.module_id);
                    }
                }

                if (approvedTravel) {

                    note = `Travel`;
                    bgColor = calType === "leave" ? 'bg-green-400' : 'bg-red-400';
                    modalData[approvedTravel.module_type].push(approvedTravel.module_id);
                }

                if (futureLeave) {
                    note = futureLeave.status === 0 ? 'Pending Leave' : 'Rejected Leave';
                    bgColor = calType === "leave" ? futureLeave.status === 0 ? 'bg-yellow-400' : 'bg-red-400' : 'bg-gray-400';
                    modalData[futureLeave.module_type].push(futureLeave.module_id);
                }
            }
        }
        const modalPayload = encodeURIComponent(JSON.stringify(modalData));
        let dates = new Date(dateStr).toDateString().split(" ")[0]
        calendar.append(`
            <div class="group relative ${new Date().getDate() == day ? "border-2 border-dashed border-blue-500" : ""} p-1">
                <div onclick="fetchData('${dateStr}','${modalPayload}')"
                    class="p-6 rounded cursor-pointer text-white font-medium hover:opacity-90 
                        ${dates == "Sun" ? note == "Nil" ? 'bg-violet-400' : bgColor + ' border-2 border-violet-400' : bgColor}
                        ">
                    <div>${day}</div>
                </div>
                <div class="absolute top-1/2 left-2/3 z-40 bg-white rounded-lg p-3 shadow-md border hidden group-hover:block">${note}</div>
            </div>`);
    }

    if (calType) {
        CalType = calType
        if (calType === "timesheet") {
            $("#colour-details #red").hide()
            $("#colour-details #green span").text("Worked")
            $("#colour-details #yellow span").text("Half Day / Permission")
        }
        else if (calType === "leave") {
            $("#colour-details .colours").show()
            $("#colour-details #green span").text("Approved")
            $("#colour-details #red span").text("Rejected")
            $("#colour-details #yellow span").text("Pending")
        }
    }
    else {
        CalType = ''
        $("#colour-details .colours").show()
        $("#colour-details #green span").text("Worked")
        $("#colour-details #yellow span").text("Half Day / Permission")
        $("#colour-details #red span").text("Leave")
    }
}

let URLs = window.location.href.split("/").pop()
function showModal(date, Data) {
    const dataList = Data;
    $("#modalDate").text(`Date: ${date}`);
    let html = "";
    let entrys = { time: false, leave: false }
    let now = new Date()
    let dnow = now.getDate()
    let etDate = new Date(date)
    let detDate = etDate.getDate()
    if(dnow == detDate || dnow -1 == detDate || dnow +1 == detDate && etDate.getDay())
        entrys.time = true
    if(detDate > dnow && etDate.getDay())
        entrys.leave = true
    dataList.forEach((entry, index) => {

        if (entry.table_name == "time_sheets") {
            html += `
        <div>
            <h3 class="font-bold text-gray-700 mb-2">Time Sheet</h3>
            <div class="text-sm space-y-1 text-gray-700 px-2">
                <div><strong>Start Time:</strong> ${formatTime(entry.start_time)}</div>
                <div><strong>End Time:</strong> ${formatTime(entry.end_time)} </div>
                <div><strong>Total Hours:</strong> ${entry.total_hours} </div>
                ${entry?.module_id
                    ? `<div><strong>Worked On:</strong> 
                        <div class="mx-2 text-sm">
                            ${entry?.module_type == "project_tasks"
                        ? `  <h5><strong>Project Name:</strong> ${entry?.module?.project_name}</h5>
                                <h5><strong>Project Task Name:</strong> ${entry?.module?.project_task_name}</h5>
                                <h5><strong>Project Task Progress:</strong> ${entry?.module?.project_task_progress}%</h5>
                            `
                        : `
                                <h5><strong>${capitalizeFirstLetter(entry.module_type)} Name:</strong> ${entry?.module?.name}</h5>
                                <h5><strong>${capitalizeFirstLetter(entry.module_type)} Progress:</strong> ${entry?.module?.progress}%</h5>
                            `}
                        </div> 
                    </div>
                    `
                    : ""
                }
                <div><strong>Description:</strong> ${entry.description} </div>
            </div>
        </div>
        <hr>
        `
        entrys.time = false
        } else if (entry.table_name == "travel_requests") {
            html += `<div>
            <h3 class="font-bold text-gray-700 mt-4 mb-2">Travel Request</h3>
            <div class="text-sm space-y-1 text-gray-700 px-2">
                <div><strong>Leave Dates:</strong> ${leaveDates(entry.module.start_date, entry.module.end_date)} </div>
                <div><strong>Travel Place:</strong>
                     ${entry.module.from_place + " - " + entry?.module?.to_place} </div>
                <div><strong>Travel By:</strong> ${capitalizeFirstLetter(entry.module.transport || "--")} </div>
                <div><strong>Purpose:</strong> ${capitalizeFirstLetter(entry.module.purpose || "--")} </div>
                <div><strong>Assigned Reportee:</strong> ${capitalizeFirstLetter(entry.assigned.user_name)} </div>
                <div><strong>Reviewed By:</strong> ${capitalizeFirstLetter(entry.approved.user_name || "--")} </div>
            </div>
        </div>
        <hr>
        `
        entrys.leave = false
        entrys.time = false
    } else if (entry.table_name == "leave_requests") {
            html += `<div>
            <h3 class="font-bold text-gray-700 mt-4 mb-2">Leave Request</h3>
            <div class="text-sm space-y-1 text-gray-700 px-2">
                <div><strong>Leave Dates:</strong> ${leaveDates(entry.module.start_date, entry.module.end_date)} </div>
                <div><strong>Total Days:</strong>
                     ${entry.module.total_days >= 1 ? entry.module.total_days + " Days" : `Half day ( ${entry.module.leave_unit})`} </div>
                <div><strong>Policy:</strong> ${capitalizeFirstLetter(entry.module.policy?.name || "--")} </div>
                <div><strong>Description:</strong> ${entry.module.description} </div>
                <div><strong>Assigned Reportee:</strong> ${capitalizeFirstLetter(entry.assigned.user_name)} </div>
                <div><strong>Reviewed By:</strong> ${capitalizeFirstLetter(entry.approved.user_name || "--")} </div>
            </div>
        </div>
        <hr>
        `
        entrys.leave = false
        entrys.time = false
    }
    });

    if(URLs == "timesheet.html"){
        if(entrys.time){
            html += `
            <br/>
            <a href="?menu=entry&menu-action=time_sheet">
                <button class="py-2 px-8 shadow-sm shadow-third rounded-lg font-semibold text-third text-xs
                hover:bg-gradient-to-r from-primary from-5% to-blue-800 hover:text-white transition-all duration-500">
                <i class="fa-solid fa-plus"></i> Timesheet
                </button>
            </a>
            <br/>`
        }
        if(entrys.leave){
            html += `
            <br/>
            <a href="?menu=entry&menu-action=leave_request">
                <button class="py-2 px-8 shadow-sm shadow-third rounded-lg font-semibold text-third text-xs
                hover:bg-gradient-to-r from-primary from-5% to-blue-800 hover:text-white transition-all duration-500">
                <i class="fa-solid fa-plus"></i> Leave
                </button>
            </a>`
        }
    }

    $("#modalDescrition").html(html);

    const modal = document.getElementById('attendanceModal');
    const panel = document.getElementById('modalPanel');

    modal.classList.remove('hidden');

    // Slide-in from right
    setTimeout(() => {
        panel.classList.remove('translate-x-full');
    }, 10);
    ProgressLoading(false)
}

function closeModal() {
    const modal = document.getElementById('attendanceModal');
    const panel = document.getElementById('modalPanel');

    // Slide out
    panel.classList.add('translate-x-full');

    // Hide after animation
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 30);
}

async function fetchData(date, encodedData) {
    let dataSet = JSON.parse(decodeURIComponent(encodedData));
    let datas = []
    if (dataSet["time_sheets"]?.length) {
        for (let i = 0; i < dataSet["time_sheets"].length; i++) {
            let res = await APICall("time_sheets", dataSet["time_sheets"][i])
            if (res) {
                res["table_name"] = "time_sheets"
                datas.push(res)
            }
        }
    }
    if (dataSet["leave_requests"]?.length) {
        for (let i = 0; i < dataSet["leave_requests"].length; i++) {
            let res = await APICall("leave_requests", dataSet["leave_requests"][i])
            if (res) {
                res["table_name"] = "leave_requests"
                datas.push(res)
            }
        }
    }
    if (dataSet["travel_requests"]?.length) {
        for (let i = 0; i < dataSet["travel_requests"].length; i++) {
            let res = await APICall("travel_requests", dataSet["travel_requests"][i])
            if (res) {
                res["table_name"] = "travel_requests"
                datas.push(res)
            }
        }
    }
    // console.log(datas)
    showModal(date, datas)
}

async function APICall(moduleType, ID) {
    try {
        ProgressLoading(true)
        let res = await fetch(`${DomainURL}${DataURL[moduleType]}${ID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`
            },
        })
        if (!res.ok) {
            showAlertMessage("warning", "API error", `${res.status} ${res.statusText}`)
            return
        }

        let data = await res.json()
        if (data.status) {
            // console.log(data)
            return moduleType === "time_sheets" ? data.timesheet : data.request
        } else {
            showAlertMessage("error", "Time sheet", data.message)
        }
        ProgressLoading(false)
    } catch (error) {
        ProgressLoading(false)
        showAlertMessage("warning", "API error", error)
    }

    return
}
