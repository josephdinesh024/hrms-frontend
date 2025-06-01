// First litter cap
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


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


function StatusColourCode(status){
    switch(status){
        case "pending" || "pend":
            return `<span class="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">${capitalizeFirstLetter(status)}</span>`
        case "active":
            return `<span class="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded""> ${capitalizeFirstLetter(status)} </span>`
        case "onboard" || "onboarding" || "v":
            return `<span class="inline-block px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded""> ${capitalizeFirstLetter(status)} </span>`
        case "view" || "viewed":
            return `<span class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded""> ${capitalizeFirstLetter(status)} </span>`
        case "block" || "suspended" || "inactive":
            return `<span class="inline-block px-2 py-1 text-xs bg-red-100 text-white rounded"> ${capitalizeFirstLetter(status)} </span>`
    }                        
}

async function FilePreviewURL(url) {
    const newURL = DomainURL + url;
    const response = await fetch(newURL);

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
    <div class="relative mt-6 w-64 floating-label">
        <input
            type="${type}"
            id="${id}"
            class="w-full border-b-2 border-gray-300 bg-transparent text-sm ${type=="date"? "pt-10 focus:pt-5 focus:pb-5" :"pt-4" } pb-1 focus:outline-none focus:border-blue-500"
            name="${name}"
            placeholder=" "
            value="${value}"
            ${required ? "required" : ""}
            ${disabled ? "disabled" : ""}
        />
        <label
            for="${id}"
            class="absolute left-0 text-gray-500 text-sm transition-all duration-200"
        >
            ${labelName}
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
            ${labelName}
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
