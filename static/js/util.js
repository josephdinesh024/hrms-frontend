// First litter cap
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// URL Params
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// Edit panels
function editPanelOpen() {
    $("#editPanel").removeClass("translate-x-full")
    $("main").addClass("w-[65%]")
    $("#editPanel #teamDetailCard #errorMessage").text("")
}

function closePanel() {
    $("#editPanel").addClass("translate-x-full")
    $("main").removeClass("w-[65%]")
}

// Close panel
$(document).on("click", "#closePanel", function () {
    closePanel()
})

const statusNames = {0:"Pending",1:"Active",2:"Inactive",3:"Approved",4:"Rejected",5:"Verification",6:"Correction",7:"Suspended"}

function StatusColourCode(status){
    switch(status){
        case 0:
            return `<span class="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">${statusNames[status]}</span>`
        case 1:
            return `<span class="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">${statusNames[status]}</span>`
        case 2:
            return `<span class="inline-block px-2 py-1 text-xs bg-red-100 text-white rounded">${statusNames[status]}</span>`
        case 3:
            return `<span class="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">${statusNames[status]}</span>`
        case 4:
            return `<span class="inline-block px-2 py-1 text-xs bg-red-100 text-white rounded">${statusNames[status]}</span>`
        case 5:
            return `<span class="inline-block px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">${statusNames[status]}</span>`
        case 6:
            return `<span class="inline-block px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">${statusNames[status]}</span>`
        case 7:
            return `<span class="inline-block px-2 py-1 text-xs bg-red-100 text-white rounded">${statusNames[status]}</span>`
        default:
            return `<span class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Error status</span>`
        
    }                        
}


async function FilePreviewURL(url,preview=true) {
    const newURL = DomainURL + url;
    const response = await fetch(newURL);

    if (!response.ok) {
        console.error("Failed to fetch file");
        return;
    }

    const blob = await response.blob();
    const fileURL = URL.createObjectURL(blob);
    if(preview)
        window.open(fileURL, '_blank');
    else
        return fileURL
}

async function FileDownload(url) {
    const newURL = DomainURL + url;
    const response = await fetch(newURL,{method:"GET",headers:{
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access_token}`
                    }});

    if (!response.ok) {
        console.error("Failed to fetch file");
        return;
    }

    const blob = await response.blob();
    const fileURL = URL.createObjectURL(blob);

    window.open(fileURL, '_blank');
}

// Input Tag
function floatingInputTag(type,id,name,labelName,value="",required=true,disabled=false){
    let InputTag = `
    <div class="relative mt-6 floating-label">
        <input
            type="${type}"
            id="${id}"
            class="peer w-full border-b-2 border-gray-300 bg-transparent text-sm pt-4 pb-1 focus:outline-none focus:border-blue-500"
            name="${name}"
            placeholder=" "
            value="${value}"
            ${required ? "required" : ""}
            ${disabled ? "disabled" : ""}
        />
        <label
            for="${id}"
            class="absolute left-0 text-gray-500 text-sm transition-all duration-200 ${type=="date"? "peer-[:not(:focus)]:-bottom-8 peer-[:focus]:bottom-8 peer-[:valid]:bottom-8"  :"" }"
        >
            ${labelName} ${required ? "*" : ""}
        </label>
    </div>
    `

    setTimeout(()=>{$(document).ready(function () {
        $(".floating-label input").each(function () {
            toggleLabel($(this));
        });

        $(".floating-label input").on("input blur", function () {
            toggleLabel($(this));
        });

    });},300)

    return InputTag
}

function SelectionTag(id,name,labelName,value,required=true,options=[]){
    let selectTag = `
        <div class="mt-5">
            <label class="w-full text-sm text-blue-500">${labelName}</label>
            <select class="w-full border-b-2 border-gray-300 bg-transparent text-sm focus:outline-none focus:border-blue-500"
                id="${id}" name="${name}"
                ${required ? "required" : ""} >
                <option>--</option>
                ${options.map(opt =>{
                    return `<option ${value == opt ? 'selected':""}
                                value="${opt}">
                                ${capitalizeFirstLetter(opt)}
                            </option>`
                }).join("")}
            </select>
        </div>
    `
    // console.log(selectTag)
    return selectTag
}

function toggleLabel($input) {
    if ($input.val()) {
      $input.addClass("not-empty");
    } else {
      $input.removeClass("not-empty");
    }
  }

// File Input Tag
function floatingFileInputTag(id, name, labelName, fileName="", required = true) {
    const InputTag = `
    <div class="relative mt-6 w-64 floating-label-file">
        <input
            type="file"
            id="${id}"
            name="${name}"
            class="absolute inset-0 opacity-0 z-10 cursor-pointer"
            ${required ? "required" : ""}
        />
        <div
            class="border-b-2 border-gray-300 bg-transparent text-sm pt-4 pb-1 w-full cursor-pointer file-display peer"
        >
            <span id="${id}_filename" class="text-gray-900 text-sm">${fileName}</span>
        </div>
        <label
            for="${id}"
            class="absolute left-0 text-sm transition-all duration-200 ${fileName != ""? "text-blue-500":"text-gray-500"}"
        >
            ${labelName} ${required ? "*" : ""}
        </label>
    </div>
    `;

    // Run script after DOM insert
    setTimeout(() => {
        $(document).ready(function () {
            const $input = $(`#${id}`);
            const $label = $(`label[for="${id}"]`);
            const $filename = $(`#${id}_filename`);

            function toggleLabelFile() {
                const hasFile = $input[0].files.length > 0;
                if (hasFile) {
                    $filename.text($input[0].files[0].name);
                    $label.addClass("text-blue-500 text-xs").css("top", "-16px");
                } else {
                    $filename.text(fileName);
                    $label.removeClass(`${fileName == ""? "text-blue-500" : ""} text-xs`).css("top", "-4px");
                }
            }

            toggleLabelFile(); // Initial state
            $input.on("change blur", toggleLabelFile);
        });
    }, 300);

    return InputTag;
}



// FILE UPLOAD

async function uploadFileData(ID,form,message) {
    let flag = true
    let resp = null
    try {
        let response = await fetch(`${DomainURL}/my/file${ID != "0" ? "/" + ID : ""}`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            method: ID != 0 ? "PUT" : "POST",
            body: form
        });
        if (!response.ok){
            showAlertMessage("warning", "API error", `${response.status} ${response.statusText}`)
            return {flag:false,resp}
        }
        let data = await response.json()
        if (data.status) {
            resp = data.file
            showAlertMessage("success", "Employee profile", message || "File document upload successfully")
        } else {
            showAlertMessage("error", "Employee profile", data.message)
            flag = false
        }
    } catch (error) {
        showAlertMessage("warning", "API error", error)
        flag = false
    }

    return {flag,resp}
}