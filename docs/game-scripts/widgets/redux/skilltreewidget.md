---
id: skilltreewidget
title: Skilltreewidget
description: Renders and manages the interactive skill tree UI for a character, including tree rendering, activation, respec, and visual overlays.
tags: [ui, skilltree, character]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: c1225d33
system_scope: ui
---

# Skilltreewidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SkillTreeWidget` is a UI component responsible for rendering and managing the character skill tree interface. It creates the full visual layout—including background, info panel, skill tree, and activation/respec controls—and handles user interaction such as selecting skills, activating them, and performing a full respec. It interacts with the `TheSkillTree` global manager and uses `skilltreebuilder` to construct the tree, while also dynamically loading character-specific assets and overlays.

## Usage example
```lua
local widget = SkillTreeWidget("wickerbottom", {
    inst = ThePlayer,
    userid = ThePlayer.userid,
    prefab = "wickerbottom",
    skillselection = { ... }
}, false)

-- Add to a screen or modal
inst:AddChild(widget)
widget:Kill() -- Clean up when closing
```

## Dependencies & tags
**Components used:** None directly accessed via `inst.components.X`.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fromfrontend` | boolean | `nil` | Whether the widget is rendered from the frontend (e.g., character select) vs in-game. Affects tinting and interactivity. |
| `targetdata` | table | `nil` | Data object containing skill selection, prefab, and user ID. |
| `target` | string | `prefabname` or `targetdata.inst.prefab` | The prefab name of the character whose skill tree is being rendered. |
| `root` | Widget | `nil` | Root container widget holding all UI elements. |
| `readonly` | boolean | Derived from `targetdata.userid ~= ThePlayer.userid` | If `true`, disables editing (e.g., viewing another player's tree). |

## Main functions
### `RespecSkills()`
* **Description:** Resets the character's skill selection and plays the respec sound. Resets internal graphics state before refreshing the tree.
* **Parameters:** None.
* **Returns:** Nothing.

### `SpawnFavorOverlay(pre)`
* **Description:** Creates and plays a dynamic visual overlay (shadow or lunar) on top of the tree based on activated skills with the `shadow_favor` or `lunar_favor` tags. If `pre` is true, plays a short pre-animation followed by idle, and may trigger a random "twitch" animation on idle loop.
* **Parameters:** `pre` (boolean, optional) — whether to play the pre-animation (e.g., on first open).
* **Returns:** Nothing.

### `Kill()`
* **Description:** Cleans up the widget by terminating the underlying tree and calling parent cleanup.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input controls: `CONTROL_MENU_MISC_2` triggers respec (if visible), and `CONTROL_ACTION` activates the selected skill via the activate button's callback.
* **Parameters:**  
  - `control` (number) — Input control code.  
  - `down` (boolean) — Whether the control is pressed (`true`) or released (`false`).  
* **Returns:** `true` if the event was handled; `false` otherwise.

### `GetSelectedSkill()`
* **Description:** Returns the currently selected skill node in the tree.
* **Parameters:** None.
* **Returns:** string or `nil` — the skill ID if one is selected.

### `GetHelpText()`
* **Description:** Returns localized help text for the current context (e.g., controller key binding for respec).
* **Parameters:** None.
* **Returns:** string — concatenated help string (empty if no context applies).

## Events & listeners
- **Listens to:** `onaddskillxp_client` — triggers a full tree refresh via `self.root.tree:RefreshTree()` when the player gains skill XP.
- **Pushes:** `newskillpointupdated` — fired on instantiation when the local player owns the tree and `ThePlayer.new_skill_available_popup` is cleared.