(() => {
    "use strict";
    class Tabs {
        constructor(tabContainer) {
            this.tabContainer = document.querySelector(tabContainer);
            if (this.tabContainer) {
                this.tabs = this.tabContainer.querySelectorAll(".tab");
                this.tabContents = document.querySelectorAll(".tab-content");
                if (this.tabs.length > 0 && this.tabContents.length > 0) this.init();
            }
        }
        init() {
            const savedTabIndex = localStorage.getItem("activeTabIndex");
            if (savedTabIndex) this.activateTab(this.tabs[savedTabIndex]); else this.activateTab(this.tabs[0]);
            this.tabs.forEach(((tab, index) => {
                tab.addEventListener("click", (event => this.switchTab(event, index)));
            }));
        }
        switchTab(event, index) {
            const targetTab = event.target;
            this.activateTab(targetTab);
            localStorage.setItem("activeTabIndex", index);
        }
        activateTab(tab) {
            const targetContent = document.querySelector(tab.getAttribute("data-target"));
            if (targetContent) {
                this.tabs.forEach((t => t.classList.remove("active")));
                this.tabContents.forEach((c => c.classList.remove("active")));
                tab.classList.add("active");
                targetContent.classList.add("active");
            }
        }
    }
    class Preloader {
        constructor(preloaderElement, contentElement) {
            this.preloader = preloaderElement;
            this.content = contentElement;
        }
        hide() {
            this.preloader.style.opacity = "0";
            setTimeout((() => {
                this.preloader.style.display = "none";
                this.content.style.display = "block";
                setTimeout((() => {
                    this.content.style.opacity = "1";
                    document.body.style.overflow = "auto";
                }), 50);
            }), 1e3);
        }
    }
    const preloaderElement = document.getElementById("preloader");
    const contentElement = document.getElementById("content");
    const preloader = new Preloader(preloaderElement, contentElement);
    window.onload = function() {
        preloader.hide();
    };
    new Tabs(".tabs-container");
})();