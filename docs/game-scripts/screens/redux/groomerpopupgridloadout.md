---
id: groomerpopupgridloadout
title: Groomerpopupgridloadout
description: Manages the UI screen for selecting and applying beefalo clothing loadouts in the groomer popup interface.
tags: [ui, loadout, beefalo]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 597ef730
system_scope: ui
---

# Groomerpopupgridloadout

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`GridGroomerPopupScreen` is a UI screen that presents a grid-based interface for selecting and applying beefalo clothing loadouts. It integrates with the `LoadoutSelect_beefalo` widget to manage skin selection for beefalo body parts (body, head, horn, feet, tail) and handles closing logic that reports changes back to the grooming system via `POPUPS.GROOMER`. The screen supports both mouse/keyboard and controller input, auto-hiding the menu when a controller is active.

## Usage example
```lua
local screen = GridGroomerPopupScreen(
    target_inst,
    owner_player,
    profile,
    recent_item_types,
    recent_item_ids,
    filter
)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** `profile` (via `self.profile`), `inventory` (via `TheInventory`), `net` (via `TheNet`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | entity | `nil` | The beefalo entity whose skins are being edited. |
| `owner_player` | entity | `nil` | The player who owns the loadout profile and skins. |
| `profile` | table | `nil` | Loadout profile object holding saved skin selections. |
| `filter` | function/table | `nil` | Optional filter used to restrict visible items. |
| `initial_skins` | table | `{}` | Snapshot of the beefalo's original skin IDs at screen open time. |
| `loadout` | LoadoutSelect_beefalo widget | `nil` | Widget responsible for skin selection UI and state. |
| `menu` | Menu widget | `nil` | Menu containing Cancel/Confirm buttons; hidden on controller. |
| `proot`, `root` | Widget | `nil` | Root UI containers for layout and scaling. |
| `previous_active_screen` | Screen | `nil` | Screen that was active before this one opened. |

## Main functions
### `:Close(cancel)`
*   **Description:** Commits the selected loadout (or cancels changes if `cancel` is `true`) and closes the screen. Validates skin ownership and YOTB event restrictions, then sends the final skin data to `POPUPS.GROOMER`.
*   **Parameters:** `cancel` (boolean) — if `true`, indicates the user cancelled instead of confirmed.
*   **Returns:** Nothing.
*   **Error states:** Skips invalid/unowned/non-YOTB-allowed skins by resetting them to `""`.

### `:Cancel()`
*   **Description:** Resets skin selection to the initial values and closes the screen in cancelled mode.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `:Reset()`
*   **Description:** Restores the loadout selection to `initial_skins` (i.e., discards unsaved changes).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `:GetTimestamp()`
*   **Description:** Computes the latest `modified_time` among all inventory items to detect if the inventory state changed during this session.
*   **Parameters:** None.
*   **Returns:** `number` — the highest inventory item modification timestamp.

### `:YOTB_event_check(name)`
*   **Description:** Checks whether a given skin (`name`) is allowed under the current YOTB event state. If the event is inactive, returns `true`; otherwise checks if the skin’s costume set is unlocked for the owner player.
*   **Parameters:** `name` (string) — the skin ID to check.
*   **Returns:** `boolean` — `true` if the skin is allowed, `false` otherwise.

### `:OnControl(control, down)`
*   **Description:** Handles keyboard/controller inputs (`CONTROL_CANCEL` and `CONTROL_MENU_START`). Plays a sound on valid button release.
*   **Parameters:**  
  `control` (enum) — the input control pressed (e.g., `CONTROL_CANCEL`).  
  `down` (boolean) — `true` if the control was pressed, `false` on release.
*   **Returns:** `boolean` — `true` if the event was handled.

### `:OnBecomeActive()`
*   **Description:** Called when the screen becomes active. Refreshes inventory data in all sub-screens and sets focus for controller users.

### `:OnDestroy()`
*   **Description:** Cleanup routine on screen close. Resets autopause, restores camera offset, and pops all screens tagged with `owned_by_wardrobe = true` after closing this one.

### `:OffsetServerPausedWidget(serverpausewidget)`
*   **Description:** Adjusts the position of the server-pause indicator widget for alignment with this screen’s offset.

### `:DoFocusHookups()`
*   **Description:** Configures directional focus navigation between the loadout grid and action menu (left/right movement).

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
(No events are registered via `inst:ListenForEvent` or fired via `inst:PushEvent` in this screen’s code.)