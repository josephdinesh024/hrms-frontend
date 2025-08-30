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

function ProjectStatusColourCode(status) {
    if (Setting?.project_state) {
        let states = Setting?.project_state[status]
        if (states)
            return `<span class="inline-block px-2 py-1 text-xs bg-[${states?.bg}] text-[${states?.text}] rounded">${states?.name}</span>`
        else
            return `<span class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Error status</span>`
    } else
        switch (status) {
            case 0:
                return `<span class="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">${projectStatusNames[status]}</span>`
            case 1:
                return `<span class="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">${projectStatusNames[status]}</span>`
            case 2:
                return `<span class="inline-block px-2 py-1 text-xs bg-orange-800 text-orange-100 rounded">${projectStatusNames[status]}</span>`
            case 3:
                return `<span class="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">${projectStatusNames[status]}</span>`
            case 4:
                return `<span class="inline-block px-2 py-1 text-xs bg-red-100 text-white rounded">${projectStatusNames[status]}</span>`
            default:
                return `<span class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Error status</span>`
        }
}
function StatusColourCode(status) {
    if (Setting?.status_names) {
        let st = Setting?.status_names[status]
        if (st)
            return `<span class="inline-block px-2 py-1 text-xs bg-[${st?.bg}] text-[${st?.text}] rounded">${st?.name}</span>`
        else
            return `<span class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Error status</span>`
    } else
        switch (status) {
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

const CountryNames = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia (Czech Republic)",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini (fmr. Swaziland)",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine State",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
]


async function FilePreviewURL(url, preview = true) {
    const newURL = DomainURL + url;
    const response = await fetch(newURL);

    if (!response.ok) {
        console.error("Failed to fetch file");
        return;
    }

    const blob = await response.blob();
    const fileURL = URL.createObjectURL(blob);
    if (preview)
        window.open(fileURL, '_blank');
    else
        return fileURL
}

async function FileDownload(url) {
    const newURL = DomainURL + url;
    const response = await fetch(newURL, {
        method: "GET", headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`
        }
    });

    if (!response.ok) {
        showAlertMessage("warning", "API error", response.text())
        return;
    }
    const type = response.headers.get("Content-Type")

    if (type.includes("application/json")) {
        const data = await response.json()
        showAlertMessage("error", "File Handle", data?.message)
    } else {
        const blob = await response.blob();
        const fileURL = URL.createObjectURL(blob);

        window.open(fileURL, '_blank');
    }
}

// Input Tag
function floatingInputTag(type, id, name, labelName, value = "", required = true, disabled = false) {
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
            class="absolute left-0 text-gray-500 text-sm transition-all duration-200 ${type == "date" ? "peer-[:not(:focus)]:-bottom-8 peer-[:focus]:bottom-8 peer-[:valid]:bottom-8" : ""}"
        >
            ${labelName} ${required ? "*" : ""}
        </label>
    </div>
    `

    setTimeout(() => {
        $(document).ready(function () {
            $(".floating-label input").each(function () {
                toggleLabel($(this));
            });

            $(".floating-label input").on("input blur", function () {
                toggleLabel($(this));
            });
        });
    }, 300)

    return InputTag
}

function SelectionTag(id, name, labelName, value, required = true, options = []) {
    let selectTag = `
        <div class="mt-5">
            <label class="w-full text-sm text-blue-500">${labelName} ${required ? "*" : ""}</label>
            <select class="w-full border-b-2 border-gray-300 bg-transparent text-sm focus:outline-none focus:border-blue-500"
                id="${id}" name="${name}"
                ${required ? "required" : ""} >
                <option>--</option>
                ${options.map(opt => {
        return `<option ${value == opt ? 'selected' : ""}
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
function floatingFileInputTag(id, name, labelName, fileName = "", required = true, accept = [".pdf", "image/*"]) {
    const InputTag = `
    <div class="relative mt-6 w-full floating-label-file">
        <input
            type="file"
            id="${id}"
            name="${name}"
            class="absolute inset-0 opacity-0 z-10 cursor-pointer"
            ${required ? "required" : ""}
            accept=${accept.join(",")}
        />
        <div
            class="border-b-2 border-gray-300 bg-transparent text-sm pt-4 pb-1 min-w-40 cursor-pointer file-display peer"
        >
            <span id="${id}_filename" class="text-gray-900 text-sm">${fileName}</span>
        </div>
        <label
            for="${id}"
            class="absolute left-0 min-w-40 flex text-sm transition-all duration-200 cursor-pointer ${fileName != "" ? "text-blue-500" : "text-gray-500"}"
        >
            ${labelName} <i class="fa-solid fa-cloud-arrow-up px-1"></i> ${required ? "*" : ""}
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
                const hasFile = $input[0]?.files.length > 0;
                if (hasFile) {
                    $filename.text($input[0]?.files[0].name);
                    $label.addClass("text-blue-500 text-xs").css("top", "-16px");
                } else {
                    $filename.text(fileName);
                    $label.removeClass(`${fileName == "" ? "text-blue-500" : ""} text-xs`).css("top", "-4px");
                }
            }

            toggleLabelFile(); // Initial state
            $input.on("change blur", toggleLabelFile);
        });
    }, 300);

    return InputTag;
}

function MoreInfo(position = "right", info = "") {
    let result = `
    <div class="group cursor-pointer w-fit relative">
        <div class="px-1.5 rounded-full border-2 border-gray-400 shadow-sm text-xs">
            <i class="fa-solid fa-info"></i>
        </div>
        <div class="hidden group-hover:block absolute ${position}-0 z-40 m-2 p-2 ${info ? "min-w-40" : "w-fit"} bg-white border text-sm rounded-lg shadow-md">
            ${info}
        </div>
    </div>`

    return result
}

function LimitOffset(arr = [], limit = 10, offset = 0) {
    let newArr = []
    let ln = arr.length
    for (let i = offset; i < offset + limit; i++) {
        if (i < ln) {
            newArr.push(arr[i]);
        } else
            break;
    }
    return newArr
}

// FILE UPLOAD

async function uploadFileData(ID, form, message) {
    let flag = true
    let resp = null
    try {
        ProgressLoading(true)
        let response = await fetch(`${DomainURL}/my/file${ID != "0" ? "/" + ID : ""}`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            method: ID != 0 ? "PUT" : "POST",
            body: form
        });
        if (!response.ok) {
            showAlertMessage("warning", "API error", `${response.status} ${response.statusText}`)
            return { flag: false, resp }
        }
        let data = await response.json()
        if (data.status) {
            resp = data.file
            showAlertMessage("success", "Employee profile", message || "File document upload successfully")
        } else {
            showAlertMessage("error", "Employee profile", data.message)
            flag = false
        }
        ProgressLoading(false)
    } catch (error) {
        ProgressLoading(false)
        showAlertMessage("warning", "API error", error)
        flag = false
    }

    return { flag, resp }
}


function leaveDates(start, end) {
    let startDate = new Date(start)
    let endDate = new Date(end)
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    let dateString = ''
    if (startDate.getFullYear() === endDate.getFullYear()) {
        if (startDate.getMonth() === endDate.getMonth()) {
            if (startDate.getDate() === endDate.getDate()) {
                dateString = `${startDate.getDate()}${month[startDate.getMonth()]} ${startDate.getFullYear()}`
            } else {
                dateString = `${startDate.getDate()}-${endDate.getDate()}${month[startDate.getMonth()]} ${startDate.getFullYear()}`
            }
        } else {
            dateString = `${startDate.getDate()}${month[startDate.getMonth()]}-${endDate.getDate()}${month[endDate.getMonth()]} ${startDate.getFullYear()}`
        }
    } else {
        dateString = `${startDate.getDate()}${month[startDate.getMonth()]} ${startDate.getFullYear()}-${endDate.getDate()}${month[endDate.getMonth()]} ${endDate.getFullYear()}`
    }

    return dateString
}


function formatTime(timestamp) {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 => 12

    return `${hours}:${minutes} ${ampm}`;
}


// Colour picker
const tailwindColors = {
    'red': { 50: '#FEF2F2', 100: '#FEE2E2', 200: '#FECACA', 300: '#FCA5A5', 400: '#F87171', 500: '#EF4444', 600: '#DC2626', 700: '#B91C1C', 800: '#991B1B', 900: '#7F1D1D' },
    'green': { 50: '#F0FDF4', 100: '#DCFCE7', 200: '#BBF7D0', 300: '#86EFAC', 400: '#4ADE80', 500: '#22C55E', 600: '#16A34A', 700: '#15803D', 800: '#166534', 900: '#14532D' },
    'blue': { 50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD', 400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8', 800: '#1E40AF', 900: '#1E3A8A' },
    'yellow': { 50: '#FEFCE8', 100: '#FEF9C3', 200: '#FEF08A', 300: '#FDE047', 400: '#FACC15', 500: '#EAB308', 600: '#CA8A04', 700: '#A16207', 800: '#854D0E', 900: '#713F12' },
    'gray': { 50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB', 300: '#D1D5DB', 400: '#9CA3AF', 500: '#6B7280', 600: '#4B5563', 700: '#374151', 800: '#1F2937', 900: '#111827' },
};

function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function colorDistance(rgb1, rgb2) {
    if (!rgb1 || !rgb2) return Infinity;
    const dr = rgb1.r - rgb2.r;
    const dg = rgb1.g - rgb2.g;
    const db = rgb1.b - rgb2.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
}

function findClosestTailwindColor(hex) {
    const inputRgb = hexToRgb(hex);
    let closestMatch = null;
    let minDistance = Infinity;

    for (const colorName in tailwindColors) {
        for (const shade in tailwindColors[colorName]) {
            const tailwindHex = tailwindColors[colorName][shade];
            const tailwindRgb = hexToRgb(tailwindHex);
            const distance = colorDistance(inputRgb, tailwindRgb);

            if (distance < minDistance) {
                minDistance = distance;
                closestMatch = `text-${colorName}-${shade}`;
            }
        }
    }
    return closestMatch;
}

const formatDateSection = (dateParam) => {
    let inputDate;
    try {
        inputDate = new Date(dateParam);
        if (isNaN(inputDate.getTime())) {
            return 'Invalid date format.';
        }
    } catch (e) {
        return 'Invalid date format.';
    }
    const today = new Date();
    const normalizeDate = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const normalizedInputDate = normalizeDate(inputDate);
    const normalizedToday = normalizeDate(today);

    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    const diffDays = Math.round((normalizedToday - normalizedInputDate) / oneDay);

    if (diffDays === 0) {
        return 'today';
    }else if (diffDays === 1) {
        return 'yesterday';
    }else if (diffDays > 1 && diffDays < 7) {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return daysOfWeek[inputDate.getDay()];
    }

    const year = inputDate.getFullYear().toString().slice(-2);
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
    const day = inputDate.getDate().toString().padStart(2, '0');

    return `${day}-${month}-${year}`;
};