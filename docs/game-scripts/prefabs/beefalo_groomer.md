---
id: beefalo_groomer
title: Beefalo Groomer
description: A structure that allows players to change a beefalo's clothing and apply custom skins via a dress-up popup interface.
tags: [beefalo, dressing, structure, ui, skin]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a88f3fe2
system_scope: entity
---

# Beefalo Groomer

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`beefalo_groomer` is a structure prefab that functions as a dressing station for beefalos. It provides an interactive UI (`POPUPS.GROOMER`) where players select skin slots (body, horn, head, feet, tail) to apply to a hitched beefalo. The component relies heavily on the `groomer` component to orchestrate the dress-up flow, and integrates with `hitcher`, `burnable`, `workable`, and `skinner_beefalo` components. It supports saving/loading, burning, hammering, and hitching behavior, and updates the beefalo’s visual appearance and clothing state in response to user input.

## Usage example
```lua
-- Adding a groomer to an entity (typically done internally by thePrefab fn)
local inst = CreateEntity()
inst:AddComponent("groomer")
inst:AddComponent("hitcher")
inst:AddComponent("burnable")
inst:AddComponent("workable")
inst:AddComponent("lootdropper")
inst:AddComponent("skinner")
inst.components.skinner:SetupNonPlayerData()
-- Assign groomer-specific callbacks and properties as shown in the fn()
```

## Dependencies & tags
**Components used:** `groomer`, `hitcher`, `burnable`, `workable`, `lootdropper`, `skinner`, `inspectable`, `animstate`, `soundemitter`, `transform`, `minimapentity`, `network`

**Tags added:** `structure`, `groomer`, `dressable`

**Tags conditionally added:** `NOCLICK` (while dressing up), `burnt` (post-burn)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_dressuptask` | `Task` | `nil` | Task reference for the ongoing dress-up animation sequence. |
| `scrapbook_specialinfo` | string | `"BEEFALOGROOMER"` | Special identifier for scrapbook / handbook display. |

## Main functions
### `CancelDressup(inst)`
* **Description:** Cancels any ongoing dress-up process by aborting the animation task, re-enabling the groomer, and removing the `NOCLICK` tag.
* **Parameters:** `inst` (entity) — the groomer instance.
* **Returns:** Nothing.

### `IsDressingUp(inst)`
* **Description:** Checks whether a dress-up operation is currently in progress.
* **Parameters:** `inst` (entity) — the groomer instance.
* **Returns:** `true` if `_dressuptask` is non-`nil`, otherwise `false`.

### `ondressup(inst, cb)`
* **Description:** Initiates the dress-up animation sequence for a hitched beefalo. Plays animation, sound, disables interaction, and starts a timed task.
* **Parameters:**  
  - `inst` (entity) — the groomer instance.  
  - `cb` (function?) — optional callback to execute *before* the animation task completes.  
* **Returns:** Nothing.
* **Error states:** Early return with no effect if the groomer is `burnt`.

### `canbeginchanging(inst, occupant, doer)`
* **Description:** Validates whether a dress-up operation can begin. Checks for an occupant and sufficient beard hair.
* **Parameters:**  
  - `inst` (entity) — the groomer instance.  
  - `occupant` (entity) — the hitched beefalo.  
  - `doer` (entity?) — the player initiating the action.  
* **Returns:** `true` if valid; `false, "NOOCCUPANT"` or `false, "NOTENOUGHHAIR"` otherwise.

### `beginchanging(inst, occupant, doer)`
* **Description:** Invoked at start of skin selection. Clears the `hasyotbskin` marker on the `doer`’s classified data.
* **Parameters:**  
  - `inst` (entity) — the groomer instance.  
  - `occupant` (entity) — the hitched beefalo.  
  - `doer` (entity?) — the player.  
* **Returns:** Nothing.

### `canactivatechanging(inst, occupant, doer, skins)`
* **Description:** Checks if the selected skin set differs from the occupant’s current clothes; required to commit changes.
* **Parameters:**  
  - `inst` (entity) — the groomer instance.  
  - `occupant` (entity) — the hitched beefalo.  
  - `doer` (entity) — the player.  
  - `skins` (table) — map of skin slot names to skin strings (`beef_body`, `beef_horn`, etc.).  
* **Returns:** `true` if `skins` differ from current clothing; `false` otherwise.

### `applytargetskins(inst, occupant, doer, skins)`
* **Description:** Applies the selected skin slots to the beefalo using `AnimState:AssignItemSkins`, clears existing clothing, and sets new clothing via `SetClothing`.
* **Parameters:**  
  - `inst` (entity) — the groomer instance.  
  - `occupant` (entity) — the hitched beefalo.  
  - `doer` (entity) — the player.  
  - `skins` (table) — mapping of skin slot names to skin identifiers.  
* **Returns:** Nothing.
* **Fire events:** Pushes `dressedup` on `occupant`.

### `onclosepopup(inst, doer, data)`
* **Description:** Parses the GROOMER popup data and returns a skin mapping table.
* **Parameters:**  
  - `inst` (entity) — the groomer instance.  
  - `doer` (entity) — the player.  
  - `data` (table) — popup event data containing `popup` type and `args`.  
* **Returns:** A table `{ beef_body, beef_horn, beef_head, beef_feet, beef_tail, cancel }` if `popup == POPUPS.GROOMER`; `nil` otherwise.

### `changefn(inst)`
* **Description:** Plays the “use” animation and sound when the user interacts during dress-up (e.g., to cycle through options).
* **Parameters:** `inst` (entity) — the groomer instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onremove` — ensures any hitched beefalo is unhitched before removal.  
  - `onbuilt` — plays the placement animation and sound.  
- **Pushes:**  
  - Internally via other components: `unhitched`, `onclothingchanged`, `dressedup`, `entity_droploot` (via lootdropper).  
- **Callbacks assigned:**  
  - `inst.components.burnable.onburnt = onburnt`  
  - `inst.components.burnable:SetOnIgniteFn(onignite)`  
  - `inst.components.workable.onfinish = onhammered`  
  - `inst.components.workable.onwork = onhit`  
  - `inst.components.hitcher.hitchedfn = onhitch`  
  - `inst.components.hitcher.unhitchfn = onunhitch`  
  - `inst.components.groomer.canbeginchangingfn`, `beginchangingfn`, `canactivatechangingfn`, `applytargetskinsfn`, `onclosepopupfn`, `ondressupfn`, `changefn`  
  - `inst.OnSave = onsave`, `inst.OnLoad = onload`  
