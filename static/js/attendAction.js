
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let attendanceData = []
let DataURL = {time_sheets:"/timesheet/",leave_requests:"/manage/request/"}
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
            })
    } catch (error) {
        showAlertMessage("warning", "API error", error)
    }

    if (ID)
        UserID = ID
}


function renderCalendar(calType="") {
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
        let modalData = {time_sheets:[],leave_requests:[]};
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

                if (approvedLeave && approvedLeave.total === 0.5 && workedHours) {
                        note = `${workedHours}h / Half`;
                        bgColor = calType === "leave" ? 'bg-green-400' : 'bg-yellow-400';
                        modalData[approvedLeave.module_type].push(approvedLeave.module_id);
                    }

            if(calType === "leave" || calType === ""){                
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
                        bgColor = calType === "leave" ? 'bg-green-400' :'bg-red-400';
                        modalData[approvedLeave.module_type].push(approvedLeave.module_id);
                    } else if(approvedLeave.total != 0.5) {
                        note = `Leave`;
                        bgColor = calType === "leave" ? 'bg-green-400' : 'bg-red-400';
                        modalData[approvedLeave.module_type].push(approvedLeave.module_id);
                    }
                }

                if (futureLeave) {
                    note = futureLeave.status === 0 ? 'Pending Leave' : 'Rejected Leave';
                    bgColor = calType === "leave" ? futureLeave.status === 0 ? 'bg-yellow-400' : 'bg-red-400' : 'bg-gray-400';
                    modalData[futureLeave.module_type].push(futureLeave.module_id);
                }
            }
        }
        const modalPayload = encodeURIComponent(JSON.stringify(modalData));

        calendar.append(`
            <div onclick="fetchData('${dateStr}','${modalPayload}')"
                class="max-w-28 min-h-16 p-3 grid grid-cols-2 overflow-x-auto ${bgColor} rounded cursor-pointer text-white font-medium hover:opacity-90 relative">
                <div class="flex items-end w-fit">${note}</div>
                <div class="flex justify-end">${day}</div>
            </div>`);
    }
    
    if(calType){
        CalType = calType
        if(calType === "timesheet"){
            $("#colour-details #red").hide()
            $("#colour-details #green span").text("Worked")
            $("#colour-details #yellow span").text("Half Day / Permission")
        }
        else if(calType === "leave"){
            $("#colour-details .colours").show()
            $("#colour-details #green span").text("Approved")
            $("#colour-details #red span").text("Rejected")
            $("#colour-details #yellow span").text("Pending")
        }
    }
    else{
        CalType = ''
        $("#colour-details .colours").show()
        $("#colour-details #green span").text("Worked")
        $("#colour-details #yellow span").text("Half Day / Permission")
        $("#colour-details #red span").text("Leave")
    }
}

// function renderCalendar(calType="") {
//     const calendar = $("#calendar-grid");
//     calendar.empty();

//     const label = $("#monthYearLabel");
//     const monthName = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" });
//     label.text(`Attendance - ${monthName} ${currentYear}`);

//     const firstDay = new Date(currentYear, currentMonth, 1).getDay();
//     const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

//     for (let i = 0; i < firstDay; i++) {
//         calendar.append(`<div></div>`);
//     }

//     for (let day = 1; day <= totalDays; day++) {
//         const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//         let bgColor = 'bg-gray-300', note = 'Nil';
//         let modalData = [];
//         if (attendanceData != null) {
//             const dayEntries = attendanceData.filter(i => i.date === dateStr);
            
//                 const timesheets = dayEntries.filter(i => i.module_type === "time_sheets");
//                 const workedHours = timesheets.reduce((sum, entry) => sum + (entry.total || 0), 0);
//                 if (workedHours && calType != "leave") {
//                     note = `${workedHours}h`;
//                     bgColor = `bg-green-400`
//                     modalData.push(...timesheets.map(e => ({
//                         module: 'Time Sheet',
//                         type: e.type,
//                         desc: e.description,
//                         hours: e.total
//                     })));
//                 }
            
//                 const leaves = dayEntries.filter(i => i.module_type === "leave_requests");
//                 const approvedLeave = leaves.find(l => l.status === 3);

//                 if (approvedLeave && approvedLeave.total === 0.5 && workedHours) {
//                         note = `${workedHours}h / Half`;
//                         bgColor = 'bg-yellow-400';
//                         modalData.push({
//                             module: 'Leave',
//                             type: 'Half Day',
//                             desc: approvedLeave.description,
//                             hours: '4 permission'
//                         });
//                     }

//             if(calType === "leave" || calType === ""){                
//                 // Approved leave'
                
//                     const futureLeave = leaves.find(l => {
//                         const leaveDate = new Date(l.date);
//                         if (calType === "")
//                             return l.status !== 3 && leaveDate > new Date();
//                         else if (calType === "leave")
//                             return l.status !== 3
//                     });

