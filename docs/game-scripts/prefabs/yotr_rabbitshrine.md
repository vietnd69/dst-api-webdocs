---
id: yotr_rabbitshrine
title: Yotr Rabbitshrine
description: A seasonal event structure that spawns cooperative bunnymen, accepts offerings of carrots to unlock crafting options, and triggers special gameplay during the YOTR event.
tags: [event, structure, trading, spawn, coop]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4557352a
system_scope: world
---

# Yotr Rabbitshrine

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `yotr_rabbitshrine` is a specialized event-based structure introduced for the YOTR (Year of the Rabbit) seasonal event. It functions as a cooperative interaction hub: players place the shrine on the ground, offer carrots via the trader interface, and in return the shrine spawns player-assisting `cozy_bunnyman` entities at fixed angular positions around it. The shrine transitions between states (pristine, offering-accepted, burnt) and supports networked saving/loading. It integrates tightly with components such as `prototyper` (to expose recipes), `trader` (for carrot acceptance), `workable` (for hammering), `burnable` (for fire interactions), and `entitytracker` (to manage spawned bunnymen).

## Usage example
```lua
-- Typical usage by the game engine, not manual instantiation
-- The shrine is created via the Prefab system and placer workflow
local shrine = SpawnPrefab("yotr_rabbitshrine")
shrine.Transform:SetPosition(x, y, z)

-- During gameplay, players interact with it by offering carrots
-- The trader component handles carrot acceptance via the onaccept callback
-- Bunnymen are spawned automatically after 3 seconds via CheckForSpawn()
```

## Dependencies & tags
**Components used:** `burnable`, `entitytracker`, `hauntable`, `inspectable`, `inventory`, `lootdropper`, `placer`, `prototyper`, `trader`, `workable`, `timer`, `fueled`, `propagator`, `physics`, `obstaclephysics`, `heavyobstaclephysics`.  
**Tags:** Adds `structure`, `pigshrine`, `prototyper`, `burnt` (conditionally); checks `burnt`, `burning`. Does not add or remove tags dynamically beyond `burnt`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `offering` | entity or `nil` | `nil` | The carrot item currently offered to the shrine; set when a carrot is accepted. |
| `bunnylocations` | array of Vector3 or `nil` | `nil` | Relative positions where spawned bunnymen will appear. |
| `bunnyhomelocations` | array of Vector3 or `nil` | `nil` | Ideal angular positions used as bases for bunny placement (without obstacle tweaks). |
| `gamewinner` | entity or `nil` | `nil` | Tracks the winning entity (e.g., player) of the event round; used for tracking removal. |
| `gamewinner_onremove` | function or `nil` | `nil` | Callback to clear `gamewinner` when the winner entity is removed. |
| `set_pillows` | array of string pairs | predefined | Pre-populated list of pillow sets to assign to bunnymen during spawn. |

## Main functions
### `do_bunnyman_spawn(inst, index)`
*   **Description:** Spawns a `cozy_bunnyman` at a computed position relative to the shrine, equips it with randomized pillows (based on materials like petals, kelp, wool, steelwool) and a night cap, and registers the bunny in `entitytracker`.
*   **Parameters:** `inst` (entity) — the shrine instance; `index` (number) — 1-based index for bunny position and tracking.
*   **Returns:** Nothing.

### `CheckForSpawn(inst)`
*   **Description:** Computes and stores bunny spawn positions using a circular layout, then schedules bunny spawning with random delays up to 5 seconds. Only runs during the YOTR event.
*   **Parameters:** `inst` (entity) — the shrine instance.
*   **Returns:** Nothing.

### `SetOffering(inst, offering, loading)`
*   **Description:** Sets an item (typically a carrot) as the active offering, hides the offering entity in the scene, updates the visual state, and triggers a delayed `CheckForSpawn()` call. Converts the shrine to the `prototyper` state.
*   **Parameters:** `inst` (entity); `offering` (entity) — the item to offer; `loading` (boolean) — whether this is a restore from save data (suppresses sound/anim).
*   **Returns:** Nothing.

