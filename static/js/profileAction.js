
async function profileDataExtraction(obj, parentSection) {
    Object.keys(obj).forEach(key => {
        if (obj[key] != "") {
            $(`#content #${parentSection} span#${key}`).text(obj[key])
        }
    })

    let url = `https://ui-avatars.com/api/?name=${obj.first_name}+${obj.last_name}`
    if (obj.id == 0)
        url = `https://ui-avatars.com/api/?name=aes00`
    if (obj.profile_image?.id) {
        url = await FilePreviewURL(obj.profile_image.file_path, false)
    }
    $(`#profile_image img`).prop("src", url)

    $("#employeeFullName").text(`${obj.first_name}  ${obj.last_name}` || "aes000")
}

async function bankDataExtraction(obj, parentSection) {
    Object.keys(obj).forEach(key => {
        if (obj[key] != "") {
            $(`#content #${parentSection} span#${key}`).text(obj[key])
        }
    });
    if (obj.file?.id) {
        // if (["jpg", "jpeg", "png"].includes(obj.file.file_path.split("/").pop().split(".").pop())) {
        //     let url = await FilePreviewURL(obj.file.file_path, false)
        //     $(`#${parentSection} #file_image img`).prop("src", url)
        // } else 
        $(`#${parentSection} #file_image`).html(`<span class="text-sm text-blue-400 cursor-pointer">Preview</span>`)

        $(`#${parentSection} #file_image`).attr("onclick", `FilePreviewURL('${obj.file.file_path}')`)
    }

}

