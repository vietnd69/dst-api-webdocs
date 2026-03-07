---
id: seamlessplayerswapper
title: Seamlessplayerswapper
description: Handles seamless in-game player character transitions without exiting to character select, preserving inventory, tags, and clothing while updating prefabs.
tags: [player, inventory, network, transition]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2ebfdda1
system_scope: player
---
# Seamlessplayerswapper

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Seamlessplayerswapper` enables in-game character swaps (e.g., via monkey box) by transferring a player's state—including inventory, health, tags, clothing, and persistence data—to a new prefab instance—without returning to the character selection screen. It works in conjunction with `TheNet:SpawnSeamlessPlayerReplacement` for network synchronization, and maintains continuity of game state across the transition.

The component interacts with:
- `skinner` to capture and restore clothing/skin data.
- `inventory` to find and uncurse items.
- `health` to check for death state post-swap.
- `talker` to preserve speech proxy.
- `curseditem` to clear curse associations on transition.

## Usage example
```lua
-- Example: Trigger a seamless swap to "wonkey" (e.g., via monkey box)
inst.components.seamlessplayerswapper:DoMonkeyChange()

-- Example: Restore the original character (e.g., via cancel button)
inst.components.seamlessplayerswapper:SwapBackToMainCharacter()

-- Example: After spawn, load saved seamless swap data
if data.seamlessplayerswapper then
    inst.components.seamlessplayerswapper:OnLoad(data.seamlessplayerswapper)
end
```

## Dependencies & tags
**Components used:** `skinner`, `inventory`, `health`, `talker`, `curseditem`  
**Tags:** Adds `mime` conditionally (via `PostTransformSetup`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `swap_data` | table | `{}` | Stores clothing/skin data for *other* prefabs (keyed by prefab name) that the player may swap *to* from the current character. |
| `main_data` | table | `{}` | Stores original character's clothing (`skin_base`) and `prefab` name (used when swapping back), and optionally `mime` flag. |

## Main functions
### `_StartSwap(new_prefab)`
* **Description:** Initiates the actual seamless player replacement via `TheNet:SpawnSeamlessPlayerReplacement`, saving current clothing data and preparing the new prefab to be spawned with preserved attributes.
* **Parameters:** `new_prefab` (string or `nil`) — the target prefab name. If `nil`, swaps back to the main character.
* **Returns:** Nothing.
* **Error states:** Returns early (no-op) if `inst.userid` is missing or empty.

### `DoMonkeyChange()`
* **Description:** Triggers a seamless swap to the `"wonkey"` prefab (used for monkey boxes).
* **Parameters:** None.
* **Returns:** Nothing.

### `SwapBackToMainCharacter()`
* **Description:** Triggers a seamless swap back to the original character (saved in `main_data`).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSeamlessCharacterSwap(old_player)`
* **Description:** Executed *on the newly spawned player* after `TheNet:SpawnSeamlessPlayerReplacement`. Handles restocking, uncursing, and synchronizing state from the old player entity.
* **Parameters:** `old_player` (Entity) — the previous player instance being replaced.
* **Returns:** Nothing.

### `PostTransformSetup()`
* **Description:** Applies post-swap tag/behavior adjustments, such as restoring the `mime` tag (if applicable) and setting the speech proxy to the original prefab.
* **Parameters:** None.
* **Returns:** Nothing.

### `SaveForReroll()`
* **Description:** Generates partial state data suitable for `LoadForReroll` (e.g., for non-network rerolls), preserving swap-related clothing data if needed.
* **Parameters:** None.
* **Returns:** `table` with optional `swap_data` field, or `nil` if nothing to save.

### `OnSave()`
* **Description:** Produces full serialized state for persistence (e.g., during world saves). Includes both `swap_data` and `main_data`.
* **Parameters:** None.
* **Returns:** `table` with optional `swap_data` and `main_data` fields, or `nil` if both are empty.

### `OnLoad(data)`
* **Description:** Loads persisted `swap_data` and `main_data`, and triggers `PostTransformSetup` if the current prefab does not match the stored main prefab.
* **Parameters:** `data` (table or `nil`) — the saved data, typically from `OnSave`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no event listeners registered by this component).
- **Pushes:** 
  - `"ms_playerreroll"` (on `old_player`) — signals removal of world items belonging to the old character.
  - `"ms_playerseamlessswaped"` (on `new_player`) — signals completion of seamless swap; used to apply post-spawn setup.
