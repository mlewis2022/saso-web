$(document).ready(function() {
    $('a[href="#search"]').on('click', function(event) {
        $('#search').addClass('open');
        $('#search > form > input[type="search"]').focus();
    });

    $('#search, #search button.close').on('click', function(event) {
        if (event.target == this || event.target.className == 'close') {
            $(this).removeClass('open');
        }
    });

    // Prevent the escape key from closing the search
    $(document).on('keydown', function(event) {
        if (event.key === 'Escape') {
            $('#search').removeClass('open');
        }
    });
});

////////////////////////

$(document).ready(function(){
    setTimeout(function(){
        $("#loading").fadeOut();
    }, 2000);
});


////////////////////////

$(document).ready(function() {
    var owl = $("#heroCarousel");
    var isRTL = $('html').attr('dir') === 'rtl';
    owl.owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 6000,
        autoplayHoverPause: true,
        dots: true,
        rtl: true,
        responsive: {
            600: {
                items: 1
            }
        }
    });
});


$(document).ready(function() {
    var owl = $("#servicesCarousel");
    var isRTL = $('html').attr('dir') === 'rtl';
    owl.owlCarousel({
        loop: true,
        margin: 16,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        rtl: true,
        center: true,
        smartSpeed: 1000,
        fluidSpeed: 1000,
        responsive: {
             0: { items: 1 },
            768: { items: 2 },
            1024: { items: 4 }
        }
    });
});


$(document).ready(function() {
    var owl = $("#videosCarousel");
    var isRTL = $('html').attr('dir') === 'rtl';
    owl.owlCarousel({
        loop: true,
        margin: 16,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        rtl: true,
        center: true,
        smartSpeed: 1000,
        fluidSpeed: 1000,
        responsive: {
             0: { items: 1 },
            768: { items: 2 },
            1024: { items: 3 }
        }
    });
});


$(document).ready(function() {
    var owl = $("#partnerCarousel");
    var isRTL = $('html').attr('dir') === 'rtl';
    owl.owlCarousel({
        loop: true,
        margin: 16,
        nav: true,
        dots: false,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        rtl: true,
        smartSpeed: 1000,
        fluidSpeed: 1000,
        responsive: {
             0: { items: 2 },
            768: { items: 3 },
            1024: { items: 6 }
        }
    });
});


//////////////////////

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".nav-item .nav-link").forEach(function(link) {
        link.addEventListener("mouseenter", function() {
            if (!link.classList.contains("active") && !link.querySelector(".borderhover")) {
                let borderhoverSpan = document.createElement("span");
                borderhoverSpan.className = "borderhover";
                link.appendChild(borderhoverSpan);
            }
        });
        link.addEventListener("mouseleave", function() {
            if (!link.classList.contains("active")) {
                let borderhoverSpan = link.querySelector(".borderhover");
                if (borderhoverSpan) {
                    borderhoverSpan.remove();
                }
            }
        });
        if (link.classList.contains("active")) {
            if (!link.querySelector(".borderhover")) {
                let borderhoverSpan = document.createElement("span");
                borderhoverSpan.className = "borderhover";
                link.appendChild(borderhoverSpan);
            }
        }
    });
});


//////////////////////////

document.addEventListener("DOMContentLoaded", function() {
    function updateNavItems() {
        let screenWidth = window.innerWidth;
        let extraNav = document.querySelector(".extra-nav");
        let moreMenu = document.querySelector("#moreMenu .dropdown");
        let dropdownMenu = document.querySelector("#moreMenu .dropdown-menu");
        
        if (screenWidth <= 1305) {
            moreMenu.classList.remove("d-none");
            dropdownMenu.innerHTML = "";
            extraNav.querySelectorAll(".nav-item").forEach(item => {
                dropdownMenu.appendChild(item.cloneNode(true));
                item.classList.add("d-none");
            });
        } else {
            moreMenu.classList.add("d-none");
            extraNav.querySelectorAll(".nav-item").forEach(item => {
                item.classList.remove("d-none");
            });
        }
    }
    
    window.addEventListener("resize", updateNavItems);
    updateNavItems();
});

//

document.getElementById("fileUpload").addEventListener("change", function() {
    const fileName = this.files[0] ? this.files[0].name : "اختر الملف";
    document.querySelector(".file-name").innerText = fileName;
});