async function certificateDataExtraction(obj, parentSection, checking = false) {
    let result = ""
    if (obj?.length) {
        for (let i = 0; i < obj.length; i++) {
            let item = obj[i]
            if (item.type == "certificate")
                result += `
                        <div class="grid grid-cols-2 py-3 gap-6 items-start">
                            ${!checking ? `
                            <div class="border-b-2 w-3/4">
                                <h4 class="mb-3">Certificate Name</h4>
                                <span id="name" class="text-textPrimary">${item.name || "name"}</span>
                            </div> `: `              
                            <div class="border-b-2 w-3/4">
                                <h4 class="mb-3">Certificate Name</h4>
                                <label>
                                    <input type="checkbox" class="check-field"
                                        data-parent="certificate" data-field="name">
                                    <span id="name" class="text-textPrimary">${item.name || "name"}</span>
                                </label>
                            </div>  `}
                            <div class="w-3/4">
                                <label>
                                    <input type="checkbox" class="check-field" data-parent="certificate" data-field="file">
                                <span class="mb-3">Certifiacte Doc</span>
                                </label>
                                <div id="file_image" class="text-textPrimary cursor-pointer" onclick="FilePreviewURL('${item.file_path}')">
                                    ${item?.file_path ? `<span class="text-sm text-blue-400 cursor-pointer">Preview</span>`
                        : `
                                    <img src="" alt="certificate"
                                        class="w-20 h-20">`}
                                </div>
                            </div>
                        </div>
                        `
        }
    }

    if (result) {
        $(`#content #${parentSection} #inner-container`).html(result)
    }
}
async function educationDataExtraction(obj, parentSection, checking = false) {
    let result = ""
    if (obj?.length) {
        for (let i = 0; i < obj.length; i++) {
            let item = obj[i]
            result += `
                        <div class="grid grid-cols-2 gap-6 items-start text-sm ${i && 'pt-8'}">
                            ${!checking ? `
                            <div class="border-b-2 w-3/4">
                                <h4 class="mb-3">Degree</h4>
                                <span id="degree" class="text-textPrimary">${item.degree}</span>
                            </div>                            
                            <div class="border-b-2 w-3/4">
                                <h4 class="mb-3">Institution Name</h4>
                                <span id="institution" class="text-textPrimary">${item.institution}</span>
                            </div>                            
                            <div class="border-b-2 w-2/6 col-span-2">
                                <h4 class="mb-3">${capitalizeFirstLetter(item.mark_type)}</h4>
                                <span id="percentage" class="text-textPrimary">${item.percentage}</span>
                            </div>                            
                            <div class="border-b-2 w-3/4">
                                <h4 class="mb-3">Start Year</h4>
                                <span id="start_year" class="text-textPrimary">${item.start_year}</span>
                            </div>                            
                            <div class="border-b-2 w-3/4">
                                <h4 class="mb-3">End Year</h4>
                                <span id="end_year" class="text-textPrimary">${item.end_year}</span>
                            </div> `:
                    `<div class="border-b-2 w-3/4">
                                    <h4 class="mb-3">Degree</h4>
                                    <label>
                                        <input type="checkbox" class="check-field"
                               data-parent="education" data-field="degree">
                                    <span id="degree" class="text-textPrimary">${item.degree}</span>
                                    </label>
                                </div>
                                <div class="border-b-2 w-3/4">
                                    <h4 class="mb-3">Institution Name</h4>
                                    <label>
                                        <input type="checkbox" class="check-field"
                               data-parent="education" data-field="institution">
                                    <span id="institution" class="text-textPrimary">${item.institution}</span>
                                    </label>
                                </div>
                                <div class="border-b-2 w-2/6 col-span-2">
                                    <h4 class="mb-3">${capitalizeFirstLetter(item.mark_type)}</h4>
                                    <label>
                                        <input type="checkbox" class="check-field"
                               data-parent="education" data-field="percentage">
                                    <span id="percentage" class="text-textPrimary">${item.percentage}</span>
                                    </label>
                                </div>
                                <div class="border-b-2 w-3/4">
                                    <h4 class="mb-3">Start Year</h4>
                                    <label>
                                        <input type="checkbox" class="check-field"
                               data-parent="education" data-field="start_year">
                                    <span id="start_year" class="text-textPrimary">${item.start_year}</span>
                                    </label>
                                </div>
                                <div class="border-b-2 w-3/4">
                                    <h4 class="mb-3">End Year</h4>
                                    <label>
                                        <input type="checkbox" class="check-field"
                               data-parent="education" data-field="end_year">
                                    <span id="end_year" class="text-textPrimary">${item.end_year}</span>
                                    </label>
                            </div>`}                   
                            <div class="w-3/4">
                                <label>
                                    <input type="checkbox" class="check-field" data-parent="education" data-field="file">
                                <span class="mb-3">Education Doc</span>
                                </label>
                                <div id="file_image" class="text-textPrimary cursor-pointer" onclick="FilePreviewURL('${item.file.file_path}')">
                                    ${item?.file?.file_path ? `<span class="text-sm text-blue-400 cursor-pointer">Preview</span>`
                                    : `
                                    <img src="" alt="education"
                                        class="w-20 h-20">`}
                                </div>
                            </div>
                        </div>
                        `
        }
    }

    if (result) {
        $(`#content #${parentSection} #inner-container`).html(result)
    }
}

