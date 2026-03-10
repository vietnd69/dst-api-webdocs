---
id: hermitcrabwardrobepopupgridloadout
title: GridHermitCrabWardrobePopupScreen
description: Manages the hermit crab wardrobe popup screen UI, handling skin selection, input, and integration with the inventory system.
tags: [ui, inventory, skin, loadout, hermitcrab]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 17dd3110
system_scope: ui
---

# GridHermitCrabWardrobePopupScreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`GridHermitCrabWardrobePopupScreen` is a UI screen component that displays a dedicated wardrobe interface for the hermit crab character, allowing players to select and preview skins. It integrates with the `LoadoutSelect_hermitcrab` widget for skin management and communicates with the inventory system to validate and apply skin choices. The screen manages focus navigation (including controller support), handles keyboard/controller input, and synchronizes state with the player's profile.

## Usage example
```lua
-- Typically instantiated via TheFrontEnd screen stack, e.g.:
local screen = GridHermitCrabWardrobePopupScreen(
    target_entity,
    owner_player,
    profile,
    recent_item_types,  -- e.g., from gift popup
    recent_item_ids,
    filter
)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** `inventory`, `net`, `camera`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | Entity or `nil` | `nil` | The hermit crab entity whose skin is being edited. |
| `owner_player` | Player entity | Required | The player entity who owns the wardrobe operation. |
| `profile` | Profile object | Required | Player profile used to persist skin selections. |
| `filter` | Function or `nil` | `nil` | Optional skin filtering function. |
| `initial_skins` | Table | `{ base = "hermitcrab_none" }` | Initial skin state copied from the target entity or defaults. |
| `loadout` | LoadoutSelect_hermitcrab widget | Required | Core widget for skin selection UI. |
| `menu` | Menu widget | Required | Contains CANCEL/SET buttons for player interaction. |
| `proot`, `root` | Widget | Required | UI hierarchy root widgets for layout and positioning. |

## Main functions
### `Cancel()`
* **Description:** Resets the current skin selection to the initial state and closes the screen with a cancel flag.
* **Parameters:** None.
* **Returns:** Nothing.

### `Close(cancel)`
* **Description:** Finalizes and closes the screen. Validates the selected skins, dispatches a `POPUPS.HERMITCRABWARDROBE` close event with the chosen skin data, and updates the collection timestamp. If `cancel` is true, the operation is aborted.
* **Parameters:** `cancel` (boolean) — indicates if the operation was cancelled.
* **Returns:** Nothing.
* **Error states:** If no valid skin ownership is detected (via `CheckOwnership`), `base` is reset to `{character}_none`.

### `Reset()`
* **Description:** Reverts the `loadout` selection to the initial skins.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetTimestamp()`
* **Description:** Computes and returns the latest `modified_time` from the player's inventory, used to track inventory freshness.
* **Parameters:** None.
* **Returns:** `number` — the latest inventory item modification timestamp.

### `OnControl(control, down)`
* **Description:** Handles controller and keyboard input. Processes `CONTROL_CANCEL` to trigger `Cancel()`, and `CONTROL_MENU_START` to trigger `Close()`.
* **Parameters:**  
  - `control` (string) — control identifier (e.g., `CONTROL_CANCEL`).  
  - `down` (boolean) — whether the control is pressed (`true`) or released (`false`).
* **Returns:** `boolean` — `true` if the control was handled; otherwise delegates to parent.

### `OnUpdate(dt)`
* **Description:** Delegates periodic updates to the `loadout` widget to refresh animations or UI state.
* **Parameters:** `dt` (number) — delta time in seconds.
* **Returns:** Nothing.

### `GetHelpText()`
* **Description:** Returns localized help text for keyboard/controller control mapping (e.g., "ESC Cancel", "Enter Set").
* **Parameters:** None.
* **Returns:** `string` — concatenated help text.

### `DoFocusHookups()`
* **Description:** Sets up bidirectional focus navigation between `loadout` (left) and `menu` (right) for keyboard/controller navigation.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** `HERMITCRABWARDROBE` close event with skin data and cancel flag.
- **Listens to:** None identified.