---
id: dock_damage
title: Dock Damage
description: Visual and logic entity that represents damaged segments of docks and rope bridges, synced to the world's dockmanager and ropebridgemanager for repair interactions.
tags: [repair, environment, dock, ropebridge, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c1e78545
system_scope: environment
---

# Dock Damage

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`dock_damage` is a client-side visual and server-side logic entity used to represent damaged sections of docks and rope bridges. It is spawned and managed by `dockmanager` and `ropebridgemanager`. When repaired via a repair item with a `repairer` component, it repairs itself and recursively repairs adjacent segments of rope bridges. It has no persistent state (`persists = false`) and serves purely as a render and behavior proxy.

## Usage example
This prefab is not instantiated directly in mod code. It is created and managed internally by `dockmanager.lua` and `ropebridgemanager.lua` when visualizing or repairing dock/bridge damage.

```lua
-- Example of internal usage by dockmanager:
-- inst = CreateEntity()
-- inst:AddComponent("repairable")
-- inst.components.repairable.onrepaired = OnRepaired
-- inst.setdamagepercent(0.5)  -- Triggers idle2 animation
```

## Dependencies & tags
**Components used:** `repairable`, `repairer` (read-only, via `repair_item.components.repairer`)
**Tags:** Adds `NOBLOCK`, `ignoremouseover`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `damage` | number | `0` | Current damage level; controls animation branch via `setdamagepercent`. |
| `setdamagepercent` | function | — | Callback assigned to update visual state when damage changes. |

## Main functions
### `setdamagepercent(damage)`
* **Description:** Updates the damage level and selects the appropriate idle animation (`idle1`, `idle2`, or `idle3`) based on threshold ranges.
* **Parameters:** `damage` (number) — normalized damage value (0.0 = fully repaired, 1.0 = fully damaged).
* **Returns:** Nothing.
* **Error states:** Animation branch logic uses thresholds: `<0.33` → `"1"`, `<0.66` → `"2"`, else `"3"`.

### `OnRepaired(inst, doer, repair_item)`
* **Description:** Callback invoked when the dock segment is repaired. Repairs itself and attempts to repair adjacent rope bridge segments (up, down, left, right) if present and repairable.
* **Parameters:**
  * `inst` — the `dock_damage` entity instance.
  * `doer` — the entity performing the repair (usually a player).
  * `repair_item` — the item used for repair, expected to have a `repairer` component.
* **Returns:** Nothing.
* **Error states:** Returns early if `repair_item` lacks `repairer.healthrepairvalue`, or if world-level `dockmanager`/`ropebridgemanager` components are missing. Assumes tile-grid alignment via `TILE_SCALE`.

## Events & listeners
None identified.