---
id: crafttabs
title: Crafttabs
description: Manages the crafting interface tabs and recipe filtering for the player's inventory crafting system.
tags: [ui, crafting, inventory]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 942ee0b8
system_scope: ui
---

# Crafttabs

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CraftTabs` is a UI widget component that manages the tabs and recipe display for the player's crafting interface. It creates and maintains tab groups (e.g., "Tools", "Weapons", "Crafting Stations"), integrates with input systems for mouse and controller navigation, and dynamically updates recipe availability and tab states (e.g., highlights, overlays) based on the owner's builder component and inventory. The component supports both standard and Quagmire-specific game modes, adapting layout and behavior accordingly.

## Usage example
```lua
local owner = ThePlayer
local crafttabs = AddChild(CraftTabs(owner, TheFrontEnd:GetRootWidget()))
crafttabs:Show()
crafttabs:UpdateRecipes()
```

## Dependencies & tags
**Components used:** `builder` (via `self.owner.replica.builder`)
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity (typically the player) the crafting interface belongs to. |
| `isquagmire` | boolean | `false` | Whether the game mode is Quagmire. |
| `crafting` | MouseCrafting widget | `nil` | The mouse-based recipe crafting widget. |
| `controllercrafting` | ControllerCrafting widget | `nil` | The controller-based recipe crafting widget. |
| `tabs` | TabGroup widget | `nil` | The tab group managing tab buttons and selection. |
| `tabbyfilter` | table | `{}` | Map from recipe tab descriptors to tab widgets. |
| `craft_idx_by_tab` | table | `{}` | Stores the last selected recipe index per tab for state persistence. |
| `controllercraftingopen` | boolean | `false` | Whether the controller crafting interface is currently active. |
| `preventautoclose` | boolean | `nil` | Prevents the crafting interface from auto-closing on mouse movement. |
| `openhint` | Text widget | `nil` | Displays control hints (e.g., "Press B to open"). |
| `hint_update_check` | number | `HINT_UPDATE_INTERVAL` (2.0) | Timer for hint update scheduling. |
| `needtoupdate` | boolean | `false` | Flag indicating a recipe update is pending. |
| `base_scale` | number | `0.75` | Base scaling factor for the widget. |

## Main functions
### `Close()`
* **Description:** Closes both the mouse and controller crafting interfaces, hides recipe lists, and deselects all tabs.
* **Parameters:** None.
* **Returns:** Nothing.

### `OpenControllerCrafting()`
* **Description:** Opens the controller-specific crafting interface, closes the mouse interface, and sets autopaused state.
* **Parameters:** None.
* **Returns:** Nothing.

### `CloseControllerCrafting()`
* **Description:** Closes the controller crafting interface and resets autopaused state if open.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Handles UI updates, including periodic hint display, mouse-based autoclose logic, and deferred recipe updates.
* **Parameters:** `dt` (number) — delta time in seconds.
* **Returns:** Nothing.

### `OpenTab(idx)`
* **Description:** Opens the tab at the specified index.
* **Parameters:** `idx` (number) — index of the tab to open.
* **Returns:** Boolean — whether the tab was successfully opened.

### `GetCurrentIdx()`
* **Description:** Returns the index of the currently selected tab.
* **Parameters:** None.
* **Returns:** number or `nil` — selected tab index.

### `GetNextIdx()`
* **Description:** Returns the index of the next visible (shown) tab.
* **Parameters:** None.
* **Returns:** number or `nil` — next tab index.

### `GetPrevIdx()`
* **Description:** Returns the index of the previous visible (shown) tab.
* **Parameters:** None.
* **Returns:** number or `nil` — previous tab index.

### `GetFirstIdx()`
* **Description:** Returns the index of the first visible (shown) tab.
* **Parameters:** None.
* **Returns:** number or `nil` — first tab index.

### `IsCraftingOpen()`
* **Description:** Checks whether either the mouse or controller crafting interface is open.
* **Parameters:** None.
* **Returns:** boolean — `true` if either interface is active.

### `OnControl(control, down)`
* **Description:** Handles navigation controls (scroll forward/backward) to switch tabs when the crafting UI is focused.
* **Parameters:** 
  * `control` (CONTROL_*) — input control identifier.
  * `down` (boolean) — whether the control is pressed.
* **Returns:** boolean — `true` if the control was handled.

### `UpdateRecipes()`
* **Description:** Marks that recipe data has changed and schedules a deferred update via `DoUpdateRecipes`.
* **Parameters:** None.
* **Returns:** Nothing.

### `DoUpdateRecipes()`
* **Description:** Computes and applies recipe availability states to each tab (e.g., highlighting tabs with buildable recipes, overlay indicators for researchable recipes).
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
  * `healthdelta` — triggers recipe updates when health ingredient segments change.
  * `sanitydelta` — triggers recipe updates when sanity ingredient segments change.
  * `techtreechange`, `itemget`, `itemlose`, `newactiveitem`, `stacksizechange`, `unlockrecipe`, `refreshcrafting`, `refreshinventory` — triggers recipe updates when crafting context changes.
  * `serverpauseddirty` (on `TheWorld`) — triggers recipe updates when the world state changes.
  * `cancelrefreshcrafting` — cancels pending recipe updates.
  * `quagmire_shoptab` (Quagmire mode only) — activates or selects a specific tab via name.

- **Pushes:** None.