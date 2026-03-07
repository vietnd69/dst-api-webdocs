---
id: beemine
title: Beemine
description: A deployable trap that rattles when armed, explodes upon triggering, and spawns a swarm of bees toward a nearby valid target.
tags: [trap, bees, combat, deployable]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7388af20
system_scope: world
---

# Beemine

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`beemine` is a deployable trap prefab that remains dormant until triggered by an enemy (via proximity) or by being hammered while armed. Once triggered, it detonates and releases a configurable number of bees (`TUNING.BEEMINE_BEES`) that automatically seek and attack the nearest valid target. It integrates with several core components including `mine`, `workable`, `inventoryitem`, `deployable`, and `hauntable`. Its behavior is guided by custom state functions for rattling, sleeping/waking, and hauntable interactions.

## Usage example
```lua
local beemine = SpawnPrefab("beemine")
if beemine ~= nil then
    beemine.Transform:SetPosition(x, y, z)
    beemine.components.deployable:Place(nil, nil, nil) -- deploys with default spacing
    -- The mine will automatically reset and begin rattling via OnReset()
end
```

## Dependencies & tags
**Components used:**  
- `mine` — manages arming, springing, deactivation, and explosion logic  
- `workable` — enables hammering to trigger premature explosion  
- `inventoryitem` — controls pick-up, drop, and sink behavior  
- `deployable` — handles placement and spacing  
- `hauntable` — enables haunting interactions with players  
- `inspectable` — enables inspection in-game  
- `lootdropper` — drops no loot (used for integration)  

**Tags:**  
- `mine` — added via `inst:AddTag("mine")`  
- (No other tags are added or checked.)

## Properties
No public properties are defined directly in this file. State is managed internally via component access (e.g., `inst.components.mine.issprung`) and local instance variables (`inst.rattling`, `inst.nextrattletime`, `inst.spawntask`, `inst.beeprefab`).

## Main functions
### `MineRattle(inst)`
*   **Description:** Plays the rattling animation and sound, then schedules the next rattle after a random interval (4 to 5 seconds). Repeatedly rescheduled while active.
*   **Parameters:** `inst` (Entity) — the beemine instance.
*   **Returns:** Nothing.

### `StartRattleTask(inst, delay)`
*   **Description:** Cancels any existing rattle task and schedules a new one with the given delay (or a default range if `nil`). Used during initial arming or after waking from sleep.
*   **Parameters:**  
    - `inst` (Entity) — the beemine instance.  
    - `delay` (number | nil) — seconds until next rattle; if `nil`, uses a random value (4 + math.random()).
*   **Returns:** Nothing.

### `StopRattleTask(inst)`
*   **Description:** Cancels any pending rattle task and clears the task reference. Called when disarmed, dropped, or during sleep.
*   **Parameters:** `inst` (Entity) — the beemine instance.
*   **Returns:** Nothing.

### `StartRattling(inst, delay)`
*   **Description:** Marks the beemine as rattling and starts or suspends rattle scheduling depending on sleep state. Stores `nextrattletime` during sleep to resume later.
*   **Parameters:**  
    - `inst` (Entity) — the beemine instance.  
    - `delay` (number | nil) — optional delay before next rattle.
*   **Returns:** Nothing.

### `StopRattling(inst)`
*   **Description:** Clears the rattling flag and cancels the rattle task.
*   **Parameters:** `inst` (Entity) — the beemine instance.
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** Saves remaining rattle time before pausing the rattle task during entity sleep (e.g., world save or player sleep).
*   **Parameters:** `inst` (Entity) — the beemine instance.
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Resumes the rattle task upon waking, using saved time if available; otherwise starts fresh.
*   **Parameters:** `inst` (Entity) — the beemine instance.
*   **Returns:** Nothing.

### `SpawnBees(inst, target)`
*   **Description:** Plays the explosion sound and spawns a fixed number of bees (`TUNING.BEEMINE_BEES`) in a randomized circle around the beemine, then sets them to attack the nearest valid target (if no explicit target is provided). Fires the `"coveredinbees"` event on the target.
*   **Parameters:**  
    - `inst` (Entity) — the beemine instance.  
    - `target` (Entity | nil) — the intended target; if `nil`, uses `FindEntity` to locate a suitable one.
