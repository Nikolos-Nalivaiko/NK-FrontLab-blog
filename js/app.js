(() => {
    "use strict";
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
    class Tabs {
        constructor(tabContainer) {
            this.tabContainer = document.querySelector(tabContainer);
            if (this.tabContainer) {
                this.tabs = this.tabContainer.querySelectorAll(".tab");
                this.tabContents = document.querySelectorAll(".tab-content");
                if (this.tabs.length > 0 && this.tabContents.length > 0) this.init();
            } else console.error("Tab container not found");
        }
        init() {
            const savedTabIndex = localStorage.getItem("activeTabIndex");
            const validIndex = savedTabIndex && savedTabIndex < this.tabs.length ? savedTabIndex : 0;
            this.activateTab(this.tabs[validIndex]);
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
            if (!tab) {
                console.error("Tab is undefined");
                return;
            }
            const targetContent = document.querySelector(tab.getAttribute("data-target"));
            if (targetContent) {
                this.tabs.forEach((t => t.classList.remove("active")));
                this.tabContents.forEach((c => c.classList.remove("active")));
                tab.classList.add("active");
                targetContent.classList.add("active");
            } else console.error("Target content not found for tab:", tab);
        }
    }
    class CopyCode {
        constructor(buttonSelector) {
            this.buttons = document.querySelectorAll(buttonSelector);
            this.init();
        }
        init() {
            this.buttons.forEach((button => {
                button.addEventListener("click", (event => this.copyCode(event)));
            }));
        }
        copyCode(event) {
            const button = event.currentTarget;
            const codeBlock = button.closest(".code-block").querySelector("code");
            const icon = button.querySelector("svg use");
            const svg = button.querySelector("svg");
            if (codeBlock) {
                const range = document.createRange();
                range.selectNode(codeBlock);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                try {
                    const successful = document.execCommand("copy");
                    if (successful) {
                        svg.classList.add("hidden");
                        setTimeout((() => {
                            icon.setAttribute("xlink:href", "img/icons/icons.svg#check");
                            svg.classList.remove("hidden");
                            svg.classList.add("success");
                        }), 300);
                        setTimeout((() => {
                            svg.classList.add("hidden");
                            setTimeout((() => {
                                icon.setAttribute("xlink:href", "img/icons/icons.svg#copy");
                                svg.classList.remove("hidden");
                                svg.classList.remove("success");
                            }), 300);
                        }), 2e3);
                    }
                } catch (err) {
                    console.error("Помилка копіювання", err);
                }
                selection.removeAllRanges();
            }
        }
    }
    const preloaderElement = document.getElementById("preloader");
    const contentElement = document.getElementById("content");
    const preloader = new Preloader(preloaderElement, contentElement);
    window.onload = function() {
        preloader.hide();
    };
    new Tabs(".tabs-container");
    new CopyCode(".code-block__copy");
})();