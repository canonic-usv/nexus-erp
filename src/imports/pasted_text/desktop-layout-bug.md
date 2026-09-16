**CRITICAL DESKTOP LAYOUT BUG — SIDEBAR CAUSES MAIN CONTENT TO DISAPPEAR**

There is a responsive layout bug in the application.

### CURRENT BEHAVIOUR

* On mobile/responsive view:

  * The left sidebar is hidden.
  * The main page content displays correctly.
  * All content, cards, tables, forms and sections are visible.

* On desktop/larger screens:

  * The left sidebar becomes visible.
  * The main page content disappears completely or becomes invisible.
  * This indicates that the sidebar/layout interaction is causing the main content to be hidden, collapsed, covered, or positioned outside the viewport.

### DO NOT REDESIGN THE APPLICATION.

Do not change the existing UI, colors, typography, components, routes, business logic or features.

Fix ONLY the underlying desktop layout/rendering problem.

### DEBUG THE LAYOUT STRUCTURE

Inspect the application's main layout hierarchy, especially the relationship between:

`Sidebar → Main Layout → Main Content → Page Content`

Determine exactly why the content disappears when the sidebar is displayed.

Check for the following:

1. **Sidebar positioning**

   * Is the sidebar `fixed`, `absolute`, or `sticky`?
   * Is it covering the main content?
   * Does it have an unexpectedly large width?
   * Does it have an excessive `z-index`?

2. **Main content width**

   * Check whether the main content has:

     * `width: 0`
     * `max-width` restrictions
     * `w-0`
     * `hidden`
     * `flex-1` not working correctly
     * incorrect `calc()` values
     * excessive left/right margins
   * Ensure the main content can occupy the remaining viewport width after the sidebar.

3. **Flex layout**
   If the layout uses something similar to:

   `Sidebar + Main Content`

   verify that the parent is correctly configured.

   The intended structure should behave conceptually like:

   `Desktop`
   `[ Sidebar ][ Main Content ---------------- ]`

   and NOT:

   `[ Sidebar ][ collapsed/hidden Main Content ]`

4. **Grid layout**
   If CSS Grid is being used, check whether the desktop grid definition is creating a zero-width or invalid column.

5. **Margin/padding**
   Check whether the main content has a desktop-specific `margin-left`, `padding-left`, or positioning rule that moves it underneath or beyond the sidebar.

6. **Overflow**
   Check all parent containers for:

   `overflow-hidden`

   `overflow-x-hidden`

   `overflow-y-hidden`

   Make sure the main content is not being clipped when the sidebar is visible.

7. **Positioning**
   Check for:

   `position: absolute`

   `position: fixed`

   `left`

   `right`

   `transform`

   `translate`

   especially on the main content wrapper.

8. **Responsive classes**
   Search specifically for desktop breakpoint classes such as:

   `md:hidden`
   `lg:hidden`
   `xl:hidden`
   `md:flex`
   `lg:flex`
   `lg:block`
   `lg:ml-*`
   `lg:w-*`
   `lg:grid-*`

   Find any rule that causes the main content to disappear specifically when the sidebar appears.

9. **z-index/layering**
   Verify whether the content is actually rendered in the DOM but hidden behind the sidebar or another desktop-only overlay.

10. **Height**
    Check for desktop-specific fixed heights such as:

    `h-screen`
    `h-full`
    `max-h-screen`
    `overflow-hidden`

    Ensure the page content can still scroll vertically.

### IMPORTANT DIAGNOSTIC TEST

Temporarily hide the sidebar on desktop WITHOUT changing anything else.

If the main content immediately reappears, confirm that the problem is definitively within the sidebar/main-content layout relationship.

Then fix the underlying layout rather than keeping the sidebar hidden.

### DESIRED DESKTOP STRUCTURE

The desktop application should use a layout equivalent to:

* Full viewport/container
* Fixed or persistent left sidebar with its existing width
* Main content occupying the remaining horizontal space
* Main content independently scrollable if required
* No overlap between sidebar and main content
* No horizontal overflow
* No content hidden behind the sidebar

Conceptually:

`┌──────────────┬────────────────────────────────────┐`
`│              │                                    │`
`│   SIDEBAR    │          MAIN CONTENT              │`
`│              │                                    │`
`│              │          PAGE CONTENT              │`
`│              │                                    │`
`└──────────────┴────────────────────────────────────┘`

### DO NOT USE A QUICK HACK

Do not simply add:

`display: block !important`

or

`z-index: 9999`

or randomly increase widths/heights.

Find the actual root cause in the layout.

### FINAL REQUIREMENT

After fixing:

1. Verify mobile view still works.
2. Verify tablet view still works.
3. Verify desktop view with sidebar visible.
4. Verify 1024px, 1280px, 1440px and 1920px widths.
5. Verify the main content is visible and occupies the available space beside the sidebar.
6. Verify vertical scrolling works.
7. Verify no existing functionality has been removed.

Report the exact component and CSS/layout rule responsible for the issue before applying the fix.
