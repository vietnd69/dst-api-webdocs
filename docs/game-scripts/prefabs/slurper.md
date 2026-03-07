---
id: slurper
title: Slurper
description: Equippable monster hat that attaches to characters, drains their hunger or health, and emits a pulsing light; it also acts as a hostile, autonomous creature when unequipped.
tags: [equippable, monster, light, combat, brain]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e500e2c6
system_scope: entity
---

# Slurper

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `slurper` is a prefabricated entity that functions as both an equippable headgear and a hostile monster. When equipped by a character, it drains the owner's hunger (or health if hunger is unavailable), emits a pulsing light, and suppresses sleeping. When unequipped, it resumes autonomous behavior using its brain (`slurperbrain`) and stategraph (`SGslurper`). It integrates with multiple components: `equippable`, `combat`, `health`, `sanityaura`, `sleeper`, `locomotor`, `knownlocations`, `burnable`, `freezable`, and `lootdropper`.

## Usage example
```lua
-- Instantiate a slurper instance (typically done internally by the game)
local slurper = SpawnPrefab("slurper")
-- The slurper is not meant to be spawned and equipped manually via Lua;
-- equipping is handled by the inventory system via EQUIPSLOTS.HEAD.
-- To equip programmatically:
player.components.inventory:Equip(slurper, EQUIPSLOTS.HEAD)
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `equippable`, `locomotor`, `combat`, `health`, `lootdropper`, `sleeper`, `knownlocations`, `sanityaura`, `burnable`, `freezable`.  
**Tags added:** `cavedweller`, `monster`, `hostile`, `slurper`, `mufflehat`.  
**Tags checked:** `player`, `pig`, `manrabbit`, `equipmentmodel`, `INLIMBO`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_loading` | boolean | `nil` | Temporary flag used during world load to handle player inventory initialization. |
| `_light` | Entity | `nil` | Light FX entity, spawned as `slurperlight`. |
| `_owner` | Entity | `nil` | The character currently wearing the slurper. |
| `onattach` | function | `(owner) => ...` | Callback fired when equipped; handles FX, animation, and hunger drain task. |
| `ondetach` | function | `() => ...` | Callback fired when unequipped; restores owner animation and resets light parent. |
| `cansleep` | boolean | `true` | Flag used by `sleeper` component; disabled while equipped. |
| `HatTest` | function | `CanHatTarget` | Predicate function used to validate a target for equipping. |

## Main functions
### `OnEquip(inst, owner)`
*   **Description:** Called when the slurper is equipped on a character’s head. Activates light, plays attachment sound, overrides animations, and starts a periodic hunger/health drain task. If the target is invalid (e.g., already wearing a slurper or no inventory), it unequips immediately.
*   **Parameters:**  
    `inst` (Entity) – the slurper prefab instance.  
    `owner` (Entity) – the character equipping the slurper.
*   **Returns:** Nothing.
*   **Error states:** Immediately unequips if `CanHatTarget(inst, owner)` returns false.

### `OnUnequip(inst, owner)`
*   **Description:** Called when the slurper is removed. Disables light pulsing, plays detachment sound, restores owner animations, kills looping sound, remembers home position, and resumes sleep capability after 10 seconds.
*   **Parameters:**  
    `inst` (Entity) – the slurper prefab instance.  
    `owner` (Entity) – the character that was wearing the slurper.
*   **Returns:** Nothing.

### `slurphunger(inst, owner)`
*   **Description:** Periodic function called every 2 seconds while equipped. Reduces owner's hunger by 3 points; if no hunger component exists, reduces health by 5 points.
*   **Parameters:**  
    `inst` (Entity) – the slurper instance (unused).  
    `owner` (Entity) – the equipped character.
*   **Returns:** Nothing.

### `Retarget(inst)`
*   **Description:** Calculates the next combat target. Prefers characters with hunger and inventory; falls back to any valid combat target. Only targets within 15 units and not too far from the slurper’s remembered “home” position.
*   **Parameters:**  
    `inst` (Entity) – the slurper instance.
*   **Returns:** Entity or `nil` – the chosen target or nothing if out of range.

### `KeepTarget(inst, target)`
*   **Description:** Validates whether the current target should be retained. Returns `false` if the slurper has moved more than 30 tiles from its “home” location.
*   **Parameters:**  
    `inst` (Entity) – the slurper instance.  
    `target` (Entity) – the current target (unused).
*   **Returns:** boolean – `true` if the target is within 30 units of home; `false` otherwise.

### `CanHatTarget(inst, target)`
*   **Description:** Validates if a potential target can wear the slurper. Requires a non-nil inventory and either an open inventory, or being a pig, manrabbit, or equipment model. Also ensures the target is not already wearing a slurper.
*   **Parameters:**  
    `inst` (Entity) – the slurper instance.  
    `target` (Entity) – candidate character.
*   **Returns:** boolean – `true` if target is valid for equipping.

### `SleepTest(inst)`
*   **Description:** Determines if the slurper should enter sleep state. Returns `false` if awake conditions apply (e.g., equipped, burning, frozen, near home); otherwise returns `true` if close to home.
*   **Parameters:**  
    `inst` (Entity) – the slurper instance.
*   **Returns:** boolean – `true` if ready to sleep.

### `WakeTest(inst)`
*   **Description:** Determines if the slurper should wake up. Returns `true` if awake conditions apply (e.g., equipped, burning, near far from home); otherwise returns `true` if far from home.
*   **Parameters:**  
    `inst` (Entity) – the slurper instance.
*   **Returns:** boolean – `true` if should wake.

### `OnUpdateLight(inst, dframes)`
*   **Description:** Animates the slurper’s light intensity, radius, and falloff between low and high values. Called periodically to interpolate frame-by-frame.
*   **Parameters:**  
    `inst` (Entity) – the slurper instance.  
    `dframes` (number) – frame increment step.
*   **Returns:** Nothing.

### `OnLightDirty(inst)`
*   **Description:** Ensures light interpolation begins by starting the periodic task if not already active.
*   **Parameters:**  
    `inst` (Entity) – the slurper instance.
*   **Returns:** Nothing.

### `OnAttacked(inst, data)`
*   **Description:** Event listener for `"attacked"` events; sets the attacker as the current combat target.
*   **Parameters:**  
    `inst` (Entity) – the slurper instance.  
    `data` (table) – event payload containing `attacker`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `"attacked"` – triggers `OnAttacked` to set combat target.  
  `"onremove"` (on owner) – triggers `ondetach` when the owner is removed.
- **Pushes:** No events directly; relies on component events (`healthdelta`, `unequip`, `dropitem`) and internal callbacks.