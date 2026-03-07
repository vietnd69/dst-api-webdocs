---
id: stickheads
title: Stickheads
description: Creates and configures the Pig Head and Merm Head prefabs, which are destructible structures that produce specific loot, respond to fire, wake up on full moons, and can be haunted.
tags: [structure, hauntable, fire, loot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7ba1a6cb
system_scope: entity
---

# Stickheads

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`stickheads.lua` defines two prefabs—`pighead` and `mermhead`—which are decorative, destructible structures. Each is a `structure` entity that incorporates `workable`, `burnable`, `hauntable`, and `lootdropper` components. They feature state-sensitive behavior: sleeping by default, waking (animating and becoming harder to haunt) on full moons, and extinguishing fire before collapsing. When destroyed, they drop loot (e.g., pigskin, spoiled food) and may yield nightmare fuel during full moons.

## Usage example
```lua
-- Create a pig head at position (0,0,0)
local head = SpawnPrefab("pighead")
head.Transform:SetPosition(Vector3(0, 0, 0))

-- Destroy it programmatically
head.components.workable:WorkedBy(player, 3)
```

## Dependencies & tags
**Components used:** `lootdropper`, `inspectable`, `workable`, `burnable`, `propagator`, `hauntable`  
**Tags added:** `structure`, `beaverchewable`  
**Tags checked:** `burnt`, `beaverchewable` (via tag inheritance)

## Properties
No public properties are initialized directly in this script.

## Main functions
### `OnFinish(inst)`
*   **Description:** Handles post-destruction logic. Extinguishes fire if present, spawns a collapse FX, conditionally spawns nightmare fuel during full moons, drops loot, and removes the entity.
*   **Parameters:** `inst` (Entity) — the stickhead instance.
*   **Returns:** Nothing.

### `OnWorked(inst)`
*   **Description:** Plays the "hit" animation, then resumes either the awake or asleep idle animation depending on `inst.awake`. Skipped if the head is already burnt.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnFullMoon(inst, isfullmoon)`
*   **Description:** Manages awakening behavior based on the current moon phase. Sets `inst.awake = true` on full moon (if not already burnt), playing a wake animation and idle loop; sleeps when moon wanes.
*   **Parameters:**
    *   `inst` (Entity).
    *   `isfullmoon` (boolean).
*   **Returns:** Nothing.

### `OnHaunt(inst, haunter)`
*   **Description:** Handles haunt attempts. If not awake and not burnt, wakes the head and grants a tiny haunt value; otherwise returns `false`.
*   **Parameters:**
    *   `inst` (Entity).
    *   `haunter` (Entity) — the haunting entity.
*   **Returns:** `true` if successfully awakened; `false` otherwise.

### `create_common(bankandbuild)`
*   **Description:** Shared constructor logic. Initializes transform, anim, sound, network; adds tags; sets up components (`lootdropper`, `workable`, `burnable`, `hauntable`, `inspectable`); registers save/load callbacks; and watches for full-moon state changes.
*   **Parameters:** `bankandbuild` (string) — the asset bank/build name (`"pig_head"` or `"merm_head"`).
*   **Returns:** `inst` (Entity) — a pristine instance (server-side only returns fully configured entity).

### `create_pighead()`
*   **Description:** Instantiates a pig head via `create_common` with `"pig_head"` as the asset identifier.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — the configured pig head prefab.

### `create_mermhead()`
*   **Description:** Instantiates a merm head via `create_common` with `"merm_head"` as the asset identifier.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — the configured merm head prefab.

## Events & listeners
- **Listens to:** World state `"isfullmoon"` — triggers `OnFullMoon`.
- **Pushes:** No direct events are fired by this component. Events are handled via callbacks (`onsave`, `onload`, `onfinish`, `onwork`, `onhaunt`) and passed through component hooks.
- **Component event hooks used:**
    * `inst.OnSave = onsave` — saves burn state.
    * `inst.OnLoad = onload` — restores burnt state on load.
    * `inst.components.workable.onfinish = OnFinish` — called after work completes.
    * `inst.components.workable.onwork = OnWorked` — called on each hit.
    * `inst.components.hauntable.onhaunt = OnHaunt` — called on haunt attempt.