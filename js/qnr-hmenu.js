/* ==================================================================
 *
 *            QUICKNR HIERARCHICAL MENU 1.0.0
 *
 *            Copyright 2016 Karl Dolenc, beholdingeye.com.
 *            All rights reserved.
 * 
 * ================================================================== */
 
/* ----------------------- LICENSE ---------------------------------
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 * 
 * -------------------------------------------------------------- */

// Global object, providing access to QNR properties and methods
var QNR_HMENU = {};

(function(){
    
    /* ----------------------- INFO ---------------------------------
     * 
     *                         Hierarchical Menu
     *
     * Any clickable element assigned the class of "qnr-hmenu" will 
     * display a dropdown hierarchical menu widget, potentially 
     * containing submenus, if the clickable element contains a UL 
     * element, interpreted by the code as defining the dropdown menu
     * 
     * Note that a horizontal navigation menu cannot itself be a hmenu,
     * but its items, the horizontally positioned LI elements, may
     * contain hmenus:
     * 
     *      MainMenuItem1   MainMenuItem2   MainMenuItem3
     *                                        Hmenu in above item
     *                                          Hmenu Item1
     *                                          Hmenu Item2
     *                                            Hmenu Submenu
     *                                              Submenu Item1
     *                                              Submenu Item2
     *                                              Submenu Item3
     *                                              etc.
     * 
     * A submenu is defined as a UL contained in a LI item of the main
     * hmenu, and the submenu LI items may contain further submenus
     * 
     * The LI item containing a submenu should precede the submenu UL
     * with text that will be the LI item's label. The text must not be
     * part of a HTML tag of its own
     * 
     * The vertical and horizontal direction of the menu's and any 
     * submenu's appearance can be controlled with dataset attributes:
     * 
     * "data-qnr-hmenu-direction-x" - horizontal, "left" or "right"
     * "data-qnr-hmenu-direction-y" - vertical, "up" or "down"
     * 
     * The code assigns CSS classes to relevant objects:
     * 
     * "qnr-hmenu-menu" - main UL menu contained in widget object
     * "qnr-hmenu-subholder" - any LI in the widget containing a submenu
     * "qnr-hmenu-submenu" - any submenu UL in the widget
     * 
     * Directions other than "down" and "right" will result in further
     * CSS classes: "qnr-hmenu-submenu-up" and "qnr-hmenu-submenu-left".
     * Only the vertical direction is considered on the main menu, and 
     * managed in code, not a CSS rule
     * 
     * Note that only "down" and "right" directions, the defaults, will
     * result in container scrollbars if (sub)menus overflow
     * 
     * Menus can be set to open and close on mouse hover with the 
     * "data-qnr-hover" attribute set to "yes", the default, or "no" for
     * clicking support only. If just one widget is set to "no", all 
     * will be hidden on mouse leaving them
     * 
     * -------------------------------------------------------------- */ 

    // ===================== STARTUP ===================== 
    
    // ----------------------- Create a list of widgets
    QNR_HMENU.hmenusL = null; // List of hierarchical menu elements in doc
    QNR_HMENU.hmenuObjectsL = []; // List of JS hierarchical menu objects
    
    
    // ----------------------- HIERARCHICAL MENU
    
    function HmenuObject() {
        this.object = null;
        this.directionX = "down";
        this.directionY = "right";
        this.menu = null;
        this.submenus = [];
        this.parents = []; // Containers of submenus
        this.hoverOpen = "yes"; // Open on hover or only on click
    }
    HmenuObject.prototype.initialize = function() {
        // Set preferences from dataset attributes
        if (this.object.dataset.qnrHmenuDirectionX) this.directionX = this.object.dataset.qnrHmenuDirectionX;
        if (this.object.dataset.qnrHmenuDirectionY) this.directionY = this.object.dataset.qnrHmenuDirectionY;
        if (this.object.dataset.qnrHmenuHover) this.hoverOpen = this.object.dataset.qnrHmenuHover;
        // Hide the main UL
        this.menu = objTag("ul", this.object);
        this.menu.classList.add("qnr-hmenu-menu");
        var menuHeight = this.menu.offsetHeight; // Must be here, before hiding by CSS rule
        this.menu.style.display = "none";
        // Consider only vertical direction for main menu
        if (this.directionY == "up") {
            // Set bottom of menu to top of widget object
            this.menu.style.top = "-" + menuHeight + "px";
        }
        // Get submenus and their LI parents
        this.submenus = tagObjs("ul", this.menu);
        for (var i = 0; i < this.submenus.length; i++) {
            this.submenus[i].classList.add("qnr-hmenu-submenu");
            this.submenus[i].style.display = "none";
            if (this.directionX == "left") this.submenus[i].classList.add("qnr-hmenu-submenu-left");
            if (this.directionY == "up") this.submenus[i].classList.add("qnr-hmenu-submenu-up");
            // Record parent LI objects
            this.parents.push(this.submenus[i].parentNode);
            this.parents[i].classList.add("qnr-hmenu-subholder");
            this.parents[i].dataset.qnrSubmenuParentId = i; // Needed for event handler
        }
        
        // Set onclick handler on the widget object to display the menu
        var this1 = this;
        this.object.addEventListener("click", function(event) {
            //print("========= MAIN : "+event.target.tagName);
            this1.hideMenus();
            this1.menu.style.display = "block";
            event.stopPropagation();
        }, false);
        // Set onmouseover handler
        if (this.hoverOpen == "yes") {
            this1 = this;
            this.object.addEventListener("mouseover", function(event) {
                if (event.target == this1.object) {
                    this1.hideMenus();
                    this1.menu.style.display = "block";
                    event.stopPropagation();
                }
            }, true);
        }
        
        // Set onclick and onmouseover handlers on menu/submenu LIs, perhaps displaying submenus
        var liItemsL = tagObjs("li", this.menu);
        for (var i = 0; i < liItemsL.length; i++) {
            this1 = this;
            var ii = i;
            if (liItemsL[i].classList.contains("qnr-hmenu-subholder")) { // Submenu holder
                // Onclick
                liItemsL[i].addEventListener("click", function(event) {
                    // Hide any other shown submenus, not in path of target
                    this1.hideSubmenus(event, "others");
                    // Prevent child LI objects in further submenus bubbling up to here and failing
                    if (event.target.dataset.qnrSubmenuParentId) {
                        //print("================ SUB : "+event.target.tagName);
                        this1.submenus[parseInt(event.target.dataset.qnrSubmenuParentId)].style.display = "block";
                        event.stopPropagation();
                    }
                }, true); // Registered for the capturing phase, not bubbling up to ancestors
                // Onmouseover
                if (this.hoverOpen == "yes") {
                    //this1 = this;
                    liItemsL[i].addEventListener("mouseover", function(event) {
                        // Hide any other shown submenus, not in path of target
                        this1.hideSubmenus(event, "others");
                        // Prevent child LI objects in further submenus bubbling up to here and failing
                        if (event.target.dataset.qnrSubmenuParentId) {
                            //print("================ SUB : "+event.target.tagName);
                            this1.submenus[parseInt(event.target.dataset.qnrSubmenuParentId)].style.display = "block";
                            event.stopPropagation();
                        }
                    }, true);
                }
            }
            else { // Not a submenu holder
                liItemsL[i].addEventListener("click", function(event) {
                    // Hide any submenus
                    this1.hideSubmenus(event, "all");
                    this1.hideMenus();
                    event.stopPropagation();
                }, true);
                if (this.hoverOpen == "yes") {
                    liItemsL[i].addEventListener("mouseover", function(event) {
                        // Hide any other shown submenus, not in path of target
                        this1.hideSubmenus(event, "others");
                        event.stopPropagation();
                    }, true);
                }
            }
        }
    }
    HmenuObject.prototype.hideMenus = function() {
        // Hide any hmenus that are open
        for (var i = 0; i < QNR_HMENU.hmenuObjectsL.length; i++) {
            if (window.getComputedStyle(QNR_HMENU.hmenuObjectsL[i].menu, "").display != "none") {
                if (QNR_HMENU.hmenuObjectsL[i].submenus) { // Hide any submenus
                    for (var x = 0; x < QNR_HMENU.hmenuObjectsL[i].submenus.length; x++) {
                        if (QNR_HMENU.hmenuObjectsL[i].submenus[x].style.display != "none") {
                            QNR_HMENU.hmenuObjectsL[i].submenus[x].style.display = "none";
                        }
                    }
                }
                QNR_HMENU.hmenuObjectsL[i].menu.style.display = "none";
            }
        }
    }
    HmenuObject.prototype.hideSubmenus = function(event, allOrOthers) {
        // Hide submenus of this hmenu that are open, all or others
        // Called from onclick handler on submenu LI parents
        if (allOrOthers != "all") {
            // Make a list of all submenu objects in target path
            var targetPathObjectsL = [];
            var etp = event.target.parentNode;
            while (1) {
                if (etp.tagName == "UL" && etp.classList.contains("qnr-hmenu-submenu")) {
                    targetPathObjectsL.push(etp);
                    etp = etp.parentNode;
                }
                else if (etp.tagName == "LI") { // Needed for tree traversal
                    etp = etp.parentNode;
                    continue;
                }
                else break;
            }
        }
        for (var i = 0; i < this.submenus.length; i++) {
            var continueOuter = false;
            if (window.getComputedStyle(this.submenus[i], "").display != "none") {
                if (allOrOthers == "all") {
                    this.submenus[i].style.display = "none";
                }
                else { // Hide the submenu if it isn't in the path of the event target
                    for (var x = 0; x < targetPathObjectsL.length; x++) {
                        // Continue upper loop if the submenu is in target path
                        if (this.submenus[i] == targetPathObjectsL[x]) {
                            continueOuter = true;
                            break;
                        }
                    }
                    if (continueOuter) continue;
                    this.submenus[i].style.display = "none";
                }
            }
        }
    }
    
    
    // ----------------------- ONLOAD
    
    window.addEventListener("load", function(){
        // Needed for accurate element position measurement on load
        window.scrollBy(0, 1);
        window.scrollBy(0, -1);
        
        // ----------------------- Hierarchical menus
        QNR_HMENU.hmenusL = classObjs("qnr-hmenu");
        if (QNR_HMENU.hmenusL) {
            for (var i = 0; i < QNR_HMENU.hmenusL.length; i++) {
                // Create a data- id attribute on the hmenu
                QNR_HMENU.hmenusL[i].dataset.qnrHmenuId = i;
                // Create a new JS object for the hmenu
                QNR_HMENU.hmenuObjectsL.push(new HmenuObject());
                QNR_HMENU.hmenuObjectsL[i].object = QNR_HMENU.hmenusL[i];
                // Initialize object
                QNR_HMENU.hmenuObjectsL[i].initialize();
            }
        }
        
    }, false);
    
    
    // ----------------------- ONCLICK
    
    window.addEventListener("click", function(event){
        //print("w");
        // Close any open menus and submenus, if click not in menu or submenu
        if (QNR_HMENU.hmenuObjectsL) {
            var etp = event.target.parentNode;
            // If for some reason we reach beyond <HTML>, it will be undefined
            if ((event.target.tagName === undefined || etp.tagName === undefined) 
                                                    || (!event.target.classList.contains("qnr-hmenu") 
                                                    && !etp.classList.contains("qnr-hmenu-menu") 
                                                    && !etp.classList.contains("qnr-hmenu-submenu"))) {
                for (var i = 0; i < QNR_HMENU.hmenuObjectsL.length; i++) {
                    if (window.getComputedStyle(QNR_HMENU.hmenuObjectsL[i].menu, "").display != "none") {
                        QNR_HMENU.hmenuObjectsL[i].menu.style.display = "none";
                        // Submenus of this menu
                        if (QNR_HMENU.hmenuObjectsL[i].submenus) {
                            var subms = QNR_HMENU.hmenuObjectsL[i].submenus;
                            for (var x = 0; x < subms.length; x++) {
                                if (window.getComputedStyle(subms[x], "").display != "none") {
                                    subms[x].style.display = "none";
                                }
                            }
                        }
                    }
                }
            }
        }
    }, false);
    
    
    // ----------------------- ONMOUSEOVER
    
    window.addEventListener("mouseover", function(event){
        // Hide hmenus if mouse not over any - after a delay
        if (QNR_HMENU.hmenuObjectsL) {
            var etp = event.target.parentNode;
            // If for some reason we reach beyond <HTML>, it will be undefined
            if ((event.target.tagName === undefined || etp.tagName === undefined) 
                                                    || (!event.target.classList.contains("qnr-hmenu") 
                                                    && !etp.classList.contains("qnr-hmenu-menu") 
                                                    && !etp.classList.contains("qnr-hmenu-submenu"))) {
                QNR_HMENU.hmenuObjectsL[0].hideMenus();
            }
        }
    },false);
    
    
    // ----------------------- ONKEYDOWN
    
    window.addEventListener("keydown", function(event){
        if (QNR_HMENU.hmenuObjectsL) {
            var keyCode = ('which' in event) ? event.which : event.keyCode;
            if (keyCode == 27) { // Escape key
                for (var i = 0; i < QNR_HMENU.hmenuObjectsL.length; i++) {
                    QNR_HMENU.hmenuObjectsL[i].hideSubmenus(event, "all");
                }
                QNR_HMENU.hmenuObjectsL[0].hideMenus();
            }
        }
    },false);


    // ===================== UTILITY FUNCTIONS =====================

    // ----------------------- Mobile device detector

    function deviceIsMobile() {
        var isMobile = /iPhone|iPad|iPod|Android|Blackberry|Nokia|Opera mini|Windows mobile|Windows phone|iemobile/i.test(navigator.userAgent);
        return isMobile;
    }


    // ----------------------- File & Dir Path Getters

    function getHrefDirPath() {
        return window.location.href.substr(0,window.location.href.lastIndexOf("/"));
    }

    function getHrefDirName() {
        var wDirPath = getHrefDirPath();
        return wDirPath.substr(wDirPath.lastIndexOf("/")+1);
    }

    function getHrefFileName() {
        // Assumes no query or id
        var fn =  window.location.href.split("/").pop();
        if (!fn) fn = "index.html"; // Avoid empty name
        return fn;
    }

    // ----------------------- Percentage function

    function rangeToPercent(number, min, max) {
        return ((number - min) / (max - min)) * 100;
    }

    // ----------------------- Position functions

    // Returns Y position of element, with given offset
    function getYPos(elem, offsetPos) {
        if (!offsetPos) offsetPos = 0;
        var oPos = offsetPos;
        if (elem.offsetParent) {
            do {
                oPos += elem.offsetTop;
            } while (elem = elem.offsetParent);
        }
        return oPos;
    }

    // Returns X position of element, with given offset
    function getXPos(elem, offsetPos) {
        oPos = offsetPos;
        if (elem.offsetParent) {
            do {
                oPos += elem.offsetLeft;
            } while (elem = elem.offsetParent);
        }
        return oPos;
    }

    // ----------------------- Image preloader

    function loadImagesIntoMemory(imgList) {
        for (var i = 0; i < imgList.length; i++) {
            var img = new Image();
            img.src = imgList[i];
        }
    }

    // ----------------------- Other functions

    function async(fn, args) {
        // Execute the passed function asynchronously
        setTimeout(function() {fn(args);}, 0);
    }

    function print(args) {
        console.log(args);
    }

    // ----------------------- Convenience object-getting functions

    function objHtml() {
        return document.documentElement;
    }

    function objClass(name, parent) {
        if (!parent) {
            return document.getElementsByClassName(name)[0];
        }
        else {
            return parent.getElementsByClassName(name)[0];
        }
    }

    function classObjs(name, parent) {
        if (!parent) {
            return document.getElementsByClassName(name);
        }
        else {
            return parent.getElementsByClassName(name);
        }
    }

    function objID(id, parent) {
        if (!parent) {
            return document.getElementById(id);
        }
        else {
            return parent.getElementById(id);
        }
        
    }

    function objTag(tag, parent) {
        if (!parent) {
            return document.getElementsByTagName(tag)[0];
        }
        else {
            return parent.getElementsByTagName(tag)[0];
        }
    }

    function tagObjs(tag, parent) {
        if (!parent) {
            return document.getElementsByTagName(tag);
        }
        else {
            return parent.getElementsByTagName(tag);
        }
    }

})() // End of Quicknr Hmenu
