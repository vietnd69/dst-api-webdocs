---
id: healthsyncer
title: Healthsyncer
description: Synchronizes health status and percentage between server and client, and tracks health change indicators such as healing or damage over time.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: b1400b44
---

# Healthsyncer

## Overview
The `HealthSyncer` component tracks and synchronizes a player's health percentage and current health status (e.g., healing, taking damage, starving) across server and client. It maintains networked state variables for health percentage and status, and updates them based on gameplay events and component states (e.g., freezing, overheating, hunger, regenerative debuffs). It is server-authoritative for status computation and client-bound for synchronization.

## Dependencies & Tags
- Requires the `health` component for status tracking (e.g., `inst.components.health:GetPercent()`, `health.takingfiredamage`, `health:IsHurt()`).
- Uses the `hunger` component to detect starvation.
- Uses `IsFreezing()` and `IsOverheating()` methods, implying interaction with temperature-related logic.
- Adds networked variables: `_status` (net_tinybyte) and `_healthpct` (net_float).
- Adds listeners for events like `healthdelta`, `startcorrosivedebuff`, `starthealthregen`, `startsmallhealthregen`, `stopsmallhealthregen`, and `onremove`.
- Does not directly add or remove entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_status` | `net_tinybyte` | `0` | Networked status value encoding health trend: 0=none, 1=small heal, 2=large heal, 3=damage/down; server-only, mapped to `GetOverTime()` range [-2,2]. |
| `_healthpct` | `net_float` | `1` | Networked health percentage (0.0–1.0), updated on server via `healthdelta` and sent to clients. |
| `corrosives` | `table` | `{}` | Server-side set of active corrosive debuffs; used to track health-damaging over-time effects. |
| `hots` | `table` | `{}` | Server-side set of active large healing-over-time (HoT) debuffs. |
| `small_hots` | `table` | `{}` | Server-side set of active small healing-over-time debuffs. |

## Main Functions
### `GetPercent()`
* **Description:** Returns the current health percentage (as a float between 0.0 and 1.0), read from the networked `_healthpct` variable.
* **Parameters:** None.

### `GetOverTime()`
* **Description:** Decodes the `_status` value into a canonical health trend indicator: -2 (large damage), -1 (small damage), 0 (no change), 1 (small heal), 2 (large heal). Values outside [1,4] map to 0.
* **Parameters:** None.

### `OnUpdate(dt)` *(server only)*
* **Description:** Periodically recalculates health status based on various debuffs (freezing, overheating, starvation, corrosives, fire damage) and buffs (sleep healing, HoTs, regen-equipment). Updates the `_status` network variable if changed and triggers `healthstatusdirty` for client sync.
* **Parameters:** `dt` — time delta since last update (unused, but passed by updater).

## Events & Listeners
- **Listens to (server-side):**
  - `healthdelta`: Updates health percentage on damage/heal.
  - `startcorrosivedebuff`: Registers corrosive debuff and subscribes to its `onremove`.
  - `starthealthregen`: Registers large HoT debuff and subscribes to `onremove`.
  - `startsmallhealthregen`: Registers small HoT debuff and subscribes to `onremove`.
  - `stopsmallhealthregen`: Immediately unregisters small HoT debuff.
- **Listens to (client-side):**
  - `healthstatusdirty`: Triggers `OnStatusDirty` to notify UI of status change.
  - `healthpctdirty`: Triggers `OnHealthPctDirty` to notify UI of percentage change.
- **Pushes (server-side):**
  - `healthdelta`: On initialization (`InitServer`) to set initial health percentage.
- **Pushes (client/server-side):**
  - `clienthealthstatusdirty`: Via `OnStatusDirty` — internal indicator for client health status update.
  - `clienthealthdirty`: Via `OnHealthPctDirty`, with payload `{ percent = <float> }` — indicates new health percentage for client.