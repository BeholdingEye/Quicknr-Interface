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

13. **Hierarchical Menu**

  In addition, since version 1.2.0, a separate widget, hierarchical menu, has been added. The menu is separately deployable because most websites will not require it. However, the menu depends on the rest of the QI files, that must be linked to earlier in the HTML source code. The menu is presently not compatible with the collapsing navbar widget in the interface package.

14. **Aspect Keeper**

  New in version 1.5.0 is this widget, preserving the object's aspect ratio at different screen sizes. This helps prevent images and videos displaying "tall" when they should be "narrow", usually on mobile screens in portrait mode.

Change Log
----------

Version 1.5.0 - 4 March 2017

  * Navigator Menu now supports Hierarchical Menus as submenus, compatible with Wordpress menus when used with the QNRWP-A theme
  * Aspect Keeper widget added, keeping the object's aspect ratio at different screen sizes
  * Carousel slides may now be parrallax Scrollers as well
  * Many other fixes and improvements
  
Version 1.4.0 - 30 January 2017

  * Navigator Menu now works correctly on iPhone
  * Other small fixes and improvements
  
Version 1.3.1 - 4 December 2016

  README corrected.

Version 1.3.0 - 4 December 2016

  * Library functions moved into global namespace in qnr-interface.js
  * Carousel thumbs (selector circles) may now be set to be slide numbers
  * Styling of the thumbs is now by CSS, not Javascript
  * Glyphs for Skype and a phone have been added to the fonts and listed in CSS

  * Hierarchical menu widget improved:
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