*   **Returns:** Nothing.

### `OnExplode(inst)`
*   **Description:** Called by the `mine` component when the mine is sprung. Stops rattling, plays explode/launch sounds, schedules `SpawnBees` after 9 frames, removes self after animation, and strips components to mark as non-persistent.
*   **Parameters:** `inst` (Entity) — the beemine instance.
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Hook for the `workable` component — triggers immediate explosion when the beemine is hammered.
*   **Parameters:**  
    - `inst` (Entity) — the beemine instance.  
    - `worker` (Entity) — the entity performing the hammer action.
*   **Returns:** Nothing.

### `ondeploy(inst, pt, deployer)`
*   **Description:** Called by the `deployable` component on placement — resets the mine to active state and teleports to placement point.
*   **Parameters:**  
    - `inst` (Entity) — the beemine instance.  
    - `pt` (Vector3) — the placement position.  
    - `deployer` (Entity | nil) — the entity deploying the mine.
*   **Returns:** Nothing.

### `OnReset(inst)`
*   **Description:** Reset hook for the `mine` component — initializes mine after placement or reset. Plays reset sound/animation, disables bounce/sink, enables minimap, and starts rattling.
*   **Parameters:** `inst` (Entity) — the beemine instance.
*   **Returns:** Nothing.

### `SetSprung(inst)`
*   **Description:** Hook called after the mine is sprung — enables rattling with a short initial delay (1 second) and ensures minimap visibility.
*   **Parameters:** `inst` (Entity) — the beemine instance.
*   **Returns:** Nothing.

### `SetInactive(inst)`
*   **Description:** Hook called when the mine is deactivated — disables rattling, turns off minimap, and sets animation to "inactive".
*   **Parameters:** `inst` (Entity) — the beemine instance.
*   **Returns:** Nothing.

### `OnDropped(inst)`
*   **Description:** Hook for the `inventoryitem` component — deactivates the mine when dropped from inventory.
*   **Parameters:** `inst` (Entity) — the beemine instance.
*   **Returns:** Nothing.

### `OnHaunt(inst, haunter)`
*   **Description:** Hook for the `hauntable` component — defines behavior when haunted:  
    - If inactive → small haunt, launch effect.  
    - If already sprung → no haunt.  
    - If rare chance passes → explode and medium haunt.  
    - Otherwise → tiny haunt and force early rattle.
*   **Parameters:**  
    - `inst` (Entity) — the beemine instance.  
    - `haunter` (Entity) — the haunter entity.
*   **Returns:** `true` if the haunt succeeded, `false` otherwise.

### `BeeMine(name, alignment, skin, spawnprefab, isinventory)`
*   **Description:** Main constructor function that defines the beemine prefab and variants (`beemine`, `beemine_maxwell`). Sets up assets, tags, components, and event handlers.
*   **Parameters:**  
    - `name` (string) — prefab name (e.g., `"beemine"`).  
    - `alignment` (string) — combat alignment (e.g., `"player"`).  
    - `skin` (string) — animation bank/build name (e.g., `"bee_mine"`).  
    - `spawnprefab` (string) — prefab name for spawned bees (e.g., `"bee"` or `"mosquito"`).  
    - `isinventory` (boolean) — whether the item is pick-up-able and deployable.
*   **Returns:** `Prefab` instance — suitable for `return` from `return BeeMine(...)`.  
*   **Note:** When `isinventory` is true, adds `inventoryitem` and `deployable` components.

## Events & listeners
- **Listens to:**  
  - `"animover"` — triggers `inst.Remove` to clean up the beemine after the explode animation completes.  
  - **No other events are registered in this file.**

- **Pushes:**  
  - `"coveredinbees"` — fired on the target entity when bees spawn upon explosion.  
  - **No other events are explicitly pushed by this file.**