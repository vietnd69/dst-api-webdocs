---
id: skilltreewidget
title: SkillTreeWidget
description: UI widget that displays and manages the character skill tree interface with node selection, activation, and respec functionality.
tags: [ui, widget, skilltree, redux]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: widgets
source_hash: e5382b38
system_scope: ui
---

# SkillTreeWidget

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`SkillTreeWidget` is a UI widget that renders the character skill tree interface in the Redux menu system. It displays skill nodes, handles selection and activation, manages favor overlays (shadow/lunar), and provides respec functionality. The widget adapts its appearance based on whether it is viewed from the frontend or in-game, and whether the target is readonly (another player's tree).

## Usage example
```lua
local SkillTreeWidget = require "widgets/redux/skilltreewidget"

-- Create widget for local player's skill tree
local targetdata = {
    userid = ThePlayer.userid,
    inst = ThePlayer,
    skillselection = {},
    prefab = "wilson"
}
local widget = SkillTreeWidget("wilson", targetdata, false)

-- Access selected skill
local selected = widget:GetSelectedSkill()

-- Clean up when done
widget:Kill()
```

## Dependencies & tags
**External dependencies:**
- `widgets/image` -- background and overlay images
- `widgets/imagebutton` -- interactive buttons (activate, respec)
- `widgets/widget` -- base widget class extended by this widget
- `widgets/text` -- text labels for titles, descriptions, buttons
- `widgets/redux/templates` -- StandardButton template for respec button
- `prefabs/skilltree_defs` -- skill tree definitions and metadata
- `widgets/redux/skilltreebuilder` -- builds the actual skill tree node structure
- `widgets/uianim` -- animated favor overlay (shadow/lunar effects)
- `util` -- utility functions

**Components used:**
- None identified (UI widget, not an entity component)

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fromfrontend` | boolean | `nil` | Whether the widget is being displayed from the frontend menu. |
| `targetdata` | table | `nil` | Data about the target character including userid, inst, skillselection, prefab. |
| `target` | string | `nil` | The prefab name of the character whose skill tree is displayed. |
| `root` | Widget | `nil` | Root widget container for all skill tree UI elements. |
| `midlay` | Widget | `nil` | Middle layer widget for favor overlay effects. |
| `bg_tree` | Image | `nil` | Background image for the skill tree. |
| `readonly` | boolean | `false` | Whether the skill tree is read-only (viewing another player's tree). |
| `default_focus` | Widget | `nil` | The default focus widget for controller navigation. |

## Main functions
### `SkillTreeWidget(prefabname, targetdata, fromfrontend)`
* **Description:** Constructor that initializes the skill tree widget. Sets up background images, info panel, tree builder, scroll overlays, and favor effects. Determines readonly status based on whether the target matches the local player.
* **Parameters:**
  - `prefabname` -- string character prefab name
  - `targetdata` -- table containing userid, inst, skillselection, prefab fields
  - `fromfrontend` -- boolean indicating if called from frontend menu
* **Returns:** SkillTreeWidget instance
* **Error states:** Errors if skill tree background atlas cannot be found and no fallback is available (assert in dev branch when dimensions mismatch).

### `RespecSkills()`
* **Description:** Resets all skills for the target character to their default state. Plays respec sound effect and refreshes the tree display to show reset state.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `TheSkillTree` global is nil or does not have `RespecSkills` method.

### `SpawnFavorOverlay(pre)`
* **Description:** Creates and displays the favor overlay animation (shadow or lunar) based on activated skills. Plays appropriate sound effect and sets up animation twitch behavior.
* **Parameters:** `pre` -- boolean whether to play pre-animation before idle
* **Returns:** None
* **Error states:** Errors if `skilltreedefs.FN.CountTags` is nil or favor build/bank does not exist in UIAnim.

### `Kill()`
* **Description:** Cleans up the widget by killing the tree builder and calling base widget Kill method. Should be called when the widget is no longer needed.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.root.tree` is nil when `Kill()` is called on it.

### `OnControl(control, down)`
* **Description:** Handles controller and keyboard input for the skill tree. Supports respec via CONTROL_MENU_MISC_2 and skill activation via CONTROL_ACTION when a skill is selected and activatable.
* **Parameters:**
  - `control` -- number control ID from TheInput
  - `down` -- boolean whether the control is pressed down or released
* **Returns:** `true` if control was handled, `false` otherwise
* **Error states:** Errors if `TheInput:GetControllerID()` returns nil when controller is attached.

### `GetSelectedSkill()`
* **Description:** Returns the currently selected skill node from the tree builder.
* **Parameters:** None
* **Returns:** Skill node data or `nil` if no skill is selected
* **Error states:** Errors if `self.root.tree` is nil or does not have `GetSelectedSkill` method.

### `GetHelpText()`
* **Description:** Returns localized help text showing available control bindings for the skill tree interface.
* **Parameters:** None
* **Returns:** String containing control hints, or empty string if no hints available
* **Error states:** Errors if `TheInput:GetControllerID()` or `TheInput:GetLocalizedControl()` returns nil.

## Events & listeners
- **Listens to:** `onaddskillxp_client` on ThePlayer -- refreshes the tree when skill XP is added
- **Pushes:** `newskillpointupdated` on ThePlayer -- fired during construction if not readonly and ThePlayer exists