
// const DomainURL = "https://hrms-api-s8dh.onrender.com" 
const DomainURL = "http://localhost:8080"

// Permission Modules
const modules = ["user","access","timesheet","timeoffpolicy","appraisal","appraisalform","role","team","request","permission","project","management","onboard","document"]

let PAGESIZE = 8
let statusNames  = { 0: "Pending", 1: "Active", 2: "Inactive", 3: "Approved", 4: "Rejected", 5: "Verification", 6: "Correction", 7: "Suspended" }
let projectStatusNames = { 0: "Pending", 1: "Review", 2: "On going", 3: "Complete", 4:"Cancelled"}
const FormCategories = ["Work Performance", "Teamwork Collaboration", "Skills Development", "Communication", "Goals Objectives", "Leadership Initiative", "Integrity Responsibility", "Self-Assessment Feedback", "Manager Assessment"]



// URL Params
// const queryString = window.location.search;
const url = new URL(window.location.href);
const urlParams = new URLSearchParams(url.search);
// const Params = url.searchParams; 

const scripts = [

    "./static/js/global.js",
    "./static/js/util.js",
    // "https://cdn.jsdelivr.net/npm/moment@2.29.3/moment.min.js"
];

const styles = [
    "./static/css/floatinput.css"
];

const access_token = $.cookie("access_token");
if (!access_token) {
    let URL = window.location.href.split("/").pop()
    if(!URL.includes("login.html") && !URL.includes("passwordreset.html") && !URL.includes("passwordgen.html"))
        window.location.href = 'login.html?next=' + URL
}else{
    scripts.forEach(src => loadScript(src));
}


let Setting
function setSettings() {
    try {
        ProgressLoading(true)
        fetch(`${DomainURL}/setting`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`
            },
            method: "GET"
        })
            .then(res => res.ok ? res.json() : showAlertMessage("warning", "API error", `${res.status} ${res.statusText}`))
            .then(data => {
                if (data.status) {
                    // console.log(data)
                    Setting = data?.setting
                    if(Setting?.page_size)
                        PAGESIZE = Setting?.page_size
                    if(Setting?.status_names)
                        statusNames = NamesFromSettings(Setting?.status_names)
                    if(Setting?.project_state)
                        projectStatusNames = NamesFromSettings(Setting?.project_state)
                } else {
                    showAlertMessage("error", "Settings", data?.message)
                }
                ProgressLoading(false)
            });

    } catch (error) {
        ProgressLoading(false)
        showAlertMessage("warning", "API error", error)
    }
}

function NamesFromSettings(data){
    let result = {}
    Object.keys(data).forEach(key=>{
        result[parseInt(key)] = data[key].name
    });
    return result;
}

setSettings()

styles.forEach(href => loadCSS(href));

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

function showAlertMessage(type, title, message, autoClose = true, duration = 5000, align="center") {
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
    <div class="w-full flex justify-${align}">
      <div id="${id}" class="${config[type].bg} ${config[type].border} ${config[type].text} rounded shadow-md px-4 py-3 max-w-sm flex items-start gap-3 animate-fade-in">
        <div class="text-lg">${config[type].icon}</div>
        <div>
    
          <div class="text-sm mt-1">${message}</div>
        </div>
        <button onclick="$('#${id}').remove()" class="text-xl font-bold leading-none hover:text-gray-700">&times;</button>
      </div>
    </div>
    `;

    //<strong class="font-semibold">${title}</strong>

    $('#AlertMessageContainer').append(toast);

    if (autoClose) {
        setTimeout(() => {
            $(`#${id}`).fadeOut(700, function () {
                $(this).remove();
            });
        }, duration);
    }
}

$(document).ready(function(){
    $("body").append(`
        <div id="AlertMessageContainer" class="fixed top-16 space-y-4 z-50 h-fit w-full p-3"></div>
        <div id="Loading-Progress" class="fixed inset-0 w-full h-full grid content-end justify-end p-6 hidden">
            <div>
                <svg aria-hidden="true" class="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="font-semibold text-sm animate-bounce">Loading . . .</span>
            </div>
        </div>
    `)
})

function ProgressLoading(status) {
    let elm = $("#Loading-Progress");
    if (elm && status)
        elm.removeClass("hidden")
    else if (elm && !status)
        elm.addClass("hidden")
}

function HomePage(){
    window.location.href = "index.html"
}