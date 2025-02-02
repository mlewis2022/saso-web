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
    function initCarousel(selector, config) {
        var isRTL = $('html').attr('dir') === 'rtl';
        $(selector).owlCarousel({
            ...config, // Spread the common config
            rtl: isRTL // Set RTL mode dynamically
        });
    }

    // Define carousel configurations
    var carouselsConfig = {
        "#heroCarousel": {
            items: 1,
            loop: true,
            autoplay: true,
            autoplayTimeout: 6000,
            autoplayHoverPause: true,
            dots: true,
            responsive: { 600: { items: 1 } }
        },
        "#servicesCarousel": {
            loop: true,
            margin: 16,
            nav: true,
            dots: true,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            center: true,
            smartSpeed: 1000,
            fluidSpeed: 1000,
            responsive: { 0: { items: 1 }, 768: { items: 2 }, 1024: { items: 4 } }
        },
        "#videosCarousel": {
            loop: true,
            margin: 16,
            nav: true,
            dots: true,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            center: true,
            smartSpeed: 1000,
            fluidSpeed: 1000,
            responsive: { 0: { items: 1 }, 768: { items: 2 }, 1024: { items: 3 } }
        },
        "#partnerCarousel": {
            loop: true,
            margin: 16,
            nav: true,
            dots: false,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            smartSpeed: 1000,
            fluidSpeed: 1000,
            responsive: { 0: { items: 2 }, 768: { items: 3 }, 1024: { items: 6 } }
        }
    };

    // Initialize all carousels
    $.each(carouselsConfig, function(selector, config) {
        initCarousel(selector, config);
    });

    // If language direction changes dynamically
    $(document).on('languageChange', function() {
        $.each(carouselsConfig, function(selector, config) {
            $(selector).trigger('destroy.owl.carousel'); // Destroy current instance
            initCarousel(selector, config); // Reinitialize with updated direction
        });
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


$(document).ready(function() {
    function fetchSearchResults(query) {
        // Simulating an API call (Replace with actual API URL)
        return new Promise((resolve) => {
            setTimeout(() => {
                let results = [
                    "Educational Videos",
                    "Funny Clips",
                    "Documentaries",
                    "Match Analysis",
                    "Breaking News",
                    "Latest Technology",
                    "New Songs",
                    "Cooking Recipes",
                    "Workout Routines",
                    "Movies & TV Shows"
                ].filter(item => item.toLowerCase().includes(query.toLowerCase()));
                resolve(results);
            }, 300); // Simulating API delay
        });
    }

    $(".search-input").on("keyup", async function() {
        var inputVal = $(this).val();
        var dropdown = $(".search-dropdown");
        dropdown.empty();

        if (inputVal.length > 0) {
            let results = await fetchSearchResults(inputVal);

            if (results.length > 0) {
                results.forEach(function(item) {
                    dropdown.append("<div>" + item + "</div>");
                });
                dropdown.show();
            } else {
                dropdown.hide();
            }
        } else {
            dropdown.hide();
        }
    });

    // Select from dropdown
    $(".search-dropdown").on("click", "div", function() {
        $(".search-input").val($(this).text());
        $(".search-dropdown").hide();
    });

    // On search button click
    $(".search-btn").on("click", function() {
        var searchTerm = $(".search-input").val();
        if (searchTerm) {
            window.location.href = "/search-results.html?q=" + encodeURIComponent(searchTerm);
        }
    });

    // Hide dropdown when clicking outside
    $(document).on("click", function(e) {
        if (!$(e.target).closest(".search-pro").length) {
            $(".search-dropdown").hide();
        }
    });
});

/////

document.getElementById("fileUpload").addEventListener("change", function() {
    const fileName = this.files[0] ? this.files[0].name : "اختر الملف";
    document.querySelector(".file-name").innerText = fileName;
});


//////