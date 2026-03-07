---
id: fish_box
title: Fish Box
description: A storage structure that preserves fish and breaks into wreckage upon hammering, releasing contents and triggering platform leaks.
tags: [storage, fish, environment, preservation, structure]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: da3a15c4
system_scope: environment
---

# Fish Box

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `fish_box` prefab is a deployable structure that functions as a storage container with preservation capabilities. It uses the `container`, `preserver`, and `workable` components to hold, preserve, and destroy its contents. When built, it enters a `closed` state. Opening it triggers animations, sound, and a scheduled splash animation loop. Hammering destroys it, dropping loot, spawning wild ocean fish for each preserved fish inside, creating wreckage FX, and spawning a leak on the connected platform (if applicable).

## Usage example
```lua
-- Deploying a fish box via the placer
local placer = GetPlayer().components.builder:MakePlacer("fish_box_placer")
placer()

-- Accessing container slots programmatically (after deployment)
local box = SpawnPrefab("fish_box")
box:DoTaskInTime(1, function()
    if box.components.container then
        local num_slots = box.components.container:GetNumSlots()
        for i = 1, num_slots do
            local item = box.components.container:GetItemInSlot(i)
            if item ~= nil then
                -- Process item (e.g., inspect fish_def)
            end
        end
    end
end)
```

## Dependencies & tags
**Components used:** `container`, `lootdropper`, `preserver`, `workable`, `inspectable`, `miniMapEntity`, `soundemitter`, `animstate`, `transform`, `network`, `plash` (via `splash` task scheduling).
**Tags:** Adds `structure`. No tags are removed or dynamically changed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `FISH_BOX_SCALE` | number | `1.3` | Uniform scale applied to the fish box entity. |
| `scrapbook_anim` | string | `"closed"` | Animation state shown in the scrapbook UI. |
| `scrapbook_specialinfo` | string | `"FISHBOX"` | Metadata string used by the scrapbook system. |
| `splash_task` | Task | `nil` | Holds the reference to the recurring splash animation task. |

## Main functions
### `onopen(inst)`
*   **Description:** Called when the container is opened. Plays the "open" animation followed by "opened", plays the open sound, and starts the recurring splash animation loop.
*   **Parameters:** `inst` (Entity) — the fish box instance.
*   **Returns:** Nothing.
*   **Error states:** No failure conditions; relies on `AnimState` and `SoundEmitter` being present.

### `onclose(inst)`
*   **Description:** Called when the container is closed. Plays the "close" animation followed by "closed", plays the close sound, and cancels the splash animation loop.
*   **Parameters:** `inst` (Entity) — the fish box instance.
*   **Returns:** Nothing.
*   **Error states:** No failure conditions.

### `onhammered(inst, worker)`
*   **Description:** Callback executed when the workable component finishes (i.e., the box is hammered to destruction). Drops full loot via `lootdropper`, releases any preserved fish into the world (as ephemeral wild fish), spawns collapse FX, and emits a medium-sized boat leak event on the connected platform before removing the instance.
*   **Parameters:** 
  * `inst` (Entity) — the fish box instance.
  * `worker` (Entity) — the entity performing the hammering.
*   **Returns:** Nothing.
*   **Error states:** 
  * Fish without `fish_def` are dropped normally via `container:DropItemBySlot`.
  * Only up to 5 preserved fish are spawned as wild fish (randomized from contents).
  * `oceanfish_to_spawn` list can be empty if no fish with `fish_def` are present.

### `onhit(inst, worker)`
*   **Description:** Called on each hit while the box is being worked. If the container is closed, it plays a "hit_closed" animation. Then closes the container (if open), preventing access during hammering.
*   **Parameters:** 
  * `inst` (Entity) — the fish box instance.
  * `worker` (Entity) — the entity performing the hammering.
*   **Returns:** Nothing.
*   **Error states:** Container is only closed if it is currently open (`IsOpen()` returns true).

### `OnSink(inst)`
*   **Description:** Event listener for "onsink". If the fish box is no longer on a platform and not at a dock, it immediately destroys the box by calling `workable:Destroy`.
*   **Parameters:** `inst` (Entity) — the fish box instance.
*   **Returns:** Nothing.
*   **Error states:** None; destruction is unconditional when sinking criteria are met.

## Events & listeners
- **Listens to:** 
  * `onbuilt` — triggers `onbuilt` handler (plays "place" animation, plays sound).
  * `onsink` — triggers `OnSink` handler (destroys the box if no longer on a platform/dock).
- **Pushes:** None directly (uses internal callbacks for event-driven logic).