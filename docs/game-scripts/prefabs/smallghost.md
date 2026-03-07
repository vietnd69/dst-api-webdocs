---
id: smallghost
title: Smallghost
description: Manages the quest logic, behavior, and environmental feedback for the small ghost character in DST, including toy collection, player linking, and hot/cold hunt cues.
tags: [quest, ghost, ai, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2ce294ca
system_scope: entity
---

# Smallghost

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `smallghost` prefab implements the mechanics for the Ghost Child (Wendy's ghost companion), handling quest-based toy collection, dynamic environmental feedback via hot/cold effect scaling, player linking/unlinking, and integration with DST’s quest, follower, and locomotion systems. It coordinates closely with the `follower`, `leader`, `playerprox`, `knownlocations`, `skilltreeupdater`, and `talker` components to respond to player proximity, manage quest state, and synchronize gameplay feedback.

## Usage example
```lua
-- Typically not instantiated directly by mods; created via prefab spawning.
-- Example of internal usage in quest logic:
local ghost = SpawnPrefab("smallghost")
ghost:SetPosition(x, y, z)
ghost.LinkToPlayer(player)
ghost.sg:GoToState("quest_begin")
```

## Dependencies & tags
**Components used:** `follower`, `knownlocations`, `playerprox`, `skilltreeupdater`, `talker`, `questowner`, `locomotor`, `sanityaura`, `inspectable`, `trader`, `network`, `dynamicshadow`, `animstate`, `soundemitter`, `transform`  
**Tags added:** `ghost`, `ghostkid`, `flying`, `girl`, `noauradamage`, `NOBLOCK`, `trader`  
**Tags checked:** `ghostlyfriend` (for client-side talk permission), `reviver` (for trading hint)

## Properties
No public properties exposed beyond internal instance variables (`inst._toys`, `inst._playerlink`, `inst._hotcold_fx`, `inst._hairstyle`, `inst._cancelled`, `inst._toy_datas`, `inst._shard_id`, `inst._toy_center_position`, `inst.PickupToy`, `inst.LinkToPlayer`, `inst.LinkToHome`). These are initialized and managed internally.

## Main functions
### `PickupToy(toy)`
*   **Description:** Handles collection of a quest toy, removes it from tracking, spawns associated `ghostflower` spawn effects (including extra flowers for Wendy’s skill upgrades), and triggers quest completion if no toys remain.
*   **Parameters:** `toy` (entity) - the toy prefab entity being collected.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `toy` is not in the current quest’s `inst._toys` set.

### `LinkToPlayer(player)`
*   **Description:** Binds the ghost to a specific player as its leader, removes player proximity limbo behavior, and configures leader death/onremove callbacks.
*   **Parameters:** `player` (entity) - the player entity to follow and link to.
*   **Returns:** Nothing.

### `LinkToHome(home)`
*   **Description:** Binds the ghost to a static location (e.g., a gravestone), remembers its position as "home", and ensures limbo behavior is skipped only when the player is not close.
*   **Parameters:** `home` (entity) - the entity (typically a gravestone) acting as the ghost’s anchor.
*   **Returns:** Nothing.

### `sethairstyle(hairstyle)`
*   **Description:** Sets the ghost’s hair variant by overriding the `smallghost_hair` symbol using `ghost_kid` animations.
*   **Parameters:** `hairstyle` (number or nil) - index (0–3); `nil` or `0` uses default hair.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onremove` (on itself, from toys) → triggers `on_toy_removed` to update quest progress.  
  - `onremove` (on `_playerlink`) → triggers `unlink_from_player` and `inst._on_leader_removed`.  
  - `death` (on `_playerlink`) → triggers `inst._on_leader_death` to unlink.  
  - `animover` (on `hotcold_fx`) → restarts random idle animation.  
- **Pushes:**  
  - None directly; relies on component events (`follower`, `leader`, `playerprox`, `questowner`) and state graph transitions for interactivity.
