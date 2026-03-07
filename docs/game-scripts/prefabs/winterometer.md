---
id: winterometer
title: Winterometer
description: Displays and tracks the current ambient temperature using a meter animation, updating once per second and reacting to burning or hammering.
tags: [temperature, environment, ui, structure, status]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 72966d96
system_scope: environment
---

# Winterometer

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `winterometer` prefab is a passive environmental structure that visually indicates the current local temperature via an animated meter. It checks the temperature every second and updates the `"meter"` animation percentage. It interacts with the `burnable`, `lootdropper`, and `workable` components: it can be extinguished if burning, hammered to break and drop loot, and persists its burnt state across saves. It is non-functional when burnt.

## Usage example
```lua
-- Typically instantiated via the prefab system; example usage of its logic within mod code:
local inst = Prefab("winterometer")
inst:AddComponent("burnable")
inst:AddComponent("lootdropper")
inst:AddComponent("workable")

-- Manually trigger temperature update if needed (e.g., after world temperature changes):
if inst.components.workable ~= nil then
    inst:PushEvent("animover") -- restarts periodic temperature checking
end
```

## Dependencies & tags
**Components used:** `burnable`, `lootdropper`, `workable`, `inspectable`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`.  
**Tags added/checked:** `structure`, `burnt`.

## Properties
No public properties are defined or used directly in `winterometer.lua`.

## Main functions
### `DoCheckTemp(inst)`
* **Description:** Updates the meter animation percentage based on the current local temperature (via `GetLocalTemperature`), inverted so colder temperatures show lower percentages and hotter temperatures show higher percentages. Does nothing if the entity is `burnt`.
* **Parameters:** `inst` (entity) — the winterometer instance.
* **Returns:** Nothing.
* **Error states:** If `GetLocalTemperature(inst)` returns `nil`, the clamp behavior ensures a safe value, but undefined behavior may occur in extreme temperature environments.

### `StartCheckTemp(inst)`
* **Description:** Starts a periodic task that runs `DoCheckTemp` every 1 second. Prevents duplicate tasks.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.
* **Error states:** Does nothing if a task already exists (`inst.task ~= nil`) or if the entity is burnt.

### `onhammered(inst, worker)`
* **Description:** Handles hammering the winterometer: extinguishes fire (if burning), drops loot (including special WINTER FEAST items), spawns a `collapse_small` FX prefab, and removes the entity.
* **Parameters:** `inst` (entity), `worker` (entity — the hammerer).
* **Returns:** Nothing.

### `onhit(inst)`
* **Description:** Handles intermediate hammer hits: cancels the temperature-check task, plays the `"hit"` animation. The `animover` event listener later restarts the task.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.
* **Error states:** Does nothing if the entity is `burnt`.

### `onbuilt(inst)`
* **Description:** Called after the winterometer is built: cancels any existing temperature-check task, plays `"place"` animation, plays a sound, and relies on `animover` to restart temperature monitoring.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `makeburnt(inst)`
* **Description:** Triggered when the entity enters the `burntup` state: cancels the temperature-check task permanently.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `onsave(inst, data)`
* **Description:** Saves the burnt/burning state into the save data so it can be restored on load.
* **Parameters:** `inst` (entity), `data` (table) — the save data table.
* **Returns:** Nothing.

### `onload(inst, data)`
* **Description:** On world load, if `data.burnt` is `true`, triggers the `burnt` behavior by invoking `inst.components.burnable.onburnt(inst)`.
* **Parameters:** `inst` (entity), `data` (table) — loaded save data.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onbuilt"` — triggers `onbuilt` callback.  
  - `"animover"` — triggers `StartCheckTemp` to resume temperature monitoring.  
  - `"burntup"` — triggers `makeburnt` to stop further temperature updates.
- **Pushes:** None (this prefab does not fire custom events).