async function docsDataExtraction(obj, parentSection, checking = false) {
    let result = ""
    let termsURL
    let offerURL
    obj.file.forEach((item) => {
        if (item.type == "term_condition")
            termsURL = item
        else if (item.type?.includes("offer"))
            offerURL = item
    });
    result += `${!checking ? `<div class="grid grid-cols-1 gap-6 items-start" id="terms_condition">
                                <h2 class="text-lg font-bold">Terms & Conditions</h2>
                                <div class="border-b-2 w-1/2">
                                    <label>
                                        <input type="checkbox" ${obj?.term_accepted && "checked"} disabled>
                                        <span id="name" class="text-textPrimary">Terms Accepted</span>
                                    </label>
                                </div>
                                <div class="w-fit border-b-2 mb-4">
                                    <span class="mb-3">Terms Doc</span>
                                    <div onclick="FilePreviewURL('${termsURL?.file_path}')">
                                ${termsURL?.file_path ? `<span class="text-sm text-blue-400 cursor-pointer">Preview</span>`
            : `
                                    <img src="" alt="terms"
                                        class="w-20 h-20">`}
                                        </div>
                                </div>
                            </div>
                            <hr>
                            <div class="grid grid-cols-1 gap-6 mt-4 " id="offer_letter">
                                <h2 class="text-lg font-bold">Offer Letter</h2>
                                <div class="w-fit border-b-2">
                                    <span class="mb-3">Offer Doc</span>
                                    <div onclick="FilePreviewURL('${offerURL?.file_path}')">
                                ${offerURL?.file_path ? `<span class="text-sm text-blue-400 cursor-pointer">Preview</span>`
            : `
                                    <img src="" alt="offer"
                                        class="w-20 h-20">`}
                                        </diV>
                                </div>
                            </div> `: `
                        <div class="grid grid-cols-1 gap-6 items-start" id="terms_condition">
                            <h2 class="text-lg font-bold">Terms & Conditions</h2>
                            <div class="border-b-2 w-1/2">
                                <label>
                                    <input type="checkbox" ${obj?.term_accepted && "checked"} disabled>
                                <span id="name" class="text-textPrimary">Terms Accepted</span>
                                </label>
                            </div>
                            <div class="w-fit border-b-2 mb-4">
                                <label>
                                    <input type="checkbox" class="check-field"
                                data-parent="docs" data-field="terms-condition">
                                    <span class="mb-3">Terms Doc</span>
                                </label>
                                <div onclick="FilePreviewURL('${termsURL?.file_path}')">
                                ${termsURL?.file_path ? `<span class="text-sm text-blue-400 cursor-pointer">Preview</span>`
        : `
                                    <img src="" alt="terms"
                                        class="w-20 h-20">`}
                                        </div>
                            </div>
                        </div>
                        <hr>
                        <div class="grid grid-cols-1 gap-6 mt-4 " id="offer_letter">
                            <h2 class="text-lg font-bold">Offer Letter</h2>
                            <div class="w-fit border-b-2">
                                <label>
                                    <input type="checkbox" class="check-field"
                                data-parent="docs" data-field="offer-letter">
                                <span class="mb-3">Offer Doc</span>
                                </label>
                                <div onclick="FilePreviewURL('${offerURL?.file_path}')">
                                ${offerURL?.file_path ? ["jpg", "jpeg", "png"].includes(offerURL?.file_path.split("/").pop().split(".").pop()) ? `
                                    <img src="${await FilePreviewURL(offerURL?.file_path, false)}" alt="offer"
                                        class="w-20 h-20 cursor-pointer">`
        : `<span class="text-sm text-blue-400 cursor-pointer">Preview</span>`
        : `
                                    <img src="" alt="offer"
                                        class="w-20 h-20">`}
                                        </diV>
                            </div>
                        </div>
                        `}
                        `

    if (result) {
        $(`#content #${parentSection} #inner-container`).html(result)
    }
}

