---
id: butterfly
title: Butterfly
description: A small flying insect prefab that can be caught, traded, and deployed to grow a planted flower; it interacts with spawner tracking, loot dropping, and Halloween moon mutation mechanics.
tags: [locomotion, inventory, deployment, event]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: aeb2bd33
system_scope: entity
---

# Butterfly

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `butterfly` prefab represents a lightweight, airborne creature that can be captured by players (e.g., via netting) and deployed to grow a `planted_flower`. It is constructed using an Entity Component System and integrates with several core systems: locomotion for flight, inventory for pickup behavior, workable for netting interactions, deployable for planting, lootdropper for loot drops, and halloweenmoonmutable for seasonal mutation. The prefab relies on external components like `butterflyspawner` to track its presence in the world and coordinate spawner logic.

## Usage example
```lua
local butterfly = SpawnPrefab("butterfly")
if butterfly then
    -- Typically not called manually, but the prefab is automatically instantiated
    -- by world generation, spawners, or via placer.
    -- Manual deployment example:
    butterfly.Transform:SetPosition(some_pos)
    butterfly.components.deployable:OnDeploy(some_pos, player)
end
```

## Dependencies & tags
**Components used:** `locomotor`, `health`, `combat`, `knownlocations`, `lootdropper`, `workable`, `tradable`, `deployable`, `inspectable`, `inventoryitem`, `stackable`, `locomotor`, `halloweenmoonmutable`, `pollinator`, `feedable`, and `butterflyspawner`.
**Tags:** `butterfly`, `flying`, `ignorewalkableplatformdrowning`, `insect`, `smallcreature`, `cattoyairborne`, `wildfireprotected`, `deployedplant`, `noember`, `pollinator`.

## Properties
No public properties are defined directly in the constructor for this prefab; however, the following component-level properties are initialized during construction:
- `inst.butterflyspawner` | `table` or `nil` | `TheWorld.components.butterflyspawner` | Reference to the world’s butterfly spawner component.
- `inst.sg.mem.burn_on_electrocute` | `boolean` | `true` | Stategraph memory flag indicating fire propagation on electrocution.
- `inst.components.locomotor.enablegroundspeedmultiplier` | `boolean` | `false` | Ground speed multiplier disabled (for flight behavior).
- `inst.components.locomotor.triggerscreep` | `boolean` | `false` | Creep activation disabled.
- `inst.components.inventoryitem.canbepickedup` | `boolean` | `false` | Cannot be picked up while alive by default.
- `inst.components.inventoryitem.canbepickedupalive` | `boolean` | `true` | Allows pickup by specific means (e.g., net).
- `inst.components.inventoryitem.nobounce` | `boolean` | `true` | Prevents bouncing on ground.
- `inst.components.inventoryitem.pushlandedevents` | `boolean` | `false` | Suppresses landed event propagation.
- `inst.components.halloweenmoonmutable.push_attacked_on_new_inst` | `boolean` | `false` | Disables default attack behavior on mutated instance spawn.

## Main functions
### `OnDropped(inst)`
*   **Description:** Called when the butterfly is dropped from inventory. Resets the stategraph to idle, resumes spawner tracking if active, resets workable progress, and splits stack if size > 1.
*   **Parameters:** `inst` (Entity) — the butterfly entity instance.
*   **Returns:** Nothing.

### `OnPickedUp(inst)`
*   **Description:** Called when the butterfly is picked up. Stops spawner tracking.
*   **Parameters:** `inst` (Entity) — the butterfly entity instance.
*   **Returns:** Nothing.

### `OnWorked(inst, worker)`
*   **Description:** Callback for when a player successfully nets the butterfly. Transfers the butterfly to the worker’s inventory and plays a sound.
*   **Parameters:** `inst` (Entity) — the butterfly entity; `worker` (Entity) — the entity performing the netting action.
*   **Returns:** Nothing.

### `OnDeploy(inst, pt, deployer)`
*   **Description:** Spawns a `planted_flower` at the deployment position, consumes one butterfly from the stack, awards achievement, triggers event for chivalry, and plays a planting sound.
*   **Parameters:** `inst` (Entity) — the butterfly entity; `pt` (Vector) — deployment position; `deployer` (Entity) — the player deploying the butterfly.
*   **Returns:** Nothing.

### `OnMutate(inst, transformed_inst)`
*   **Description:** Called when the butterfly mutates (e.g., via Halloween moon). Transitions the mutated instance to idle state if present.
*   **Parameters:** `inst` (Entity) — original butterfly; `transformed_inst` (Entity or `nil`) — the new mutated entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` — triggers `butterflyspawner.StopTrackingFn` to unregister from spawner tracking.
- **Pushes:** `growfrombutterfly` — fired by the spawned `planted_flower` instance (via `flower:PushEvent("growfrombutterfly")`).
- **Pushes:** `CHEVO_growfrombutterfly` — event for chivalry achievement tracking, with `{target=flower, doer=deployer}` data.
- **Pushes:** `ondropped` — standard entity event fired after drop handling.
