---
id: skilltreebuilder
title: Skilltreebuilder
description: A UI widget responsible for constructing, rendering, and managing the skill tree interface, including button generation, focus navigation, and state updates for skill progression.
tags: [ui, skill, navigation, frontend, character]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 19093a46
system_scope: ui
---

# Skilltreebuilder

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SkillTreeBuilder` is a `Widget` subclass that dynamically builds and manages the skill tree UI panel for characters such as Wendy. It handles the creation of skill buttons, frames, focus navigation (for controller input), visual feedback for locked/activated skills, and integration with the skill tree state via `TheSkillTree` or `skilltreeupdater` components. It does not manage persistence or validation logic directly but relies on external components for state synchronization.

## Usage example
```lua
local skilltreebuilder = AddChildWidget("skilltreebuilder")
skilltreebuilder:CreateTree("wendy", nil, false) -- builds the skill tree for Wendy in edit mode
skilltreebuilder:RefreshTree() -- updates UI to reflect current skill state
```

## Dependencies & tags
**Components used:** `skilltreeupdater`, `TheSkillTree`, `ThePlayer`, `TheFrontEnd`, `TheInput`, `TheInventory`, `TheNet`, `TheSim`, `RESOLUTION_X`, `RESOLUTION_Y`, `UICOLOURS`, `HEADERFONT`, `TALKINGFONT`, `ANCHOR_LEFT`, `ANCHOR_TOP`, `ANCHOR_MIDDLE`, `ANCHOR_RIGHT`, `MOVE_UP`, `MOVE_DOWN`, `MOVE_LEFT`, `MOVE_RIGHT`, `TUNING.FIXME_DO_NOT_USE_FOR_MODS_NEW_MAX_XP_VALUE`, `STRINGS.SKILLTREE.*`, `STRINGS.CHARACTERS.WENDY.*`.  
**Tags:** None explicitly added/removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `skilltreewidget` | widget | `nil` | Reference to the parent skill tree widget container. |
| `fromfrontend` | boolean | `nil` | Whether the builder is used in frontend (read-only) or in-game (editable) context. |
| `skilltreedef` | table | `nil` | Skill tree definition table for the current character (loaded from `skilltreedefs`). |
| `skillgraphics` | table | `{}` | Map of `skill` names to button/frame and status data. |
| `buttongrid` | table | `{}` | Flat list of button metadata for navigation calculation. |
| `infopanel` | widget | `nil` | Reference to the info/activation panel used to display skill details and activation controls. |
| `selectedskill` | string | `nil` | Currently selected skill name (by controller or click). |
| `root` | widget | `nil` | Root container widget for all UI elements. |
| `target` | string | `nil` | Character prefab name being displayed (e.g., `"wendy"`). |
| `targetdata` | table | `nil` | Frontend-specific skill selection data used in read-only mode. |
| `readonly` | boolean | `nil` | Whether the tree is read-only (no activation allowed). |

## Main functions
### `CreateTree(prefabname, targetdata, readonly)`
*   **Description:** Initializes and builds the full skill tree UI for the specified character prefab. Loads the skill tree definition, generates panels and buttons, positions panels horizontally, and triggers initial UI refresh. Only spawns Wendy’s puck if the prefab is `"wendy"`.
*   **Parameters:** `prefabname` (string) — character prefab name; `targetdata` (table?) — frontend-only data; `readonly` (boolean) — if true, disables skill activation.
*   **Returns:** Nothing.

### `RefreshTree(skillschanged)`
*   **Description:** Updates all skill buttons and frames based on current activation/lock status, available skill points, and selected skill. Handles visual state transitions (locked/unlocked/activated/selectable), plays unlock FX/sounds, updates the XP display, and refreshes the infopanel content.
*   **Parameters:** `skillschanged` (boolean?) — if true, triggers `onskillschanged` callbacks on button decorations.
*   **Returns:** Nothing.

### `LearnSkill(skilltreeupdater, characterprefab)`
*   **Description:** Attempts to activate the currently selected skill. Validates activation eligibility (e.g., not locked for controller), calls the appropriate updater to activate it, plays activation FX and sound, optionally spawns a favor overlay for special skills, and triggers a UI refresh.
*   **Parameters:** `skilltreeupdater` (component or TheSkillTree) — component instance used to persist the skill activation; `characterprefab` (string) — character prefab name.
*   **Returns:** Nothing.

### `SpawnPuck()`
*   **Description:** Creates and configures Wendy’s moving puck UI element (used in controller mode for skill selection). Sets up easter egg dialogue behavior on idle.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdatePosition(x, y)`
*   **Description:** Updates the puck’s target position in local coordinates, clamped within the skill tree bounds.
*   **Parameters:** `x`, `y` (number) — screen-space coordinates from input.
*   **Returns:** Nothing.

### `PuckFollowMouse()`
*   **Description:** Begins tracking mouse movement to update the puck position in real time. Only runs if not using controller input.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Called per-frame to animate puck movement, handle idle timer for easter egg, and update puck position (controller or mouse). Implements smooth interpolation to target positions.
*   **Parameters:** `dt` (number) — delta time in seconds.
*   **Returns:** Nothing.

### `GetDefaultFocus()`
*   **Description:** Determines the default focused button for keyboard/controller navigation. Prioritizes buttons marked `defaultfocus`, otherwise selects the top-left-most button.
*   **Parameters:** None.
*   **Returns:** (widget?) — the default focus `ImageButton` or `nil`.

### `SetFocusChangeDirs()`
*   **Description:** Configures directional navigation (up/down/left/right) between skill buttons based on spatial proximity (grid-like layout). Uses `TILEUNIT` spacing and soft directional boosting.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Kill()`
*   **Description:** Cleans up resources, cancels easter egg tasks if active, and calls parent `Kill`.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — cleans up FX UIAnim instances after animation completes (in `LearnSkill`, `RefreshTree`).  
- **Pushes:** None directly.