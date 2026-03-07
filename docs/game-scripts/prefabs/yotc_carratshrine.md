---
id: yotc_carratshrine
title: Yotc Carratshrine
description: Manages the Carrat Shrine entity's state transitions, offering interactions, prototyping access, and burn mechanics in the YOTC content.
tags: [structure, offering, burning, crafting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 31f91f68
system_scope: world
---

# Yotc Carratshrine

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `yotc_carratshrine` prefab represents an interactive structure that accepts specific offerings (carrots or seed items), unlocks prototyping capabilities upon offering, and supports burning mechanics. It transitions between three primary states—`EMPTY`, `OFFERED`, and `BURNT`—and integrates with the world's YOTC race prize manager to visually update its idol symbol. The shrine delegates offering acceptance to a `trader` component, manages offering lifecycle events, and adapts loot and animation behavior when burnt or hammered.

## Usage example
```lua
local shrine = SpawnPrefab("yotc_carratshrine")
shrine.Transform:SetPosition(x, y, z)

-- To offer a carrot to the shrine (triggers prototyping)
shrine.components.trader:AcceptItem(carrot_prefab)

-- To manually set an offering if pre-loading
if shrine.offering == nil then
    shrine.components.trader.onaccept(shrine, giver, carrot_prefab)
end
```

## Dependencies & tags
**Components used:** `burnable`, `hauntable`, `inspectable`, `lootdropper`, `prototyper`, `trader`, `workable`, `yotc_raceprizemanager` (world-level), `inventoryitem` (indirect), `fueled` (indirect via `MakeMediumBurnable`), `propagator` (indirect), `soundemitter`, `animstate`, `minimapentity`, `transform`, `network`, `obstaclephysics`, `dehydratable`, `lunarhailbuildup`.

**Tags:** Adds `structure`, `carratshrine`, `prototyper` (pristine state only).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `offering` | entity or `nil` | `nil` | Reference to the currently offered item (carrot or seeds). Cleared when consumed, perished, or burnt. |

## Main functions
### `SetOffering(inst, offering, loading)`
* **Description:** Sets a new offering on the shrine, registers lifecycle listeners, updates visuals (symbol override for carrot vs seeds), and activates the `prototyper` component.
* **Parameters:**
  * `inst` (entity) — The shrine entity.
  * `offering` (entity) — The item to place as offering.
  * `loading` (boolean) — If `true`, suppresses audio/animation feedback (used for save/load).
* **Returns:** Nothing.
* **Error states:** Early-return if `offering` is already set.

### `MakeEmpty(inst)`
* **Description:** Clears the current offering (if any), removes the `prototyper` component, and reinitializes the `trader` component with callback and configuration.
* **Parameters:**
  * `inst` (entity) — The shrine entity.
* **Returns:** Nothing.

### `DropOffering(inst, worker)`
* **Description:** Removes and returns the current offering to the scene (either flung to a worker or world position), cleans up listeners, and hides the seeds symbol.
* **Parameters:**
  * `inst` (entity) — The shrine entity.
  * `worker` (entity or `nil`) — If provided, launches the offering at the worker using `LaunchAt`.
* **Returns:** Nothing.

### `PrizeChange(inst, instant)`
* **Description:** Updates the idol animation based on whether a race prize is available in the world (YOTC event logic). Hides/shows `idol_1` and `idol_3` animations.
* **Parameters:**
  * `inst` (entity) — The shrine entity.
  * `instant` (boolean) — If `true`, skips animation playback (used on load).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `onremove` (offering) — Calls `MakeEmpty`.
  - `perished` (offering) — Calls `OnOfferingPerished`.
  - `onbuilt` (shrine) — Calls `onbuilt`.
  - `yotc_ratraceprizechange` (world) — Calls `PrizeChange`.
  - `ondeconstructstructure` (shrine) — Calls `DropOffering`.
- **Pushes:**
  - No events are directly pushed by this prefab's functions. State changes affect component listeners or trigger world events via callbacks (`onburnt`, `onaccept`, etc.).

> Note: This prefab’s internal logic primarily resides in event callbacks and initialization functions rather than standalone methods. Its observable behavior is mediated through component interactions (`trader`, `workable`, `burnable`).