# Quicknr-Interface

Javascript and CSS interface widgets for web pages and web apps
-----------------

A lighter alternative to Bootstrap, does not depend on jQuery

Documentation is presently available only as a comment block at the top of the "js/qnr-interface.js" file.

GPL licensed. The package includes fonts based on work by others, namely Iconic and Font Awesome.

Included widgets are:

1. **Arrow Anim**

  Animated arrow for pointing down, up, left or right. Usually down, on a landing page with a full-page hero image or carousel

2. **Font Resize**

  Resizes the font of the element, usually BODY, in step with changes in the total screen area

3. **Responsive**

  Makes a row of DIVs responsively adjust to screen width

4. **Carousel**

  Fully featured carousel, the centrepiece of the package, with many options

5. **Stickybar**

  A bar lower on the page than the top, that on scrolling the page down, will stick to the top of the page

6. **Slider**

  Non-looping introductory slider, can be used with just one slide for an animated reveal of the element

7. **Image Animator**

  Non-looping introductory image animator, that can zoom images for a fake moving appearance, and accepts an overlay object

8. **Navigator Menu**

  Simple collapsible menu that automatically responds to changes in screen width

9. **Scroller**

  Parallax scrolling widget

10. **Winscroller**

  Any clickable object can be made a winscroller, animatedly scrolling the page to a target object. On the BODY tag, will create a "return to top" arrow on the bottom right of the window

11. **X Icon**

  Close icon that can be applied to objects for hiding or removing them from the page

12. **Accordion**

  Clickable questions that reveal answers

In addition, since version 1.2.0, a separate widget, hierarchical menu, has been added. The menu is separately deployable because most websites will not require it. The "js/qnr-hmenu.js" and "css/qnr-hmenu.css" can be linked to in the HTML file just like the "js/qnr-interface.js" and "css/qnr-interface.css" files. The menu widget likewise depends on the font used by the package. Some utility code from the interface files is duplicated in the hmenu files, so that they can work independently (but can also be used togther). The hierarchical menu is presently not compatible with the collapsing navbar widget in the interface package.

Change Log
----------

Version 1.3.0 - 4 December 2016

  Library functions moved into global namespace in qnr-interface.js

  Hierarchical menu widget improved:
    * Submenus may now be aligned to the top of their parent submenus
    * Quick stray mouse movements are now tolerated with a delay before closing of menus
    * "Idle" menu items (titles and spacers) are now supported
    * qnr-hmenu.js now depends on global functions in qnr-interface.js

Version 1.2.0 - 21 November 2016

  Hierarchical menu widget added as a separately useable part of the package.

Version 1.1.0 - 17 November 2016

  Carousel handling of fast user navigation improved and a new fading control added.

Version 1.0.0 - 15 November 2016

  Initial release.
