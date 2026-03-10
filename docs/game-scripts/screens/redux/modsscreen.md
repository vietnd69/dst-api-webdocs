---
id: modsscreen
title: Modsscreen
description: Manages the mod configuration screen, handling UI layout, mod tab interaction, input controls, and apply/cancel actions for mod management in DST.
tags: [ui, modding, navigation]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 44e56f2d
system_scope: ui
---

# Modsscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ModsScreen` is a UI screen that provides the mod configuration interface in *Don't Starve Together*. It manages the layout of the mod tab (`ModsTab`), applies or cancels mod changes, displays workshop download status, and handles controller-focused navigation (including show/hide behavior for buttons). It integrates with helper widgets like `KitcoonPuppet`, `OnlineStatus`, and standard UI templates for buttons, backgrounds, and menus.

## Usage example
This component is instantiated internally by the frontend when entering the mods configuration screen. Direct instantiation by mods is not typical; however, a modder may subclass or extend it as needed:
```lua
-- This screen is created by the game and not usually instantiated directly by mods.
-- Example of accessing the component after screen push:
local mods_screen = TheFrontEnd:GetScreenStack()[1] -- if topmost is ModsScreen
if mods_screen and mods_screen:IsValid() then
    print("Mod changes pending:", mods_screen:IsDirty())
end
```

## Dependencies & tags
**Components used:** None identified (self-contained UI screen, no ECS components attached).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `dirty` | boolean | `false` | Indicates whether any mod configuration has been modified since the screen was opened. |
| `kit_puppet` | Widget | `KitcoonPuppet` instance | Animated character puppet used as decorative UI. |
| `mods_page` | Widget | `ModsTab` instance | Main mod configuration tab. |
| `applybutton` | Widget | `StandardButton` | Button to apply mod changes. |
| `cancelbutton` | Widget | `BackButton` | Button to cancel and return to previous screen. |
| `workshop_indicator` | Widget or `nil` | `nil` | Refers to active downloading indicator widget, if visible. |

## Main functions
### `OnControl(control, down)`
* **Description:** Handles input events (keyboard/controller) for navigation and actions (cancel, apply, clean all, update all).  
* **Parameters:**  
  - `control` (number) — Control constant (e.g., `CONTROL_CANCEL`, `CONTROL_MENU_START`).  
  - `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).  
* **Returns:** `true` if the control was handled; otherwise, defers to base class.  
* **Error states:** Does not error; silently ignores controls not pressed (e.g., `down == false`).

### `BuildModsMenu(menu_items, subscreener)`
* **Description:** Creates and positions the standard mod menu UI (client/server mod lists) using templates. Used internally by `ModsTab`.  
* **Parameters:**  
  - `menu_items` (table) — List of menu item definitions.  
  - `subscreener` (table) — Object used to store titles and behavior hooks for the menu.  
* **Returns:** `Widget` — The constructed menu widget.  

### `RepositionModsButtonMenu(allmodsmenu, selectedmodmenu)`
* **Description:** Positions and conditionally hides the mod button menus for controller navigation.  
* **Parameters:**  
  - `allmodsmenu` (Widget) — The menu listing all available mods.  
  - `selectedmodmenu` (Widget) — The menu listing selected mods.  
* **Returns:** Nothing.

### `ShowWorkshopDownloadingNotification()`
* **Description:** Shows a visual download-indicator overlay with rotating icon and text when mods are downloading. Does nothing if indicator is already visible.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `RemoveWorkshopDownloadingNotification()`
* **Description:** Removes the workshop download indicator widget if present.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `DirtyFromMods(_)`
* **Description:** Event handler to mark the screen as dirty (pending changes) when mod tab signals modification.  
* **Parameters:** `_` — Unused argument.  
* **Returns:** Nothing.

### `MakeDirty()`, `MakeClean()`, `IsDirty()`
* **Description:** Mark or query whether the mod configuration has unsaved changes.  
* **Parameters:** None.  
* **Returns:**  
  - `MakeDirty()` / `MakeClean()` — Nothing.  
  - `IsDirty()` — `true` if mod changes are pending; otherwise `false`.

### `Cancel()`
* **Description:** Handles cancel action: shows confirmation dialog if dirty, otherwise fades out and calls `mods_page:Cancel()`.  
* **Parameters:** None.  
* **Returns:** Nothing.  
* **Error states:** If dirty, user must choose to commit or discard changes via the dialog. No crash if called multiple times.

### `Apply()`
* **Description:** Triggers mod application, which restarts the simulation. Calls `mods_page:Apply(true)`.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `OnDestroy()`
* **Description:** Cleanup hook called when screen is destroyed. Delegates cleanup to `mods_page`.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `OnBecomeActive()` / `OnBecomeInactive()`
* **Description:** Enables/disables `kit_puppet` animation when the screen becomes active or inactive.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `GetHelpText()`
* **Description:** Returns localized, context-aware help text showing current control bindings and actions available.  
* **Parameters:** None.  
* **Returns:** `string` — Concatenated help text (e.g., `"ESC Back  A Clean All  B Update All  X Apply"`).

### `DoFocusHookups()`
* **Description:** Configures keyboard/controller focus navigation between `mods_page`, `applybutton`, and `cancelbutton`. Hides buttons when a controller is attached.  
* **Parameters:** None.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `dirtyfrommods` — Listens via `self:ListenForEvent("dirtyfrommods", self.DirtyFromMods, self)` (inferred from pattern in DST, though explicit listener not visible in this file snippet).
- **Pushes:** None identified.