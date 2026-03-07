---
id: lunar_forge
title: Lunar Forge
description: A deployable crafting structure that functions as a prototyper and provides lantern-like lighting in DST's Lunar event.
tags: [crafting, lighting, structure]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2d523a14
system_scope: crafting
---

# Lunar Forge

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The Lunar Forge is a deployable structure prefab that serves as a crafting prototyper during the Lunar event. It is functionally similar to the Science Machine or Alchemy Engine but features unique animations, sound effects, and lighting behavior. It uses the `prototyper`, `workable`, `lootdropper`, and `hauntable` components to provide crafting access, tool interaction, loot drop on destruction, and hauntable mechanics respectively.

## Usage example
The Lunar Forge is instantiated and deployed automatically by the game when a player uses its kit. Its behavior is fully encapsulated in the prefab definition; modders typically do not add it manually. To use as a reference, a similar deployment would look like:

```lua
local inst = Prefab("lunar_forge", fn)
inst:DoTaskInTime(0, function() 
    inst.components.prototyper.on = true
    inst.components.prototyper:OnActivate()
end)
```

## Dependencies & tags
**Components used:** `inspectable`, `prototyper`, `lootdropper`, `workable`, `hauntable`
**Tags:** Adds `structure`, `lunar_forge`, and `prototyper` (for optimization)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_activecount` | number | `0` | Tracks concurrent activators; decremented after `onactivate` completes. |
| `_activetask` | Task | `nil` | Tracks delayed task to reset state after use animation completes. |

## Main functions
### `onhammered(inst, worker)`
* **Description:** Called when the Lunar Forge is destroyed via hammering. Drops loot using `lootdropper`, spawns a `collapse_small` effect, and removes the entity.
* **Parameters:** 
  * `inst` (Entity) - the Lunar Forge instance.
  * `worker` (Entity) - the entity performing the hammer action.
* **Returns:** Nothing.

### `onhit(inst, worker)`
* **Description:** Called during intermediate hammering steps. Plays different animations based on whether the forge is currently on or off.
* **Parameters:** 
  * `inst` (Entity) - the Lunar Forge instance.
  * `worker` (Entity) - the entity performing the hammer action.
* **Returns:** Nothing.

### `onturnon(inst)`
* **Description:** Activates the forge's "on" state: starts proximity loop animation, ensures looping sound is playing.
* **Parameters:** `inst` (Entity) - the Lunar Forge instance.
* **Returns:** Nothing.

### `onturnoff(inst)`
* **Description:** Deactivates the forge's "on" state: triggers post-animation, stops looping sound.
* **Parameters:** `inst` (Entity) - the Lunar Forge instance.
* **Returns:** Nothing.

### `onactivate(inst)`
* **Description:** Handles activation of the forge (e.g., when a player opens the prototyper menu). Plays use animation, increments active count, schedules delayed deactivation, and cancels any existing delayed task.
* **Parameters:** `inst` (Entity) - the Lunar Forge instance.
* **Returns:** Nothing.

### `doneact(inst)`
* **Description:** Cleans up after an activation sequence: resets `_activetask`, and re-applies `onturnon` or `onturnoff` depending on the current state.
* **Parameters:** `inst` (Entity) - the Lunar Forge instance.
* **Returns:** Nothing.

### `doonact(inst)`
* **Description:** Decrements `_activecount` and schedules final cleanup only when count reaches zero.
* **Parameters:** `inst` (Entity) - the Lunar Forge instance.
* **Returns:** Nothing.

### `onbuilt(inst, data)`
* **Description:** Triggered on placement. Plays placement animation and sound.
* **Parameters:** 
  * `inst` (Entity) - the Lunar Forge instance.
  * `data` (table) - event payload (unused).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` - triggers `onbuilt` callback after placement.

- **Pushes:** No events are directly fired by this component.

## Overview notes
- The `prototyper` component is pre-attached to the pristine (server-only) instance for performance optimization.
- Custom lighting and bloom effects are applied on `fx_puff2`, `head_fx_big`, and `glows` symbols for visual appeal.
- The forge has two sound states: `loopsound` (looping proximity sound) and `use`/`place`/`proximity_pst` one-shots.
- It inherits behavior from `MakeDeployableKitItem` and `MakePlacer` to support deployment as a kit item.