async function documentDataExtraction(obj, parentSection, checking = false, fileUpload = true) {
    let result = ""
    let Doclist= []
    // console.log(obj)
    obj["my_document"].forEach((element, index) => {
        result += `${!checking
            ? ` <tr id="${index}" data-id="${element.id}" class="border-b hover:bg-gray-50 transition">
                            <td class="p-4">${capitalizeFirstLetter(element.name)}</td>
                            <td class="p-4">Upload at: ${new Date(element.last_upload).toLocaleDateString()}</td>
                            <td class="p-4 w-full flex gap-8">
                                <span class="text-blue-400 cursor-pointer" onclick="FileDownload('${element?.file_path}')"><i class="fa-solid fa-eye"></i> Preview</span>
                            </td>
                        </tr>`
            : ` <tr id="${index}" data-id="${element.id}" class="border-b hover:bg-gray-50 transition">
                            <td class="p-4"><input type="checkbox" class="check-field" data-parent="docs"
                                                    data-field="${element.name.split("_").pop()}"></td>
                            <td class="p-4">${capitalizeFirstLetter(element.name)}</td>
                            <td class="p-4">Upload at: ${new Date(element.last_upload).toLocaleDateString()}</td>
                            <td class="p-4 w-full flex gap-8">
                                <span class="text-blue-400 cursor-pointer" onclick="FileDownload('${element?.file_path}')"><i class="fa-solid fa-eye"></i> Preview</span>
                            </td>
                        </tr>`
            }`
            Doclist.push({"id":element.document_id,"date":new Date(element.last_upload)})
    })
    if(!checking)
    obj["other_document"].forEach((element, index) => {
        let doc = Doclist.find(i => i.id == element.id)
        let date = new Date(element.updated_at)
        // console.log(date > doc["date"],date,doc)
        let flag = doc ? date > doc["date"] ? true : false : true
        if (element.status == 1 && flag) {
            result += `${!checking
                ? ` <tr id="${index}" data-id="${element.id}" class="border-b hover:bg-gray-50 transition">
                            <td class="p-4">${capitalizeFirstLetter(element.name)}</td>
                            <td class="p-4">
                                ${element.file_upload ? fileUpload ?
                    `<div class="-mt-4 md:min-w-36">
                                    ${floatingFileInputTag("file_" + element.id, "file", "upload " + element.name,"",true,[".pdf"])}
                                </div>` : "Need to upload file"
                    : "Just download"}
                            </td>
                            <td class="p-4 w-full flex gap-8">
                                <span class="text-blue-400 cursor-pointer" onclick="FileDownload('/document/template/preview/${element?.template?.id}')"><i class="fa-solid fa-download"></i> Download</span>
                                <button class="p-2 bg-green-500 text-white font-medium text-xs rounded-lg hidden" id="save_${element.id}"
                                    onclick="UploadDocumentFile(${element.id},'${element.name}','document')">save</button>
                            </td>
                        </tr>`
                : ` <tr id="${index}" data-id="${element.id}" class="border-b hover:bg-gray-50 transition">
                            <td class="p-4"><input type="checkbox" checked disabled  class="check-field" ></td>
                            <td class="p-4">${capitalizeFirstLetter(element.name)}</td>
                            <td class="p-4">
                                ${element.file_upload ? fileUpload ?
                    `<div class="-mt-4 md:min-w-36">
                                    ${floatingFileInputTag("file_" + element.id, "file", "upload " + element.name,"",true,[".pdf"])}
                                </div>` : "Need to upload file"
                    : "Just download"}
                            </td>
                            <td class="p-4 w-full flex gap-8">
                                <span class="text-blue-400 cursor-pointer" onclick="FileDownload('/document/template/preview/${element?.template?.id}')"><i class="fa-solid fa-download"></i> Download</span>
                                <button class="p-2 bg-green-500 text-white font-medium text-xs rounded-lg hidden" id="save_${element.id}"
                                    onclick="UploadDocumentFile(${element.id},'${element.name}','document')">save</button>
                            </td>
                        </tr>`
                }`
            $(document).on("change", `input#file_${element.id}`, function () { let parent = $(this).closest("tr"); parent.find(`button#save_${element.id}`).show() })
        }
    })

    if (result) {
        $(`#content #${parentSection} #inner-container tbody`).html(result)
    }
}


function UploadDocumentFile(ID,name,type) {
    let file = $(`tr td input#file_${ID}`)[0].files[0]
    let forms = new FormData()
    forms.append("file",file)
    forms.append("module_id",ID)
    forms.append("name",name)
    forms.append("type",type)
    try {
        ProgressLoading(true)
        fetch(`${DomainURL}/my/document`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            body:forms
        })
            .then(res => res.ok ? res.json() : showAlertMessage("warning", "API error", `${res.status} ${res.statusText}`))
            .then(data => {
                // console.log(data)
                if (data.status) {
                    MyDocument()                   
                } else {
                    showAlertMessage("error", "Document document", data.message)
                }
                ProgressLoading(false)
            })
    } catch (error) {
        ProgressLoading(false)
        showAlertMessage("warning", "API error", error)
    }
}