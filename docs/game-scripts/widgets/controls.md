---
id: controls
title: Controls
description: Manages the player HUD, input feedback, map UI, crafting menu, and wheel-based controls for all player interactions in Don't Starve Together.
tags: [ui, player, input, hud, controls]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: cc9280af
system_scope: player
---

# Controls

> Based on game build **714014** | Last updated: 2026-03-08

## Overview

The `Controls` widget is the primary UI component responsible for managing player input feedback, HUD layout, action hints, map navigation, crafting menu, emote wheels, and context-sensitive control systems. It integrates with multiple components—including `playercontroller`, `placer`, `spellbook`, and `playeractionpicker`—to dynamically update on-screen prompts based on game state, equipped items, controller vs keyboard input, and world context (e.g., ghost mode, quagmire, lava arena). It also handles toast notifications, status displays, chat queues, and screen state transitions (e.g., crafting toggling, map opening).

## Usage example

```lua
local controls = CreateWidget(Controls, ThePlayer)
controls:SetHUDSize()
controls:ShowCrafting()
controls:ShowMap(world_pos)
controls:ManageToast(toast_widget, false)
controls:OnUpdate(dt)
```

## Dependencies & tags

**Components used:**
- `placer` (`GetDeployAction`, `can_build`)
- `playercontroller` (`CanLockTargets`, `GetControllerAttackTarget`, `GetControllerTarget`, `GetGroundUseAction`, `GetGroundUseSpecialAction`, `GetSceneItemControllerAction`, `HasAOETargeting`, `IsAOETargeting`, `IsAxisAlignedPlacement`, `IsControllerTargetLocked`, `IsMapControlsEnabled`, `controller_target`, `deployplacer`, `placer`)
- `spellbook` (`CanBeUsedBy`, `closeonexecute`)
- `easing`
- `containerwidget`
- `teamstatusbars`

