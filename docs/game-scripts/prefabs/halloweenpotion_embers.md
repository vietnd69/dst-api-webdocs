---
id: halloweenpotion_embers
title: Halloweenpotion Embers
description: A debuff component that attaches to campfires and generates visual/sound effects based on the fire's fuel level.
tags: [combat, environment, fx]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0b8e53ac
system_scope: environment
---

# Halloweenpotion Embers

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `halloweenpotion_embers` prefab defines two related prefabs: a consumable potion item and its attached debuff effect. When used on a campfire, the potion applies a `CLASSIFIED` debuff that visually and aurally enhances the fire. The debuff dynamically adjusts its animation and sound intensity based on the campfire's current fuel section (using the `fueled` component). It also modifies the campfire’s fuel consumption rate via a modifier. The debuff persists across fire extinction and is cleaned up when detached.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fueled")
inst:AddDebuff("halloweenpotion_embers_buff", "halloweenpotion_embers_buff")
```

## Dependencies & tags
**Components used:** `debuff`, `timer`, `inspectable`, `fuel`, `fueled`
**Tags:** Adds `CLASSIFIED` to the buff entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `potion_tunings` | table | `nil` | Tuning table with `BUILD`, `ANIMS`, `PRE_ANIM`, `SOUND`, and `SOUND_NAME` keys. Set on creation. |
| `buff_prefab` | string | `nil` | Prefab name of the debuff to attach (e.g., `"halloweenpotion_embers_buff"`). Set on potion creation. |

## Main functions
This component is primarily defined in two prefabs: `halloweenpotion_embers` (potion item) and `halloweenpotion_embers_buff` (debuff entity). The main logic resides in the debuff’s callback functions.

### `buff_OnAttached(inst, target)`
*   **Description:** Called when the debuff is attached to a target (e.g., a campfire). Sets up visual state, sound, and fuel consumption modifier; registers event listeners.
*   **Parameters:**  
    *   `inst` (Entity) — the debuff entity itself.  
    *   `target` (Entity) — the entity the debuff was attached to (must have `fueled` and `transform` components).
*   **Returns:** Nothing.
*   **Error states:** Skips modifiers if `target.components.fueled` is `nil`.

### `anim_buff_OnDetached(inst, target)`
*   **Description:** Called when the debuff is detached or removed. Kills sound, removes fuel modifier, and erodes the entity.
*   **Parameters:**  
    *   `inst` (Entity) — the debuff entity.  
    *   `target` (Entity) — the previously attached entity.
*   **Returns:** Nothing.

### `buff_OnLevelChanged(inst, target, level_data)`
*   **Description:** Adjusts animation and sound intensity when the target’s fuel level changes (e.g., fuel added/removed). Anim sequence depends on `PRE_ANIM`.
*   **Parameters:**  
    *   `inst` (Entity) — the debuff entity.  
    *   `target` (Entity) — the campfire.  
    *   `level_data` (table|nil) — optional table containing `oldsection` and `newsection` numbers.
*   **Returns:** Nothing.
*   **Error states:** Stops the debuff if fuel level drops to `0`.

### `buff_OnExtended(inst, target)`
*   **Description:** Resets the internal buff timer when the debuff duration is extended (e.g., via another application).
*   **Parameters:**  
    *   `inst` (Entity) — the debuff entity.  
    *   `target` (Entity) — the attached target.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onextinguish` (on target) — stops the debuff.  
  - `onfueldsectionchanged` (on target) — triggers animation/sound update via `buff_OnLevelChanged`.  
  - `timerdone` (on self) — triggers `buff_OnTimerDone` to stop the debuff on timeout.
- **Pushes:** None directly. Debuff removal is handled internally via `components.debuff:Stop()`.