### `MakeEmpty(inst)`
*   **Description:** Clears the current offering (if any), removes the `prototyper` component, and restores the `trader` component to accept new carrot offerings. Hides the offering animation layer.
*   **Parameters:** `inst` (entity) — the shrine instance.
*   **Returns:** Nothing.

### `DropOffering(inst, worker)`
*   **Description:** Removes the active offering entity, returns it to the world (flung at `worker` if provided), and cleans up associated event listeners.
*   **Parameters:** `inst` (entity); `worker` (entity or `nil`) — player who triggered the drop (e.g., via hammering).
*   **Returns:** Nothing.

### `OnBurnt(inst)`
*   **Description:** Handles burnt state: clears offering, spawns charcoal loot, hides offering visual, and removes the `trader` component.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnIgnite(inst)`
*   **Description:** Triggered when the shrine catches fire. Drops charcoal loot, clears offering, empties the shrine, and disables the trader to prevent further offerings.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnExtinguish(inst)`
*   **Description:** Triggered when a fire is extinguished. Re-enables the trader if present, then calls the default extinguish behavior.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Called when the shrine is fully hammered. Extinguishes fire if burning, drops loot, drops current offering, spawns a small collapse FX, and destroys the shrine entity.
*   **Parameters:** `inst` (entity); `worker` (entity) — player performing the hammer action.
*   **Returns:** Nothing.

### `onhit(inst, worker, workleft)`
*   **Description:** Called on partial hammering. Drops the current offering, empties the shrine, and plays a short hit animation if not burnt.
*   **Parameters:** `inst` (entity); `worker` (entity); `workleft` (number).
*   **Returns:** Nothing.

### `OnOfferingPerished(inst)`
*   **Description:** Handles spoilage of the offered carrot: empties the shrine and launches a `spoiled_food` prefab away from the shrine.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `getrabbits(inst, fn)`
*   **Description:** Returns a list of all tracked bunnymen associated with this shrine (via `entitytracker`). Optionally filters via `fn(inst, bunny)`.
*   **Parameters:** `inst` (entity); `fn` (function or `nil`) — filter function.
*   **Returns:** array — list of bunnyman entities (possibly with `nil` entries if unspawned).

### `SetShrineWinner(shrine, winner)`
*   **Description:** Assigns a winning entity to the shrine and listens for its removal to clear the win state.
*   **Parameters:** `shrine` (entity); `winner` (entity or `nil`).
*   **Returns:** Nothing.

### `placer_override_testfn(inst)`
*   **Description:** Custom placement validation that ensures all 8 bunnyman spawn points (within `PLACER_RADIUS = 10`) are on walkable ground.
*   **Parameters:** `inst` (entity) — the shrine placer instance.
*   **Returns:** `can_build` (boolean), `mouse_blocked` (boolean). Always `mouse_blocked = false`.

## Events & listeners
- **Listens to:**
  - `onbuilt` — calls `onbuilt` to set up initial empty/trader state and play placement animation/sound.
  - `ondeconstructstructure` — calls `DropOffering`.
  - `onremove` — attached to `offering` entity (via `_onofferingremoved`) and `gamewinner` (via `gamewinner_onremove`) to clean up state.
  - `perished` — attached to `offering` entity to trigger `OnOfferingPerished`.
- **Pushes:**
  - `entity_droploot` — fired by `lootdropper:DropLoot` during destruction.
  - `loot_prefab_spawned` — fired by `lootdropper:SpawnLootPrefab`.
  - `onextinguish`, `onignite`, `onburnt` — inherited events via burnable callbacks.
  - Custom events (`offering_removed`, `offering_perished`, `shrine_winner_changed`) are handled via callbacks rather than `PushEvent`.