**Tags:**
- `"playerghost"`
- `"usingmagiciantool"`
- `"upgrademoduleowner"`
- `"inspectable"`
- `"moving"`, `"idle"`, `"channeling"`
- `"boatbuilder"`
- `"floater"` (implied via `inventory:IsFloaterHeld()`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The player entity this HUD is attached to |
| `_scrnw`, `_scrnh` | number | `nil` | Initial screen width and height |
| `playeractionhint`, `playeractionhint_itemhighlight`, `attackhint`, `groundactionhint` | FollowText | `nil` | Context-sensitive action hint widgets |
| `blackoverlay` | Image | `nil` | Screen-darkening overlay widget |
| `containerroot_under`, `containerroot`, `containerroot_side_behind`, `containerroot_side` | ContainerWidget | `nil` | Nested HUD container widgets |
| `saving` | SavingIndicator | `nil` | Saving status indicator widget |
| `toastlocations` | table | `{}` | Table of 4 toast positions and slot state tracking |
| `toastitems` | table | `{}` | List of active toast widgets |
| `worldresettimer` | PlayerDeathNotification | `nil` | Death/respawn timer widget |
| `inv` | InventoryBar | `nil` | Main inventory bar widget |
| `sidepanel`, `status`, `secondary_status`, `clock`, `quagmire_hangriness`, `quagmire_notifications`, `teamstatus`, `votedialog` | Widget | `nil` | Optional widgets based on splitscreen/game mode |
| `chatqueue`, `chat_queue_root`, `networkchatqueue` | ChatQueue | `nil` | Chat queue widgets |
| `mapcontrols` | MapControls | `nil` | Map navigation controls widget |
| `mousefollow`, `hover` | Widget | `nil` | Helper widgets for mouse tracking |
| `craftingmenu`, `crafttabs` | CraftingMenu | `nil` | Crafting UI widgets |
| `commandwheelroot`, `spellwheel`, `commandwheel` | Wheel | `nil` | Wheel UI widgets |
| `emote_wheel_standing`, `emote_wheel_mounted` | Wheel | `nil` | Prebuilt emote wheel templates |
| `dismounthintdelay` | number | `0` | Delay timer for dismount hint suppression |
| `craftingandinventoryshown`, `craftingshown` | boolean | `false` | State flags for UI visibility |

## Main functions

### `Controls:ShowStatusNumbers()`
* **Description:** Shows numeric status indicators (health, hunger, sanity, etc.) on all active status displays (main, secondary, team).  
* **Parameters:** None.  
* **Returns:** None.  
* **Notes:** Assumes `self.teamstatus` and `self.secondary_status` exist conditionally.

### `Controls:ManageToast(toast, remove)`
* **Description:** Manages placement of toast notifications in predefined toast locations. Adds `toast` to first available slot or moves it if already present; if `remove = true`, releases its slot and collapses following toasts.  
* **Parameters:**  
  - `toast` — toast widget instance (e.g., `GiftItemToast`, `YotbToast`)  
  - `remove` — boolean: if `true`, removes `toast` and reassigns slots  
* **Returns:** None.  
* **Notes:** Relies on `self.toastlocations[i+1]` having a `.toast` property during collapse.

### `Controls:HideStatusNumbers()`
* **Description:** Hides numeric status indicators on all active status displays.  
* **Parameters:** None.  
* **Returns:** None.  
* **Notes:** Same conditional reliance as `ShowStatusNumbers()`.

### `Controls:SetDark(val)`
* **Description:** Shows or hides `self.blackoverlay` to darken the screen (e.g., during ghost mode or transitions).  
* **Parameters:**  
  - `val` — boolean: `true` shows, `false` hides the overlay  
* **Returns:** None.

### `Controls:SetGhostMode(isghost)`
* **Description:** Applies ghost mode visual styling to status displays and world reset timer.  
* **Parameters:**  
  - `isghost` — boolean indicating ghost state  
* **Returns:** None.

### `Controls:MakeScalingNodes()`
* **Description:** Creates and configures root container widgets (`topleft_root`, `topright_root`, `bottomleft_root`, `bottomright_root`) with proportional scaling, anchors, and max upscale limits. Overwrites container references with nested scale-aware roots.  
* **Parameters:** None.  
* **Returns:** None.

### `Controls:SetHUDSize()`
* **Description:** Applies HUD scaling to all container widgets, hover, mouse follower, command wheel, and desync indicator. Adjusts for split-screen and per-player crafting menu scaling. Fires `"refreshhudsize"` event.  
* **Parameters:** None.  
* **Returns:** None.

### `Controls:OnUpdate(dt)`
* **Description:** Main update loop for action hints, controller state, container cleanup, and emote/crafting/hint state. Dynamically builds and sets hint text for controller input (LMB/RMB/cycle actions), target hints, attack hints, ground hints, and dismount hints. Coordinates hint positioning.  
* **Parameters:**  
  - `dt` — delta time since last frame  
* **Returns:** None.  
* **Notes:**  
  - Requires `self.owner.components.playercontroller` and subcomponents (`placer`, `deployplacer`, `spellbook`, `playeractionpicker`, `IsAOETargeting`, etc.) to be valid.  
  - Uses `self.terraformplacer` (not initialized here — potential null reference).  
  - Relies on `STRINGS.UI.HUD.*`, `STRINGS.ACTIONS.*`, `EMOTE_TYPE.*`, `STRINGS.UI.COMMANDWHEEL.*`, `EMOTE_ITEMS`.

### `Controls:DelayControllerSpellWheelHint()`
* **Description:** Resets `self.dismounthintdelay` to `0.5`, temporarily suppressing the dismount hint after spell wheel usage.  
* **Parameters:** None.  
* **Returns:** None.

### `Controls:HighlightActionItem(itemIndex, itemInActions)`
* **Description:** Highlights a specific line of text in the action hint (e.g., selected item) by splitting hint text into two layers: base commands and highlighted text.  
* **Parameters:**  
  - `itemIndex` — 1-based index of the line to highlight  
  - `itemInActions` — boolean: if `true`, uses `self.playeractionhint`; otherwise `self.groundactionhint`  
* **Returns:** None.  
* **Notes:** Assumes `self.playeractionhint_itemhighlight` is visible; uses `NORMAL_TEXT_COLOUR`, `WET_TEXT_COLOUR`, and `string.split`.

### `Controls:ShowMap(world_position)`
* **Description:** Opens the appropriate map screen (QuagmireRecipeBookScreen in quagmire mode, MapScreen otherwise), closing status screens first. Optionally focuses the map on `world_position`.  
* **Parameters:**  
  - `world_position` — optional Vector3 world coordinates  
* **Returns:** None.

### `Controls:FocusMapOnWorldPosition(mapscreen, worldx, worldz)`
* **Description:** Offsets the map minimap to center on a world position, applying camera heading correction.  
* **Parameters:**  
  - `mapscreen` — MapScreen instance  
  - `worldx`, `worldz` — world X and Z coordinates  
* **Returns:** `nil` if `mapscreen` or minimap is `nil`.

### `Controls:HideMap()`
* **Description:** Closes the currently open map screen.  
* **Parameters:** None.  
* **Returns:** None.

### `Controls:ToggleMap()`
* **Description:** Toggles map screen visibility (closes if open, opens if not). Supports Quagmire-specific behavior.  
* **Parameters:** None.  
* **Returns:** None.

### `Controls:DoShowCrafting_Internal()`
* **Description:** Shows the crafting menu unless `no_crafting` game mode is active.  
* **Parameters:** None.  
* **Returns:** None.

### `Controls:DoHideCrafting_Internal()`
* **Description:** Closes and hides the crafting menu. Calls `HUD:CloseCrafting(true)`.  
* **Parameters:** None.  
* **Returns:** None.

### `Controls:ShowCrafting()`
* **Description:** Shows the crafting menu by setting `self.craftingshown = true` and calling `DoShowCrafting_Internal()`.  
* **Parameters:** None.  
* **Returns:** None.

### `Controls:HideCrafting()`
* **Description:** Hides the crafting menu by setting `self.craftingshown = false`, calling `DoHideCrafting_Internal()`, and invoking `self.inv:OnCraftingHidden()`.  
* **Parameters:** None.  
* **Returns:** None.

### `Controls:ShowCraftingAndInventory()`
* **Description:** Shows crafting menu, inventory bar, side containers (`containerroot_side`, `containerroot_side_behind`), and side inventory in secondary status; toggles toast widgets.  
* **Parameters:** None.  
* **Returns:** None.  
* **Notes:** Assumes `self.secondary_status.side_inv` exists with `Show()`/`Hide()` and `ToggleCrafting(bool)`.

### `Controls:HideCraftingAndInventory()`
* **Description:** Hides crafting menu, inventory bar, side containers, and side inventory; closes `self.spellwheel`.  
* **Parameters:** None.  
* **Returns:** None.

### `Controls:BuildEmoteWheel(character_name, emote_groups)`
* **Description:** Builds a nested emote wheel structure from `emote_groups`. Each group becomes a nested wheel with dynamic radius scaling if emote count > 8.  
* **Parameters:**  
  - `character_name` — string used to resolve emote atlas/image paths  
  - `emote_groups` — table mapping `EMOTE_TYPE.*` keys to `{ label, image, emotes = {...} }`  
* **Returns:** Table of wheel structures, each containing `{ label, atlas, normal, nestedwheel = {name, items, r, f} }`.

### `Controls:BuildCommandWheel(is_splitscreen)`
* **Description:** Configures `self.commandwheel` with emotes (nested), text chat, player list, user commands, invite (if enabled), and chat toggle. Applies scale based on `is_splitscreen`.  
* **Parameters:**  
  - `is_splitscreen` — boolean used to adjust command wheel scale  
* **Returns:** None.

## Events & listeners

* **Listens to `"seamlessplayerswap"`:** Calls `self:StopUpdating()`  
* **Listens to `"finishseamlessplayerswap"`:** If inventory visible, calls `self:ShowCraftingAndInventory()`  
* **Pushes `"refreshhudsize"`:** Fired in `SetHUDSize()` with `scale` as data