---
id: healthsyncer
title: Healthsyncer
description: Synchronizes health status and percentage between server and client, tracking health regen/degen sources for UI indicators.
tags: [network, health, ui, combat]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b1400b44
system_scope: network
---

# Healthsyncer

> Based on game build **7140014** | Last updated: 2026-03-03

## Overview
`Healthsyncer` manages network synchronization of health status and percentage for an entity, primarily to drive client-side UI indicators (e.g., healing/healing arrows, health bar updates). It tracks conditions that cause health to go up or down over time — such as freezing, overheating, starvation, fire damage, or active regenerative effects — and transmits encoded status values to clients via replicated network properties. On the server, it computes and updates the status each frame; on the client, it listens for updates and triggers UI refreshes.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("healthsyncer")

-- Server-side: the component auto-starts status updates and syncs health changes.
-- Client-side: listen for UI updates:
inst:ListenForEvent("clienthealthdirty", function(inst, data)
    print("Health percentage updated:", data.percent)
end)

inst:ListenForEvent("clienthealthstatusdirty", function(inst)
    local status = inst.components.healthsyncer:GetOverTime()
    print("Health status changed, encoded value:", status)
end)
```

## Dependencies & tags
**Components used:** `health`, `hunger`, `inventory`  
**Tags:** None added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_status` | `net_tinybyte` | `0` | Network-replicated status code (0–4) encoding health over-time direction/magnitude. |
| `_healthpct` | `net_float` | `1.0` | Network-replicated health percentage (0.0–1.0). |
| `corrosives` | table | `{}` | Server-only: maps active corrosive debuff instances to `true`. |
| `hots` | table | `{}` | Server-only: maps active large health regen debuff instances to `true`. |
| `small_hots` | table | `{}` | Server-only: maps active small health regen debuff instances to `true`. |

## Main functions
### `GetPercent()`
* **Description:** Returns the current health percentage (from the networked value), used for UI rendering and logic.
* **Parameters:** None.
* **Returns:** `number` — current health percentage, clamped between `0.0` and `1.0`.
* **Error states:** None.

### `GetOverTime()`
* **Description:** Decodes and returns the current health over-time status as an integer indicating direction/magnitude: `-2` (large down), `-1` (small down), `0` (none), `1` (small up), `2` (large up).
* **Parameters:** None.
* **Returns:** `number` — integer status code as described above.
* **Error states:** Returns `0` if `_status` value is outside `[1,4]` range (e.g., invalid or uninitialized).

## Events & listeners
- **Listens to (server only):**
  - `healthdelta` — triggers status update and health percentage sync.
  - `startcorrosivedebuff`, `starthealthregen`, `startsmallhealthregen`, `stopsmallhealthregen` — manage internal regen/degen debuff tracking lists.
- **Listens to (client only):**
  - `healthstatusdirty` — fires `clienthealthstatusdirty` event to trigger UI refresh.
  - `healthpctdirty` — fires `clienthealthdirty` with `{ percent = ... }` to update health display.
- **Pushes (server only, via event handlers):**
  - `clienthealthdirty` — fired on health percentage change (includes `{ percent = ... }`).
  - `clienthealthstatusdirty` — fired when health over-time status changes.
- **Pushes (client only):** None.

