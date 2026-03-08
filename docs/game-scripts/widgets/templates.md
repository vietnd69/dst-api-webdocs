---
id: templates
title: Templates
description: Provides reusable UI template functions for constructing frontend screens, including backgrounds, panels, navigation elements, and interactive widgets.
tags: [ui, frontend, templates, layout]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: ab100e05
system_scope: ui
---

# Templates

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`TEMPLATES` is a collection of factory functions that generate reusable UI widget structures for the game's frontend. These functions abstract common UI layout patterns—such as animated portal backgrounds, centered panels with ornate frames, navigation bars, buttons, and text-field variants—into modular, parameterized builders. The templates rely on core widget classes (`Widget`, `Text`, `Button`, `UIAnim`, `NineSlice`, etc.) and are designed to be added as children to screen instances. They do not implement game logic but provide consistent presentation layers for menus and frontend overlays.

## Usage example
```lua
-- Create an animated portal background and foreground
local root = Widget("root")
local bg = TEMPLATES.AnimatedPortalBackground()
local fg = TEMPLATES.AnimatedPortalForeground()
root:AddChild(bg)
root:AddChild(fg)

-- Add a centered panel with a title and navigation bar
local panel = TEMPLATES.CenterPanel(1, 1)
panel.title = panel:AddChild(Text(TITLEFONT, 45, "My Screen Title"))
panel.title:SetPosition(0, 180)
root:AddChild(panel)

-- Add a navigation bar with buttons
local nav = TEMPLATES.NavBarWithScreenTitle("Options", "medium")
nav:AddChild(TEMPLATES.NavBarButton(0, "Back", function() root:Kill() end))
root:AddChild(nav)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  
Note: This module is self-contained and only references other widgets (not entity components). It does not interact with the ECS or manipulate entity tags.

## Properties
No public properties  
Note: This module exposes only functions, not instance-level properties.

## Main functions
### `NoPortalBackground()`
*   **Description:** Constructs a static background composite with a background plate, foreground plate, and trees. Intended for screens without a dynamic portal.
*   **Parameters:** None.
*   **Returns:** `Widget` – the root background container.
*   **Error states:** None.

### `AnimatedPortalBackground()`
*   **Description:** Constructs a dynamic background with an animated portal, smoke/mist effects, and a hook (`EnableSmoke`) to toggle smoke visibility. Smoke is automatically disabled in low-graphics modes.
*   **Parameters:** None.
*   **Returns:** `Widget` – the root background container with `anim_root`, `plate`, and optional `EnableSmoke` method.
*   **Error states:** Returns early with no smoke if `TheSim:IsNetbookMode()` or `IsSmallTexturesMode()` is true.

### `BackgroundPlate()`
*   **Description:** Builds the static background plate image used in `AnimatedPortalBackground`.
*   **Parameters:** None.
*   **Returns:** `Widget` – the background plate root widget.

### `BackgroundSmoke()`
*   **Description:** Builds the background smoke animation entity.
*   **Parameters:** None.
*   **Returns:** `UIAnim` – the smoke animation widget.

### `BackgroundPortal()`
*   **Description:** Builds the animated portal entity.
*   **Parameters:** None.
*   **Returns:** `UIAnim` – the portal animation widget.

### `BackgroundSpiral()`
*   **Description:** Creates a full-screen spiral background image with tinting.
*   **Parameters:** None.
*   **Returns:** `Image` – the spiral texture widget.

### `BackgroundVignette()`
*   **Description:** Creates a full-screen vignette overlay image.
*   **Parameters:** None.
*   **Returns:** `Image` – the vignette texture widget.

### `BackgroundTint(a, rgb)`
*   **Description:** Creates a full-screen tinted square overlay. Default values: `a = 0.75`, `rgb = {0, 0, 0}` (black).
*   **Parameters:**  
    - `a` (number, optional) – alpha value (0–1).  
    - `rgb` (table, optional) – `{r, g, b}` color components (0–1).
*   **Returns:** `Image` – the tinted overlay widget.

### `LeftGradient()` / `RightGradient()`
*   **Description:** Builds side-menu gradient backgrounds for left and right screen edges, respectively.
*   **Parameters:** None.
*   **Returns:** `Widget` – root container with gradient image.
*   **Error states:** None.

### `AnimatedPortalForeground()`
*   **Description:** Constructs a dynamic foreground composite with plates, smoke, trees, and a `character_root` for entity placement. Supports event-specific perds (YOTG) and snow. Includes `EnableSmoke` and `EnableSnowfall` hooks.
*   **Parameters:** None.
*   **Returns:** `Widget` – the root foreground container.
*   **Error states:** Smoke is automatically disabled in low-graphics modes.

### `ForegroundPlate()`
*   **Description:** Builds the static foreground plate image.
*   **Parameters:** None.
*   **Returns:** `Widget` – the foreground plate root widget.

### `ForegroundSmokeWest/East/South/Inside()`
*   **Description:** Builds individual smoke animations for specific directions/regions.
*   **Parameters:** None.
*   **Returns:** `UIAnim` – smoke animation widget per function.
*   **Error states:** None.

### `ForegroundTrees()`
*   **Description:** Builds the foreground tree layer with dynamic scaling to match screen width.
*   **Parameters:** None.
*   **Returns:** `Widget` – the tree layer root widget.

### `ForegroundLetterbox()`
*   **Description:** Dynamically adjusts black letterbox bars (top, bottom, left, right) based on screen resolution and aspect ratio.
*   **Parameters:** None.
*   **Returns:** `Widget` – the letterbox root widget with `OnUpdate` hook.
*   **Error states:** None.

### `ForegroundPerdFront/back()`
*   **Description:** Builds event-specific frontend perds (animals) with animation control (`StartPerds`, `StopPerds`). Requires the back perd as a parameter for `ForegroundPerdFront`.
*   **Parameters:**  
    - `back` (Widget, optional for `ForegroundPerdFront`) – the back perd widget.
*   **Returns:** `Widget` – perd container widget.
*   **Error states:** None.

### `CurlyWindow(sizeX, sizeY, scaleX, scaleY, topCrownOffset, bottomCrownOffset, xOffset)`
*   **Description:** Creates an ornate nine-slice black frame with optional crowns and scaling.
*   **Parameters:**  
    - `sizeX`, `sizeY` (number, optional) – dimensions (default: `200, 200`).  
    - `scaleX`, `scaleY` (number, optional) – scale (default: `1`).  
    - Crown offsets (number, optional).
*   **Returns:** `NineSlice` – the frame widget.

### `CenterPanel(...)`
*   **Description:** Builds a detailed panel with ornate frame, paper texture fill, and configurable positioning/scales. Supports modern nine-slice frame.
*   **Parameters:**  
    - Frame/background scales, positions, and crown offsets (all optional).  
    - `skipPos` (boolean) – if true, skips default panel positioning.
*   **Returns:** `Widget` – the panel container.

### `CenterPanelOld(...)`
*   **Description:** Builds an older, non-nine-slice version of the `CenterPanel`.
*   **Parameters:** Similar to `CenterPanel` but with fixed frame structure.
*   **Returns:** `Widget` – the panel container.

### `NavBarWithScreenTitle(title, height)`
*   **Description:** Creates a navigation bar container with a title and background, supporting short (2), medium (3), or tall (5) button layouts.
*   **Parameters:**  
    - `title` (string) – display title.  
    - `height` (string) – one of `"short"`, `"medium"`, `"tall"`.
*   **Returns:** `Widget` – the navigation bar container.

### `NavBarButton(yPos, buttonText, onclick, truncate)`
*   **Description:** Creates a navigation button for use in a nav bar. Supports hover/focus states and text truncation.
*   **Parameters:**  
    - `yPos` (number) – vertical position.  
    - `buttonText` (string) – label text.  
    - `onclick` (function) – callback on selection.  
    - `truncate` (boolean) – whether to truncate text.
*   **Returns:** `Button` – the navigation button widget.

### `TabButton(xPos, yPos, buttonText, onclick, tabSize)`
*   **Description:** Creates a tab button (large/small) for switching views.
*   **Parameters:**  
    - `xPos`, `yPos` (number) – position.  
    - `buttonText` (string) – label.  
    - `onclick` (function) – callback.  
    - `tabSize` (string) – `"large"` or `"small"`.
*   **Returns:** `ImageButton` – the tab button widget.

### `BackButton(onclick, txt, txt_offset, shadow_offset, scale)`
*   **Description:** Creates a reusable back/cancel button with arrow icon and optional text.
*   **Parameters:**  
    - `onclick` (function) – callback.  
    - `txt` (string, optional) – label text.  
    - `txt_offset`, `shadow_offset` (table, optional) – text position adjustments.  
    - `scale` (number, optional) – base scale.
*   **Returns:** `ImageButton` – the back button widget.

### `ServerDetailIcon(iconAtlas, iconTexture, bgColor, hoverText, textinfo, imgOffset, scaleX, scaleY)`
*   **Description:** Creates an icon container for server or mod details, with optional hover text and background color.
*   **Parameters:**  
    - `iconAtlas`, `iconTexture` (string) – icon assets.  
    - `bgColor` (string, optional) – background tint key (e.g., `"burnt"`).  
    - `hoverText` (string) – tooltip text.  
    - `textinfo` (table, optional) – text styling overrides.
*   **Returns:** `Widget` – the icon widget.

### `InvisibleButton(width, height, onclick, onfocus)`
*   **Description:** Creates a non-visual, clickable button region.
*   **Parameters:**  
    - `width`, `height` (number) – hitbox size.  
    - `onclick` (function) – callback.  
    - `onfocus` (function, optional) – focus callback.
*   **Returns:** `ImageButton` – invisible button widget.

### `IconButton(iconAtlas, iconTexture, labelText, sideLabel, alwaysShowLabel, onclick, textinfo, defaultTexture)`
*   **Description:** Creates a square icon button with optional text on the side or below.
*   **Parameters:**  
    - `iconAtlas`, `iconTexture` (string) – icon assets.  
    - `labelText` (string) – label text or tooltip.  
    - `sideLabel` (boolean) – if true, places text to the left.  
    - `alwaysShowLabel` (boolean) – if true, embeds label in button.  
    - `onclick` (function) – callback.  
    - `textinfo` (table) – text styling overrides.
*   **Returns:** `ImageButton` – the icon button widget.

### `Button(text, cb)` / `SmallButton(text, fontsize, scale, cb)`
*   **Description:** Standard and scaled-down text buttons for general use.
*   **Parameters:**  
    - `text`, `cb` (string, function) – label and callback.  
    - `fontsize`, `scale` (optional for `SmallButton`).
*   **Returns:** `ImageButton` – the button widget.

### `AnimTextButton(animname, states, scale, cb, text, size)`
*   **Description:** Creates a button using an animation file with text overlaid.
*   **Parameters:**  
    - `animname`, `states` (string) – animation file and states.  
    - `scale` (number) – size scale.  
    - `cb`, `text`, `size` (function, string, number) – callbacks and text styling.
*   **Returns:** `AnimButton` – the animated text button widget.

### `TextMenuItem(text, onClickFn)`
*   **Description:** Creates a context-menu item (e.g., for right-click menus) with a click handler.
*   **Parameters:**  
    - `text` (string) – label.  
    - `onClickFn` (function) – callback.
*   **Returns:** `Widget` – the menu item widget.

### `ModListItem(modname, modinfo, modstatus, isenabled)`
*   **Description:** Creates a mod list item for the Mods screen, displaying name, status, icon, and checkbox.
*   **Parameters:**  
    - `modname`, `modinfo` (string, table) – mod metadata.  
    - `modstatus` (string) – status key (e.g., `"WORKING_NORMALLY"`).  
    - `isenabled` (boolean).
*   **Returns:** `Widget` – the mod list item widget.

### `ModDLListItem(modname)`
*   **Description:** Creates a mod download list item.
*   **Parameters:** `modname` (string).
*   **Returns:** `Widget` – the download item widget.

### `LabelTextbox(labeltext, fieldtext, width_label, width_field, height, spacing, font, font_size, horiz_offset)`
*   **Description:** Creates a labeled text input field with label on the left.
*   **Parameters:**  
    - `labeltext`, `fieldtext` (string) – label and initial text.  
    - Dimensions, fonts, spacing, and offset (numbers/tables).
*   **Returns:** `Widget` – the label-textbox container.

### `LabelSpinner(labeltext, spinnerdata, width_label, width_spinner, height, spacing, font, font_size, horiz_offset)`
*   **Description:** Creates a labeled spinner control (dropdown/selection).
*   **Parameters:** Similar to `LabelTextbox`, with `spinnerdata`.
*   **Returns:** `Widget` – the label-spinner container.

### `LabelButton(labeltext, buttontext, width_label, width_button, height, spacing, font, font_size, horiz_offset)`
*   **Description:** Creates a labeled button control.
*   **Parameters:** Similar to `LabelTextbox`, with `buttontext`.
*   **Returns:** `Widget` – the label-button container.

### `MovingItem(name, slot_index, src_pos, dest_pos, start_scale, end_scale)`
*   **Description:** Creates an item animation for inventory movement effects. Includes a `Move(callbackfn)` method.
*   **Parameters:**  
    - `name` (string) – item name.  
    - `slot_index` (number) – target slot.  
    - `src_pos`, `dest_pos` (Vector3) – movement path.  
    - `start_scale`, `end_scale` (number) – scale animation.
*   **Returns:** `UIAnim` – the moving item widget.

### `ItemImageText(type, name, iconScale, font, textsize, string, colour, textwidth, image_offset)`
*   **Description:** Creates an item icon with descriptive text to the right.
*   **Parameters:**  
    - `type`, `name` (string) – item type and name.  
    - `iconScale` (number) – icon size.  
    - `font`, `textsize` (string/number) – text styling.  
    - `string`, `colour`, `textwidth`, `image_offset` (string/table/number).
*   **Returns:** `Widget` – the image-text widget.

### `Snowfall(fade_y_threshold, snowflake_chance, max_snowball_size, max_snowflake_size)`
*   **Description:** Creates a full-screen snow animation for seasonal events (e.g., Winter Feast). Supports `StartSnowfall`, `StopSnowfall`, and `EnableSnowfall` methods.
*   **Parameters:**  
    - `fade_y_threshold`, `snowflake_chance`, `max_snowball_size`, `max_snowflake_size` (numbers, optional).
*   **Returns:** `Widget` – the snowfall container widget.

## Events & listeners
None identified  
Note: This module does not register or push events; it generates UI widgets that may later handle events internally (e.g., `Button` callbacks).