 
/* Hides the Cookie banner and saves the value to localstorage */

function CookieBanner_hide () {
    localStorage.setItem("cb_isCookieAccepted", "yes");
}
   
   /* Checks the localstorage and shows Cookie banner based on it. */

function CookieBanner_init () {
    let isCookieAccepted = localStorage.getItem("cb_isCookieAccepted");
    
    if (isCookieAccepted === null) {
        localStorage.setItem("cb_isCookieAccepted", "no");
        openPopupCookieBanner();
    }

    if (isCookieAccepted === "no") {
        openPopupCookieBanner();
    }
}

function CookieBannerPanel () {
    var content = '';
    content = 
    `<div id="cb-cookie-banner" class="alert alert-warning text-center mb-0" role="alert">
        🍪 This website uses functional and analytical cookies to make sure our website works properly and to offer you the best possible user experience. 
        By using this website, functional and analytical cookies will be installed on your browser.
        <a href="https://www.cookiesandyou.com/" target="blank">Learn more</a>
        </button>
    </div>`;
    
    return content;
}

function openPopupCookieBanner () {
    sb.render ({
        header: 'JUREXTRADE USES COOKIES', 
        id:'cb-cookie-banner',
        type:'modal',
        resizable: false,
        body: CookieBannerPanel(),
        footer: 
            '<button data-bs-dismiss="modal" class="sb_button" type="button" onclick="">Reject</button>' + 
            '<button data-bs-dismiss="modal" class="sb_button" onclick="CookieBanner_hide()">Accept</button>' 
        //'<button data-bs-dismiss="modal" class="sb_mbutton">Close</button>',
    });
}