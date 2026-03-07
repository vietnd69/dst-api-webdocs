---
id: punchingbag
title: Punchingbag
description: A deployable, hammerable structure that absorbs and displays hit damage via rotating numeric digits; accepts equipped items via trader logic and drops loot when destroyed.
tags: [combat, structure, inventory, damage]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: bfcbb9a3
system_scope: entity
---

# Punchingbag

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `punchingbag` is a deployable structure prefab that functions as a combat test dummy. It integrates with multiple core components: `combat` (receives hits), `health` (tracks damage), `inventory` (accepts equipment), `trader` (handles item swapping), `workable` (responds to hammering), and `burnable` (transforms on fire damage). When damaged, it visually displays the damage amount using animated digit columns. Upon hammering completion, it drops loot and collapses. On burning, it sheds its functional components and becomes a burnt structure.

## Usage example
```lua
local inst = SpawnPrefab("punchingbag")
if inst and inst.components then
    inst.Transform:SetPosition(10, 0, 20)
    inst:PushEvent("onbuilt") -- triggers initial animation/sound
    -- Simulate a hit dealing 50 damage
    inst:PushEvent("healthdelta", { amount = -50 })
    -- Equip an item (e.g., helmet)
    local helmet = SpawnPrefab("helmet")
    inst:PushEvent("equip", { item = helmet })
end
```

## Dependencies & tags
**Components used:** `combat`, `debuffable`, `colouradder`, `bloomer`, `health`, `inspectable`, `lootdropper`, `inventory`, `trader`, `workable`, `burnable`, `activatable`, `planarentity` (lunar/shadow variants only)  
**Tags added:** `structure`, `equipmentmodel`, `wooden`, and optionally `lunar_aligned` or `shadow_aligned` for variant prefabs

## Properties
No public properties are directly exposed or modified in this script.

## Main functions
This prefab does not define custom components or methods — it configures prefabs via factory functions (`defaultfn`, `lunarfn`, `shadowfn`). All logic resides in internal helper functions invoked via events.

### `do_digits(inst, number, initspawn)`
*   **Description:** Updates the animation to display a numeric value across four digit columns using symbolic overlays. Called on damage (`healthdelta`) and block events.
*   **Parameters:**  
    - `inst` (Entity) — the punching bag instance.  
    - `number` (number) — absolute value of damage or zero (for block). Clamped to `[0, 9999]`.  
    - `initspawn` (boolean) — if `true`, suppresses sound playback (initial spawn).  
*   **Returns:** Nothing.  
*   **Error states:** No-op if `number` is `nil`; plays placement sound unless `initspawn` is `true` or the bag is burning.

### `on_health_delta(inst, data)`
*   **Description:** Handler for the `healthdelta` event. Displays the absolute damage amount via `do_digits` when damage is dealt.
*   **Parameters:**  
    - `data` (table) — event payload with `amount` (number) — negative values trigger display.  
*   **Returns:** Nothing.  
*   **Error states:** No effect if `data.amount > 0`.

### `on_blocked(inst, data)`
*   **Description:** Handler for the `blocked` event. Resets displayed digits to `0` on block.
*   **Parameters:** None (uses `data` implicitly via closure).  
*   **Returns:** Nothing.

### `do_hit_presentation(inst)`
*   **Description:** Plays the "hit" animation and hit sound on the bag, unless it is burnt.
*   **Parameters:**  
    - `inst` (Entity) — the punching bag instance.  
*   **Returns:** Nothing.  
*   **Error states:** Does not re-play if the current animation is already "hit" and frame `< 4`.

### `onhit(inst, data)`
*   **Description:** Event callback for `attacked`. Triggers `do_hit_presentation`.
*   **Parameters:** None (uses `data` implicitly).  
*   **Returns:** Nothing.

### `should_accept_item(inst, item, doer)`
*   **Description:** Trader filter predicate. Accepts only items equipped in `HEAD` or `BODY` slots.
*   **Parameters:**  
    - `inst` (Entity) — the punching bag instance.  
    - `item` (Entity) — candidate item.  
    - `doer` (Entity) — the entity equipping the item.  
*   **Returns:** `boolean`, `string` — `true, "GENERIC"` if accepted, otherwise `false, nil`.

### `on_get_item(inst, giver, item)`
*   **Description:** Trader handler. Drops any existing item in the same equip slot before equipping the new item.
*   **Parameters:**  
    - `inst` (Entity) — the punching bag instance.  
    - `giver` (Entity) — source of the item.  
    - `item` (Entity) — item being added.  
*   **Returns:** Nothing.

### `on_finished_hammering(inst)`
*   **Description:** Called on workable completion (hammering). Drops loot, spawns `collapse_big` FX, and removes the entity.
*   **Parameters:**  
    - `inst` (Entity) — the punching bag instance.  
*   **Returns:** Nothing.

### `on_hammered(inst)`
*   **Description:** Called per hammer hit. Plays hit presentation and drops all inventory items.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `onbuilt(inst)`
*   **Description:** Event callback for `onbuilt`. Plays the "place" animation and placement sound.
*   **Parameters:**  
    - `inst` (Entity) — the punching bag instance.  
*   **Returns:** Nothing.

### `onequipped(inst, data)`
*   **Description:** Event callback for `equip`. Plays the "swap" sound unless inventory is loading.
*   **Parameters:** None (uses `data` implicitly).  
*   **Returns:** Nothing.

### `on_burnt(inst)`
*   **Description:** Cleanup handler triggered on burn completion. Removes trader, activatable, combat, health, and inventory components; drops inventory; removes event callbacks; and calls `DefaultBurntStructureFn`.
*   **Parameters:**  
    - `inst` (Entity) — the punching bag instance.  
*   **Returns:** Nothing.

### `on_save(inst, data)`
*   **Description:** Serialization callback. Marks `data.burnt = true` if the bag is currently burning or burnt.
*   **Parameters:**  
    - `inst` (Entity) — the punching bag instance.  
    - `data` (table) — save table.  
*   **Returns:** Nothing.

### `on_load(inst, data)`
*   **Description:** Deserialization callback. Calls `onburnt` if `data.burnt` is `true`.
*   **Parameters:**  
    - `inst` (Entity) — the punching bag instance.  
    - `data` (table) — loaded save data (optional).  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `attacked` — triggers hit presentation (`onhit`)  
  - `onbuilt` — triggers placement animation (`onbuilt`)  
  - `healthdelta` — updates damage digits (`on_health_delta`)  
  - `blocked` — resets digits to `0` (`on_blocked`)  
  - `equip` — triggers swap sound (`onequipped`)  
- **Pushes:** None (this prefab only listens and responds to events, does not fire custom events).

None of the listed event handlers push events directly. The `basefn` adds server-only logic (e.g., registering for damage tracking in lava arena mode), but no custom `PushEvent` calls are present in the file.
