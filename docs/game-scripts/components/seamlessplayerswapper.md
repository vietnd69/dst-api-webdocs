---
id: seamlessplayerswapper
title: Seamlessplayerswapper
description: Manages seamless character prefab swapping for players without returning to character selection, preserving inventory, state, and clothing while migrating persistence data between characters.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 2ebfdda1
---

# Seamlessplayerswapper

## Overview
This component enables seamless character switching in Don't Starve Together—allowing players to change their active character prefab (e.g., via `DoMonkeyChange()` or `SwapBackToMainCharacter()`) without exiting to the character select screen. It preserves core state (inventory, tags, behavior state) by transferring it from the old character to the new one, and handles clothing, skin base, and special trait persistence (e.g., MIME tag, speech proxy). It also ensures proper cleanup of cursed items and coordinates the lifecycle of the transition on both the old and newly spawned entities.

## Dependencies & Tags
**Dependencies (via component access):**
- `inst.components.skinner` — for retrieving/applying clothing data
- `inst.components.inventory` — to locate and strip cursed items from the old player
- `inst.components.health` — to determine post-swap state (e.g., death state)
- `inst.components.talker` — to set speech proxy
- `inst.sg` (StateGraph) — to transition into appropriate post-swap state

**Tags managed:**
- Adds/removes `"mime"` tag conditionally during swap
- Removes `"applied_curse"` tag from cursed items during transition

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(passed in)* | The entity this component is attached to (a player). |
| `swap_data` | `table` | `{}` | Stores per-prefab clothing data (`skin_base`) for non-main characters during swapping *to* them. Cleared after use. |
| `main_data` | `table` | `{}` | Stores persistent main character state: `skin_base`, `prefab`, and optionally `mime`. Preserved across swaps *back* to main character. |

## Main Functions

### `_StartSwap(new_prefab)`
* **Description:** Core logic for initiating a seamless character swap. Saves current clothing, determines target prefab and `skin_base`, then delegates to `TheNet:SpawnSeamlessPlayerReplacement()` to trigger the actual swap. Handles both forward swaps (to a new prefab) and return to main character.
* **Parameters:**
  - `new_prefab` (`string?`): The target character prefab (e.g., `"wonkey"`). If `nil` or omitted, swaps back to the main character (restoring `self.main_data.prefab` or defaulting to `"wilson"`).

### `DoMonkeyChange()`
* **Description:** Convenience method to swap into the monkey character (`"wonkey"`).
* **Parameters:** None.

### `SwapBackToMainCharacter()`
* **Description:** Convenience method to swap back to the original/primary character.
* **Parameters:** None.

### `OnSeamlessCharacterSwap(old_player)`
* **Description:** Runs on the *newly created* player entity after the swap. Transfers gameplay state from the old player (inventory items, state graph, etc.), cleans up cursed items, hides/disables the old entity, applies special traits (e.g., MIME), and transitions to an appropriate state.
* **Parameters:**
  - `old_player` (`Entity`): The player entity that was swapped out.

### `PostTransformSetup()`
* **Description:** Applies post-swap configuration, including setting the MIME tag and speech proxy based on `main_data`.
* **Parameters:** None.

### `SaveForReroll()`
* **Description:** Generates data for temporary persistence (e.g., during rerolls or restarts) that includes current `swap_data` and current clothing.
* **Parameters:** None.
* **Returns:** `table?` — Either `{ swap_data = ... }` or `nil` if no swap-related data exists.

### `OnSave()`
* **Description:** Serializes full persistent state (including `swap_data` and `main_data`) for saving to disk.
* **Parameters:** None.
* **Returns:** `table?` — Composite save data or `nil` if empty.

### `OnLoad(data)`
* **Description:** Loads saved persistent state (`swap_data`, `main_data`) onto the component after instantiation.
* **Parameters:**
  - `data` (`table?`): Data saved via `OnSave()`.

## Events & Listeners
- **Events pushed by this component:**
  - `"ms_playerreroll"` — Pushed on the old player to trigger cleanup (e.g., remove world-bound effects).
  - `"ms_playerseamlessswaped"` — Pushed on the new player after full transition to apply final setup normally done at spawn.

- **Events listened for:**
  - *None identified.*