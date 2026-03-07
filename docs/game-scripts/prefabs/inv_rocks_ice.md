---
id: inv_rocks_ice
title: Inv Rocks Ice
description: Represents a frozen ice rock that provides health, moisture, cooling effects, and can be used as a temporary water source; it melts over time or when exposed to fire.
tags: [inventory, consumable, environmental, watersource, crafting]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e1c1cf43
system_scope: entity
---

# Inv Rocks Ice

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`inv_rocks_ice` is a prefab representing an ice rock that functions as a consumable item with multiple gameplay roles: it is edible (providing minimal health and hunger recovery, plus cooling effects), a temporary water source, a repair material, and a source of soil moisture when melted outdoors. It interacts primarily with the `edible`, `perishable`, `watersource`, `repairer`, `inventoryitem`, and `stackable` components. The ice melts quickly when thawed (via temperature or fire), optionally releasing moisture into the environment or a nearby character.

## Usage example
```lua
local inst = SpawnPrefab("ice")
inst.Transform:SetPosition(x, y, z)
-- Ice is automatically perishable and will melt over time
-- If held by a player, melting increases their moisture
-- If on the ground, melting adds moisture to the soil
```

## Dependencies & tags
**Components used:** `edible`, `smotherer`, `perishable`, `tradable`, `stackable`, `inspectable`, `inventoryitem`, `repairer`, `watersource`, `snowmandecor`, `bait`, `soundemitter`, `animstate`, `transform`, `network`  
**Tags:** `frozen`, `molebait`, `watersource`

## Properties
No public properties.

## Main functions
### `onsave(inst, data)`
* **Description:** Saves the current animation state (`animname`) to persistent data for world save/load sync.
* **Parameters:** `inst` (Entity) — the ice instance; `data` (table) — save data table to populate.
* **Returns:** Nothing.

### `onload(inst, data)`
* **Description:** Restores the animation state from saved data upon world load.
* **Parameters:** `inst` (Entity) — the ice instance; `data` (table) — loaded save data.
* **Returns:** Nothing.
* **Error states:** If `data.anim` is missing or `nil`, no animation is restored.

### `onperish(inst)`
* **Description:** Triggered when the ice melts. If held by a player, it gives moisture to the owner; if on the ground, it deposits moisture into the soil at its location. In either case, the ice is removed.
* **Parameters:** `inst` (Entity) — the ice instance.
* **Returns:** Nothing.

### `onfiremelt(inst)`
* **Description:** Enables accelerated melting when exposed to fire (via `frozenfiremult` flag).
* **Parameters:** `inst` (Entity) — the ice instance.
* **Returns:** Nothing.

### `onstopfiremelt(inst)`
* **Description:** Disables accelerated melting when no longer exposed to fire.
* **Parameters:** `inst` (Entity) — the ice instance.
* **Returns:** Nothing.

### `onuseaswatersource(inst)`
* **Description:** Used when the ice is utilized as a water source (e.g., filling containers). Consumes one stack unit and removes the item.
* **Parameters:** `inst` (Entity) — the ice instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `firemelt` — activates fire-based melting acceleration (`frozenfiremult = true`).  
- **Listens to:** `stopfiremelt` — disables fire-based melting acceleration (`frozenfiremult = false`).  
- **Pushes:** None directly; relies on event-driven destruction (e.g., `animover` → `Remove` for melt animation).