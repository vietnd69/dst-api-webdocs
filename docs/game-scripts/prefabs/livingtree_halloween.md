---
id: livingtree_halloween
title: Livingtree Halloween
description: Represents a dynamic, growable Halloween-themed tree entity that supports decoration, burning, and staged growth.
tags: [growable, burnable, container, event]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 57445b57
system_scope: world
---

# Livingtree Halloween

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`livingtree_halloween` is a prefabricated world entity representing a special Halloween-season tree that supports staged growth, decoration (via the `container` component), burning, and lighting/sound effects. It integrates multiple components: `growable`, `burnable`, `container`, `workable`, `lootdropper`, and conditionally `sanityaura`. Its behavior is tailored for the `HALLOWED_NIGHTS` event — when active, it gains decorative slots, eye flames (with light and sound), and a small sanity aura.

## Usage example
This prefab is instantiated internally by the game and is not directly constructed by mods. However, modders can spawn and configure instances as follows:
```lua
local tree = SpawnPrefab("livingtree_halloween")
if tree ~= nil then
    -- Start growth immediately
    tree.components.growable:StartGrowing()

    -- Add a decoration item to slot 1
    local item = SpawnPrefab("halloween_ornament")
    tree.components.container:PushItem(item, 1)

    -- Light the tree on fire (controlled burn)
    if tree.components.burnable then
        tree.components.burnable:StartWildfire()
    end
end
```

## Dependencies & tags
**Components used:** `burnable`, `container`, `growable`, `inspectable`, `lootdropper`, `sanityaura`, `workable`, `propagator`, `hauntable`, `inventoryitem`, `heavyobstaclephysics`, `fueled`, `propagator`, `hauntable`
**Tags added:** `plant`, `tree`, `decoratable`, `fridge`, `burnt`, `stump`
**Tags conditionally added:** `monster`, `animal`, `creaturecorpse` (via `MakeHauntableWorkAndIgnite`, `MakeHauntableIgnite`, `MakeHauntableWork`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `statedata` | table | `nil` | Stores the current stage data (`anim_postfix`, `workleft`, `loot`) used during chopping. |
| `_eyeflames` | net_bool | `nil` | Networked boolean controlling eye flame presence and lighting/sound; `nil` when event is inactive. |
| `eyefxl`, `eyefxr` | Entity | `nil` | Prefab instances of `eyeflame` attached to left and right eye symbols. |
| `growfromseed` | function | `nil` | Callback function invoked when the tree grows from a seed. |

## Main functions
### `SetGrowth(inst)`
*   **Description:** Updates the tree's visual state and workable properties based on its current growth stage. Switches animations and sets work amount for that stage. Stops growth at max stage.
*   **Parameters:** `inst` (Entity) — the living tree instance.
*   **Returns:** Nothing.

### `DoGrow(inst)`
*   **Description:** Triggers the growth animation and sound effect when transitioning between stages.
*   **Parameters:** `inst` (Entity) — the living tree instance.
*   **Returns:** Nothing.

### `chop_down_burnt_tree(inst, chopper)`
*   **Description:** Handles chopping a burnt tree stump. Turns off eye flames, removes `workable` component, plays fall sound, spawns charcoal, and schedules removal.
*   **Parameters:**  
  - `inst` (Entity) — burnt tree instance.  
  - `chopper` (Entity or `nil`) — the entity doing the chopping.  
*   **Returns:** Nothing.

### `Extinguish(inst)`
*   **Description:** Fully extinguishes the tree by removing burnable, propagator, and hauntable components, resets loot, and configures the `workable` component for stump creation.
*   **Parameters:** `inst` (Entity) — the burnt tree instance.
*   **Returns:** Nothing.

### `OnBurnt(inst)`
*   **Description:** Called when the tree is fully burnt. Disables eyes, removes `sanityaura`, stops growth, switches to burnt animation, sets minimap icon, drops container loot, and closes the container.
*   **Parameters:** `inst` (Entity) — the tree instance.
*   **Returns:** Nothing.

### `ondug(inst)`
*   **Description:** Finishes chopping the stump after it has been reduced to a stump. Spawns `livinglog` and removes the tree.
*   **Parameters:** `inst` (Entity) — the stump instance.
*   **Returns:** Nothing.

### `makestump(inst, instant)`
*   **Description:** Transforms the tree into a stump. Removes and replaces components (`sanityaura`, `workable`, `burnable`, `propagator`, `hauntable`), updates animation, sets icon, and adds `stump` tag.
*   **Parameters:**  
  - `inst` (Entity) — tree/stump instance.  
  - `instant` (boolean) — if `true`, plays animation immediately; otherwise pushes animation.  
*   **Returns:** Nothing.

### `onworked(inst, chopper, workleft)`
*   **Description:** Callback when the tree is chopped (but not finished). Plays chop animation, related sounds, and drops/closes container contents.
*   **Parameters:**  
  - `inst` (Entity) — the tree instance.  
  - `chopper` (Entity or `nil`) — the entity doing the work.  
  - `workleft` (number) — remaining work required.  
*   **Returns:** Nothing.

### `onworkfinish(inst, chopper)`
*   **Description:** Called when chopping is complete. Plays tree fall animation and sound, drops loot based on orientation, shakes camera, and calls `makestump`.
*   **Parameters:**  
  - `inst` (Entity) — the tree instance.  
  - `chopper` (Entity) — the entity doing the work.  
*   **Returns:** Nothing.

### `GrowFromSeed(inst)`
*   **Description:** Starts growth from a seed, playing the seed-to-young animation and sound.
*   **Parameters:** `inst` (Entity) — the tree instance.
*   **Returns:** Nothing.

### `ShowDecor(inst, data)`
*   **Description:** Displays a decoration item in the appropriate slot using anim symbol overrides. Does nothing if tree is burnt or item lacks decoration metadata.
*   **Parameters:**  
  - `inst` (Entity) — the tree instance.  
  - `data` (table) — contains `item`, `slot`, and decoration keys (`halloween_ornamentid`, etc.).  
*   **Returns:** Nothing.

### `HideDecor(inst, data)`
*   **Description:** Hides a decoration slot's anim symbols (`decorX`, `ropeX`) and clears overrides.
*   **Parameters:**  
  - `inst` (Entity) — the tree instance.  
  - `data` (table) — must contain `slot` key.  
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Saves state (`stump`, `burnt`) to the save data table for persistence.
*   **Parameters:**  
  - `inst` (Entity) — the tree instance.  
  - `data` (table) — the table to populate with state flags.  
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores tree state on load (e.g., stump or burnt) and re-applies appropriate components.
*   **Parameters:**  
  - `inst` (Entity) — the tree instance.  
  - `data` (table or `nil`) — saved state data.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `eyeflamesdirty` — updates eye flame entity presence, light, and sound via `OnEyeFlamesDirty`.  
  - `itemget` — triggers `ShowDecor` when a decoration is added to the container.  
  - `itemlose` — triggers `HideDecor` when a decoration is removed.  
  - `animover` — in burnt chopping, triggers `inst.Remove` when animation completes.  
  - `death` — referenced internally by `burnable` component.  
- **Pushes:**  
  - `loot_prefab_spawned` — fired by `lootdropper:SpawnLootPrefab`.  
  - `onclose`, `onextinguish`, `onburnt` — standard component events.
