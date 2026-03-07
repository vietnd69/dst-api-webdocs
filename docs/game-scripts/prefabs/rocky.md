---
id: rocky
title: Rocky
description: Manages Rocky's behavior as a controllable NPC character, including growth mechanics, follower loyalty, combat targeting, and interaction with players via trading.
tags: [character, ai, growth, combat, follower]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d7f65bca
system_scope: entity
---

# Rocky

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`rocky.lua` defines the `Rocky` prefab, a controllable NPC character in DST. It integrates multiple components to handle movement, health, combat, trading, sleep cycles, and dynamic scaling. Growth is influenced by time awake, acid rain, and haunt reactions. Key interactions include gaining loyalty from players by accepting Elemental food items and sharing combat aggro with nearby Rockies or shadowthrall-parasite-hosted characters.

## Usage example
```lua
local inst = TheWorld:SpawnPrefab("rocky")
if inst and TheWorld.ismastersim then
    inst.components.combat:SetDefaultDamage(150)
    inst.components.scaler:SetScale(1.2)
    inst.components.health:SetMaxHealth(200)
    inst.components.sleeper:WakeUp()
end
```

## Dependencies & tags
**Components used:** `spawnfader`, `acidinfusible`, `combat`, `eater`, `follower`, `health`, `herdmember`, `inventory`, `inspectable`, `knownlocations`, `locomotor`, `lootdropper`, `scaler`, `sleeper`, `trader`, `hauntable`  
**Tags added:** `rocky`, `character`, `animal`, `electricdamageimmune`, `trader`, `herdmember`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `colour_idx` | number | `math.random(#colours)` | Index (1–2) of Rocky’s color variant; applied via `AnimState:SetMultColour`. |
| `sizeupdatetask` | Task | `nil` | Periodic task tracking growth/shrinkage due to time awake or acid rain. |
| `_target_sharing_test` | function | `nil` | Predicate function used by `combat:ShareTarget` for non-parasite Rockies. |

## Main functions
### `ShouldSleep(inst)`
*   **Description:** Determines if Rocky should fall asleep based on total time awake exceeding `2 * TOTAL_DAY_TIME`.
*   **Parameters:** `inst` (Entity) — the Rocky entity.
*   **Returns:** `true` if Rocky is overdue for sleep, otherwise `false`.

### `ShouldWake(inst)`
*   **Description:** Determines if Rocky should wake up after sleeping for at least half a day.
*   **Parameters:** `inst` (Entity) — the Rocky entity.
*   **Returns:** `true` if sleep duration exceeds `0.5 * TOTAL_DAY_TIME`, otherwise `false`.

### `OnAttacked(inst, data)`
*   **Description:** Handles incoming attacks by setting the attacker as Rocky’s target and sharing the target with nearby allies.
*   **Parameters:**  
    `inst` (Entity) — Rocky entity.  
    `data` (table) — event payload containing `attacker`.  
*   **Returns:** Nothing.  
*   **Error states:** Sharing depends on tags (`shadowthrall_parasite_hosted`) and follows different share rules: 10_hosts for parasite cases, 2_Rockies otherwise.

### `grow(inst, dt)`
*   **Description:** Increases Rocky’s scale toward `TUNING.ROCKY_MAX_SCALE` over time.
*   **Parameters:**  
    `inst` (Entity) — Rocky entity.  
    `dt` (number) — time delta (usually seconds).  
*   **Returns:** `true` if scale increased; `false` if already at max scale.

### `on_size_update(inst, dt)`
*   **Description:** Main growth/shrinkage loop: shrinks during acid rain; otherwise grows gradually.
*   **Parameters:**  
    `inst` (Entity) — Rocky entity.  
    `dt` (number) — time delta.  
*   **Returns:** Nothing.  
*   **Error states:** Cancels `sizeupdatetask` if no further growth or shrinkage is needed.

### `applyscale(inst, scale)`
*   **Description:** Recalculates and applies stats (damage, speed, health) based on current scale.
*   **Parameters:**  
    `inst` (Entity) — Rocky entity.  
    `scale` (number) — current scale factor.  
*   **Returns:** Nothing.

### `OnGrowthStateDirty(inst)`
*   **Description:** Re-queues `sizeupdatetask` to adjust growth/shrink rate in response to acid rain changes.
*   **Parameters:** `inst` (Entity) — Rocky entity.  
*   **Returns:** Nothing.

### `ShouldAcceptItem(inst, item)`
*   **Description:** Predicate used by `trader` to decide if an item is tradeable.
*   **Parameters:**  
    `inst` (Entity) — Rocky entity.  
    `item` (Entity) — candidate item.  
*   **Returns:** `true` if `item` is edible and of `FOODTYPE.ELEMENTAL`.

### `OnGetItemFromPlayer(inst, giver, item)`
*   **Description:** Handles successful item trades: grants loyalty, updates leader/follower relationship, may change target, and wakes Rocky.
*   **Parameters:**  
    `inst` (Entity) — Rocky entity.  
    `giver` (Entity) — player giving the item.  
    `item` (Entity) — traded item.  
*   **Returns:** Nothing.  
*   **Error states:** Ignores trade if item isn’t Elemental or grand-owner is neither Rocky nor part of a matching stack.

### `OnRefuseItem(inst, item)`
*   **Description:** Handles rejected trade attempts by waking Rocky and pushing `refuseitem`.
*   **Parameters:**  
    `inst` (Entity) — Rocky entity.  
    `item` (Entity) — refused item.  
*   **Returns:** Nothing.

### `CustomOnHaunt(inst, haunter)`
*   **Description:** Handles haunt reactions: with 25% chance, triggers growth and resets acid handling.
*   **Parameters:**  
    `inst` (Entity) — Rocky entity.  
    `haunter` (Entity) — haunter entity.  
*   **Returns:** `true` if haunt succeeded; `false` otherwise.

## Events & listeners
- **Listens to:** `attacked` — triggers `OnAttacked` to set/agro target and share.  
- **Listens to:** `gainrainimmunity`, `loserainimmunity` — triggers `OnGrowthStateDirty` to re-schedule growth/shrink updates.  
- **Pushes:** `refuseitem` — fired in `OnRefuseItem` when trade is denied.  
- **Pushes:** `gainloyalty`, `startfollowing` — dispatched by `follower` component internally during loyalty gain/follower join.