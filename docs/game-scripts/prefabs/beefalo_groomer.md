---
id: beefalo_groomer
title: Beefalo Groomer
description: A structure prefab that allows players to groom and dress beefalos with custom skins and clothing.
tags: [structure, grooming, beefalo, skins]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: root
source_hash: a88f3fe2
system_scope: entity
---

# Beefalo Groomer

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`beefalo_groomer` is a structure prefab that serves as a wardrobe station for beefalos. It allows players to apply custom skins and clothing to hitched beefalos through the `groomer` component interface. The structure supports hammering for destruction, burning mechanics, and save/load state persistence. It integrates with the `hitcher` component to track which beefalo is currently being groomed.

## Usage example
```lua
local inst = SpawnPrefab("beefalo_groomer")
inst:AddComponent("groomer")
inst.components.groomer:SetCanBeDressed(true)
inst.components.groomer:SetOccupant(beefalo_inst)
inst.components.groomer:Enable(true)
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `workable`, `groomer`, `burnable`, `skinner`, `hitcher`
**Tags:** Adds `structure`, `groomer`, `dressable`, `NOCLICK` (temporarily during dressup animation)

## Properties
No public properties

## Main functions
### `CancelDressup(inst)`
*   **Description:** Cancels an ongoing dressup animation task and re-enables the groomer component. Removes the `NOCLICK` tag to allow interaction again.
*   **Parameters:** `inst` (entity) - the beefalo groomer instance.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `_dressuptask` is nil.

### `IsDressingUp(inst)`
*   **Description:** Checks if the groomer is currently playing a dressup transformation animation.
*   **Parameters:** `inst` (entity) - the beefalo groomer instance.
*   **Returns:** `boolean` - true if `_dressuptask` is active, false otherwise.

### `canbeginchanging(inst, occupant, doer)`
*   **Description:** Validates whether a beefalo can begin the skin changing process. Checks if occupant exists and has sufficient beard bits.
*   **Parameters:** `inst` (entity) - the groomer, `occupant` (entity) - the hitched beefalo, `doer` (entity) - the player attempting the action.
*   **Returns:** `boolean, string` - true if valid, or false with error code (`NOOCCUPANT`, `NOTENOUGHHAIR`).
*   **Error states:** Returns false if no occupant is hitched or if beefalo has fewer than `TUNING.BEEFALO_BEARD_BITS`.

### `canactivatechanging(inst, occupant, doer, skins)`
*   **Description:** Validates whether the proposed skin changes differ from current beefalo clothing.
*   **Parameters:** `inst` (entity) - the groomer, `occupant` (entity) - the beefalo, `doer` (entity) - the player, `skins` (table) - proposed skin configuration.
*   **Returns:** `boolean` - true if clothing differs, false if unchanged.
*   **Error states:** Returns false if beefalo lacks `skinner_beefalo` component or if skins match current clothing.

### `applytargetskins(inst, occupant, doer, skins)`
*   **Description:** Applies the selected skin configuration to the beefalo. Clears existing clothing and sets new skin parts (body, horn, head, feet, tail).
*   **Parameters:** `inst` (entity) - the groomer, `occupant` (entity) - the beefalo, `doer` (entity) - the player, `skins` (table) - skin configuration with keys `beef_body`, `beef_horn`, `beef_head`, `beef_feet`, `beef_tail`.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `skinner_beefalo` component is missing. Pushes `dressedup` event on success.

### `ondressup(inst, cb)`
*   **Description:** Initiates the dressup animation sequence. Plays transform animation, schedules transformation task, disables groomer interaction, and adds `NOCLICK` tag.
*   **Parameters:** `inst` (entity) - the groomer, `cb` (function) - optional callback to execute after transformation.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if groomer has `burnt` tag.

### `onclosepopup(inst, doer, data)`
*   **Description:** Extracts skin selection data from the groomer popup dialog arguments.
*   **Parameters:** `inst` (entity) - the groomer, `doer` (entity) - the player, `data` (table) - popup data with `args` array.
*   **Returns:** `table` - skin configuration table or nil if popup type mismatch.
*   **Error states:** Returns nil if `data.popup` is not `POPUPS.GROOMER`.

## Events & listeners
- **Listens to:** `onremove` - unhitches any hitched beefalo before removal; `onbuilt` - plays placement animation and sound
- **Pushes:** `dressedup` - fired when skins are successfully applied (via `applytargetskins`); `unhitch` - fired on occupant when beefalo is unhitched (via `onunhitch`)