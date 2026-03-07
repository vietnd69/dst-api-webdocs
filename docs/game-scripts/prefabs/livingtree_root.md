---
id: livingtree_root
title: Livingtree Root
description: A throwable item that plants a livingtree sapling and pacifies nearby Leifs upon deployment.
tags: [inventory, deployable, event, environment, leif]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 846f7d64
system_scope: environment
---

# Livingtree Root

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`livingtree_root` is a deployable item prefab used during the Hallowed Nights event to plant a `livingtree_sapling` and pacify nearby Leif creatures. It functions as both a fuel source and a deployable planting tool. The component logic resides in the main prefab constructor (`fn`), and the item integrates with several core systems: `stackable`, `fuel`, `inventoryitem`, `deployable`, and `sleeper` (indirectly, via deployment effects). Its behavior changes based on whether the Hallowed Nights event is active, notably updating its inventory icon.

## Usage example
```lua
-- Example usage in a mod to spawn and deploy a livingtree root
local root = SpawnPrefab("livingtree_root")
root.Transform:SetPosition(x, y, z)

-- Deploy the root at a target location (requires master simulation)
local deploy_pos = Vector3(target_x, target_y, target_z)
if root.components.deployable ~= nil then
    root.components.deployable.ondeploy(root, deploy_pos, player)
end
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `fuel`, `inventoryitem`, `deployable`, `sleeper` (via deployment), `health` (via Hauntable), `burnable`, `propagator`, `physics`, `animstate`, `transform`, `soundemitter`, `network`.

**Tags:** Adds `deployedplant`; checks for `leif` tags; event-specific visibility toggles `eye` layer.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `beattask` | `Task` | `nil` | Reference to the scheduled recurring beat animation task. Cancelled on pickup; restarted on drop/deploy. |
| `scrapbook_specialinfo` | string | `"PLANTABLE"` | Metadata used for scrapbook categorization. |
| `PlayBeatAnimation` | function | `PlayBeatAnimation` | Public method reference to the local `PlayBeatAnimation` function, exposed for external triggers (e.g., events). |

## Main functions
### `PlayBeatAnimation(inst)`
*   **Description:** Plays the "idle" animation on the entity's `AnimState`. Used as part of a repeating task to indicate the item's "beating" state while on the ground.
*   **Parameters:** `inst` (Entity) — the item instance.
*   **Returns:** Nothing.

### `ondropped(inst)`
*   **Description:** Restarts the beat animation task when the item is dropped onto the ground. Cancels any existing task first to avoid duplication.
*   **Parameters:** `inst` (Entity) — the item instance.
*   **Returns:** Nothing.

### `onpickup(inst)`
*   **Description:** Cancels the beat animation task when the item is picked up into an inventory.
*   **Parameters:** `inst` (Entity) — the item instance.
*   **Returns:** Nothing.

### `ondeploy(inst, pt, deployer)`
*   **Description:** The core deployment logic. Spawns a `livingtree_sapling` at the deployment point, destroys the root item, and attempts to pacify nearby Leif creatures within `TUNING.LEIF_PINECONE_CHILL_RADIUS`. A single Leif may be taunted (if not pacified), and the pacification triggers an achievement.
*   **Parameters:**  
    * `inst` (Entity) — the root item instance. It is reduced to a single unit (via `stackable:Get`) before deployment.  
    * `pt` (Vector3) — world position where the sapling is placed.  
    * `deployer` (Entity) — the entity performing the deployment, used for luck-based pacification checks and achievement awarding.  
*   **Returns:** Nothing.  
*   **Error states:** None. Silently handles missing components (e.g., no `sleeper` on Leif) and duplicate sound playback (only one Leif taunts per deployment).

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls in this prefab).
- **Pushes:** None directly (though other components or prefabs spawned here may push events).