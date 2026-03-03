---
id: quagmire_hangriness
title: Quagmire Hangriness
description: Manages the hangriness meter and progression system for Quagmire-era entities, including hunger depletion simulation, acceleration-based speed modeling, and rumble sound triggering.
tags: [combat, hunger, boss, quagmire]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 0e7df35c
system_scope: entity
---

# Quagmire Hangriness

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`QuagmireHangriness` models the hunger mechanic for Quagmire creatures, tracking a `current` hangriness value that decreases over time with non-constant acceleration. It handles state transitions (level changes), client-server synchronization via network variables, and timed rumble events during active hunger phases. The component is attached to entities involved in Quagmire encounters (e.g., bosses or key NPCs), and integrates with an internal `event_server_data` system for authoritative logic on the master simulation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("quagmire_hangriness")
inst.components.quagmire_hangriness:Start(300) -- Begin hunger with 300s level start buffer
print(inst.components.quagmire_hangriness:GetPercent()) -- 0.0 to 1.0
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `hungry`, `starving`, `ravenous`, and `matched` conditionally during Quagmire gameplay.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | `inst` | Reference to the entity this component is attached to. |
| `_netvars.current` | number | `6000` | Current hangriness value (0–6000). |
| `_netvars.speed` | number | `0` | Current depletion speed, updated on each update. |
| `_netvars.levelstart` | number | `0` | Remaining time at the start of a level (e.g., pre-match buffer). |
| `_netvars.rumbled` | boolean | `false` | Whether a rumble event is currently active. |
| `_netvars.matched` | boolean | `false` | Whether the creature is in a matching state (e.g., player interaction). |

## Main functions
### `GetCurrent()`
* **Description:** Returns the current hangriness value.
* **Parameters:** None.
* **Returns:** `number` — current value in range `[0, 6000]`.

### `GetPercent()`
* **Description:** Returns the hangriness level as a normalized percentage.
* **Parameters:** None.
* **Returns:** `number` — value in range `[0.0, 1.0]`.

### `GetLevel()`
* **Description:** Returns the current hunger level: `1` (mild), `2` (moderate), or `3` (severe/critical).
* **Parameters:** None.
* **Returns:** `number` — `1`, `2`, or `3`. Level `3` is returned if hangriness is `0`, or speed is `≥ 4`, or speed is `≥ 8`.

### `GetTimeRemaining()`
* **Description:** Calculates the remaining time (in seconds) until hangriness reaches `0`, using piecewise constant acceleration segments defined by `ACCEL_THRESHOLDS`.
* **Parameters:** None.
* **Returns:** `number` — projected time remaining in seconds.

### `Start(levelstart)`
* **Description (master only):** Begins the hangriness progression. Initializes the level-start buffer and triggers syncing.
* **Parameters:** `levelstart` (number) — time in seconds before hangriness begins depleting.
* **Returns:** Nothing.

### `Stop()`
* **Description (master only):** Stops hangriness progression and resets timing buffers.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description (master only):** Called every frame during active phases. Updates speed and hangriness value based on piecewise acceleration, triggers rumbles, and ensures network sync.
* **Parameters:** `dt` (number) — delta time in seconds.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `levelstartdirty` — triggers state entry/exit for active hunger phases.  
  - `rumbleddirty` — fires rumble sound when network flag updates.  
  - `matcheddirty` — fires matched sound when matching state changes.
- **Pushes:**  
  - `quagmirehangrinessrumbled` — includes `{ major = boolean }`.  
  - `quagmirehangrinessmatched` — includes `{ matched = boolean }`.
