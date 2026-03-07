---
id: scienceprototyper
title: Scienceprototyper
description: Creates and configures the science and alchemy prototype machines, including their prototyping trees, animations, interactions, and seasonal gift mechanics.
tags: [crafting, structure, environment, loot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 16352162
system_scope: environment
---

# Scienceprototyper

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`scienceprototyper.lua` defines two core crafting machines in DST: the Science Machine (level 1) and the Alchemy Machine (level 2). It uses a factory function `createmachine` to generate shared logic for both variants, including animation states, sound handling, work/hammer interactions, burning behavior, and gift-giving support. The component integrates heavily with `prototyper`, `wardrobe`, `lootdropper`, `workable`, `burnable`, and `hauntable` components to enable full gameplay functionality.

## Usage example
```lua
-- The prefabs are returned directly by the file:
local science_machine = require "prefabs/scienceprototyper"
-- science_machine[1] is the Science Machine (researchlab)
-- science_machine[2] is the Alchemy Machine (researchlab2)

-- Example of accessing a machine instance after spawning:
local inst = SpawnPrefab("researchlab")
inst.components.prototyper.trees:EnableTree("science")
inst.components.wardrobe:SetCanBeShared(false)
```

## Dependencies & tags
**Components used:** `burnable`, `giftreceiver`, `hauntable`, `lootdropper`, `prototyper`, `wardrobe`, `workable`  
**Tags added:** `giftmachine`, `structure`, `level1` or `level2`, `prototyper`, `DECOR`, `NOCLICK`  
**Tags checked:** `burnt`, `burning`, `building`, `ms_addgiftreceiver`, `ms_removegiftreceiver`, `ms_giftopened`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_activecount` | number | `0` | Tracks concurrent prototyping/activation events to manage looped sounds and tasks correctly. |
| `_activetask` | Task | `nil` | Stores the active delayed task for completing animations and resetting state. |
| `scrapbook_specialinfo` | string | `"SCIENCEPROTOTYPER"` | Identifier used by the scrapbook UI to link this entity to its recipe entries. |

## Main functions
### `Default_PlayAnimation(inst, anim, loop)`
* **Description:** Convenience wrapper to play a single animation on an entity's `AnimState`.
* **Parameters:** `inst` (Entity), `anim` (string), `loop` (boolean).
* **Returns:** Nothing.
* **Error states:** None.

### `Default_PushAnimation(inst, anim, loop)`
* **Description:** Convenience wrapper to push an animation onto an entity's `AnimState` queue.
* **Parameters:** `inst` (Entity), `anim` (string), `loop` (boolean).
* **Returns:** Nothing.
* **Error states:** None.

### `onhammered(inst, worker)`
* **Description:** Handles hammering the machine. Extinguishes burning, drops loot (with burnt rules), spawns collapse effect, and removes the entity.
* **Parameters:** `inst` (Entity), `worker` (Entity, optional).
* **Returns:** Nothing.
* **Error states:** If the machine is not burning or not present, it still proceeds to drop loot and remove the entity.

### `onhit(inst)`
* **Description:** Handles mid-hammer hit feedback: plays hit animation, then switches to proximity loop (if on) or idle (if off), unless burnt.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `onturnoff(inst)`
* **Description:** Resets idle state when turning off; stops sounds and sets idle animation only if no ongoing tasks exist and not burnt.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `onturnon(inst)`
* **Description:** Activates machine’s looping animation and sound upon activation. Chooses `proximity_gift_loop` if gifts are available; otherwise uses `proximity_loop`.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.
* **Error states:** Early returns if machine is burnt or `_activetask` exists (though logic ensures it proceeds if `_activetask` is nil per condition).

### `onactivate(inst)`
* **Description:** Begins a prototyping action: plays `use` animation, emits running sound, increments `_activecount`, schedules a ding sound, and schedules `doneact` after animation finishes.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.
* **Error states:** Does nothing if machine is burnt.

### `ongiftopened(inst)`
* **Description:** Handles opening a gift for a gift machine. Plays `gift` animation, emits receive sound, cancels any pending task, and schedules `doneact`.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.
* **Error states:** Does nothing if machine is burnt.

### `onsave(inst, data)`
* **Description:** Serializes burnt state into save data if applicable.
* **Parameters:** `inst` (Entity), `data` (table).
* **Returns:** Nothing.

### `onload(inst, data)`
* **Description:** Restores burnt state on load: calls `onburnt` on the `burnable` component if `data.burnt` is true.
* **Parameters:** `inst` (Entity), `data` (table or `nil`).
* **Returns:** Nothing.

### `createmachine(level, name, soundprefix, techtree, giftsound)`
* **Description:** Factory function that constructs a complete prefab definition for a prototype machine. Sets up transforms, components, animations, tags, sounds, and event callbacks.
* **Parameters:**  
  `level` (number) – Tech level (1 for science, 2 for alchemy),  
  `name` (string) – Prefab name root (e.g., `"researchlab"`),  
  `soundprefix` (string) – Sound prefix for machine type (`"lvl1"` or `"lvl2"`),  
  `techtree` (table) – Reference to `TUNING.PROTOTYPER_TREES.*`,  
  `giftsound` (string) – Sound variant for gift-related cues (`"science"` or `"alchemy"`).
* **Returns:** A `Prefab` instance.

## Events & listeners
- **Listens to:**  
  - `"onbuilt"` – Triggers placement sound and awards achievements.  
  - `"ms_addgiftreceiver"` – Refreshes state (e.g., loop animations) when a gift receiver is added to the machine’s range.  
  - `"ms_removegiftreceiver"` – Refreshes state when a gift receiver leaves range.  
  - `"ms_giftopened"` – Triggers gift feedback when a gift is picked up.
- **Pushes:**  
  - None directly (relies on built-in component events and `onsave`/`onload` hooks).