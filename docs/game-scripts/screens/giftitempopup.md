---
id: giftitempopup
title: Giftitempopup
description: Displays a visual popup UI for presenting newly acquired skin gifts to the player, handling animations, sound, menu interaction, and skin application logic.
tags: [ui, skin, presentation]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 5efc17e9
system_scope: ui
---

# Giftitempopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`GiftItemPopUp` is a UI screen that presents a styled animation sequence when a player receives a new skin gift. It plays associated sound and visual effects, reveals the gift item's name and visual representation, and offers user options to either use the skin immediately or save it for later. It integrates with the HUD, inventory, and skin systems but does not manage persistent state or game logic directly.

## Usage example
The component is instantiated internally by the game and never manually added by mods. A typical invocation flow is:
```lua
-- This screen is typically created via TheFrontEnd:PushScreen() internally.
-- Example internal usage (not mod-facing):
local popup = GiftItemPopUp(player, {"swap_body_polo_blue_denim"}, {12345})
TheFrontEnd:PushScreen(popup)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `userdata` (player entity) | — | The player entity receiving the gift. |
| `item_types` | table of strings | — | List of skin identifiers (e.g., `"swap_body_polo_blue_denim"`). |
| `item_ids` | table of numbers or `nil` | `nil` | Optional inventory item IDs; used to mark items as opened. |
| `proot`, `root`, `spawn_portal`, `title`, `banner`, `name_text` | widgets | — | Internal widget nodes for UI layout. |
| `menu` | `Menu` or `nil` | `nil` | Options menu displayed after skin reveal. |
| `revealed_items` | table | `{}` | Tracks which item indices have been revealed. |
| `current_item` | number | `1` | Index of the item currently being revealed. |
| `show_menu` | boolean | `false` | Whether the menu buttons are currently visible. |
| `disable_use_now` | boolean | `false` | Whether the "Use Now" menu option should be disabled. |
| `reveal_skin`, `open_box` | boolean | `false` | State flags for animation sequencing. |
| `item_name` | string or `nil` | `nil` | Cached name of the currently revealed skin. |

## Main functions
### `RevealItem(idx)`
*   **Description:** Triggers the reveal animation for the item at the given index. Plays the activation and box-opening animations, configures the skin preview, shows the banner with the item name, and schedules display of the "Use Later"/"Use Now" menu after the animation sequence.
*   **Parameters:** `idx` (number) – 1-based index into `self.item_types` and `self.item_ids`.
*   **Returns:** Nothing.
*   **Error states:** Silently returns if `self.item_types[idx]` is `nil`.

### `ApplySkin()`
*   **Description:** Finalizes the screen flow by applying the revealed skin to the player, saving recent gifts in the HUD, and popping the screen from the frontend.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnClose()`
*   **Description:** Cancels the presentation, stops relevant sounds, plays the "skin out" animation, and hides the menu.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Controls animation-driven state transitions and sound playback. Handles looping idle sound during skin display, one-time sound on box opening, and automatic screen exit after the "skin_out" animation completes.
*   **Parameters:** `dt` (number) – Delta time since last frame.
*   **Returns:** Nothing.

### `ShowMenu()`
*   **Description:** Creates and displays the on-screen menu with "Use Later" and "Use Now" buttons. Only creates UI for keyboard input; controller input is handled via `OnControl`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles keyboard/controller input to trigger menu actions (close or apply skin) when the menu is active.
*   **Parameters:**  
  `control` (`number` – e.g., `CONTROL_CANCEL`, `CONTROL_PAUSE`)  
  `down` (`boolean`) – Whether the key/button is pressed down (`true`) or released (`false`).
*   **Returns:** `true` if the control was handled; otherwise delegates to parent.

### `GetHelpText()`
*   **Description:** Returns localized control hints for the active menu (e.g., "[ESC] Use Later").
*   **Parameters:** None.
*   **Returns:** `string` – Concatenated help text, or empty string if menu is not shown.

### `OnDestroy()`
*   **Description:** Cleans up on screen destruction: disables autopausing, removes screen offset, kills the idle sound, and invokes base cleanup.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified (no `inst:ListenForEvent()` calls are present).
- **Pushes:** None identified (no `inst:PushEvent()` calls are present).