//                 if (approvedLeave) {
//                     if (approvedLeave.total === 0.5 && !workedHours) {
//                         note = `Leave`;
//                         bgColor = calType === "leave" ? 'bg-green-400' :'bg-red-400';
//                         modalData.push({
//                             module: 'Leave',
//                             type: 'Half Day',
//                             desc: approvedLeave.description,
//                             hours: '4 permission' //approvedLeave.total
//                         });
//                     } else {
//                         note = `Leave`;
//                         bgColor = calType === "leave" ? 'bg-green-400' : 'bg-red-400';
//                         modalData.push({
//                             module: 'Leave',
//                             type: 'Full Day',
//                             desc: approvedLeave.description,
//                             hours: '9 permission' //approvedLeave.total
//                         });
//                     }
//                 }

//                 if (futureLeave) {
//                     note = futureLeave.status === 0 ? 'Pending Leave' : 'Rejected Leave';
//                     bgColor = calType === "leave" ? futureLeave.status === 0 ? 'bg-yellow-400' : 'bg-red-400' : 'bg-gray-400';
//                     modalData.push({
//                         module: 'Leave',
//                         type: futureLeave.status === 0 ? 'Pending' : 'Rejected',
//                         desc: futureLeave.description,
//                         hours: futureLeave.total + "day"
//                     });
//                 }
//             }
//         }
//         const modalPayload = encodeURIComponent(JSON.stringify(modalData));

//         calendar.append(`
//             <div onclick="showModal('${dateStr}', '${modalPayload}')"
//                 class="max-w-28 min-h-16 p-3 grid grid-cols-2 overflow-x-auto ${bgColor} rounded cursor-pointer text-white font-medium hover:opacity-90 relative">
//                 <div class="flex items-end w-fit">${note}</div>
//                 <div class="flex justify-end">${day}</div>
//             </div>`);
//     }
    
//     if(calType){
//         CalType = calType
//         if(calType === "timesheet"){
//             $("#colour-details #red").hide()
//             $("#colour-details #green span").text("Worked")
//             $("#colour-details #yellow span").text("Half Day / Permission")
//         }
//         else if(calType === "leave"){
//             $("#colour-details .colours").show()
//             $("#colour-details #green span").text("Approved")
//             $("#colour-details #red span").text("Rejected")
//             $("#colour-details #yellow span").text("Pending")
//         }
//     }
//     else{
//         CalType = ''
//         $("#colour-details .colours").show()
//         $("#colour-details #green span").text("Worked")
//         $("#colour-details #yellow span").text("Half Day / Permission")
//         $("#colour-details #red span").text("Leave")
//     }
// }


function showModal(date, Data) {
    const dataList = Data;
    $("#modalDate").text(`Date: ${date}`);

    let html = "";
    dataList.forEach((entry, index) => {
        html += `
        ${entry.table_name == "time_sheets" ? 
        `<div class="mb-2">
            <h3 class="font-semibold">${index + 1}. Time Sheet</h3>
            <p>Type: <span class="text-blue-600">${entry.sheet_type}</span></p>
            <p>Hours: ${entry.total_hours}</p>
            <p>Description: ${entry.description}</p>
        </div>` :
        `<div class="mb-2">
            <h3 class="font-semibold">${index + 1}. Leave Request</h3>
            <p>Type: <span class="text-blue-600">${entry.module.leave_unit}</span></p>
            <p>Totat Days: ${entry.module.total_days}</p>
            <p>Description: ${entry.module.description}</p>
        </div>`
        }
        `;
    });

    $("#modalDescrition").html(html);

    const modal = document.getElementById('attendanceModal');
    const panel = document.getElementById('modalPanel');

    modal.classList.remove('hidden');

    // Slide-in from right
    setTimeout(() => {
        panel.classList.remove('translate-x-full');
    }, 10);
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

async function fetchData(date, encodedData){
    let dataSet = JSON.parse(decodeURIComponent(encodedData));
    let datas = []
    if(dataSet["time_sheets"]?.length){
        for(let i = 0; i<dataSet["time_sheets"].length; i++){
            let res = await APICall("time_sheets",dataSet["time_sheets"][i])
            if(res){
                res["table_name"] = "time_sheets"
                datas.push(res)
            }
        }
    }
    if(dataSet["leave_requests"]?.length){
        for(let i = 0; i<dataSet["leave_requests"].length; i++){
            let res = await APICall("leave_requests",dataSet["leave_requests"][i])
            if(res){
                res["table_name"] = "leave_requests"
                datas.push(res)
            }
        }
    }
    // console.log(datas)
    showModal(date,datas)
}

async function APICall(moduleType,ID){
    try {
        let res = await fetch(`${DomainURL}${DataURL[moduleType]}${ID}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`
            },
        })
        if(!res.ok){
            showAlertMessage("warning", "API error", `${res.status} ${res.statusText}`)
            return
        }

        let data = await res.json()
        if(data.status){
            return moduleType === "time_sheets" ? data.timesheet : data.request
        }else{
            showAlertMessage("error", "Time sheet", data.message)
        }
    } catch (error) {
        showAlertMessage("warning", "API error", error)
    }

    return
}
