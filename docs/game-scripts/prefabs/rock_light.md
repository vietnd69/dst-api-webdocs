---
id: rock_light
title: Rock Light
description: A durable, fueled light source that transitions between burn states based on fuel level and can trigger a controlled explosion when fully depleted.
tags: [environment, light, structure]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 40c9674e
system_scope: environment
---

# Rock Light

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `rock_light` prefab functions as a fixed, stone-encased lantern that burns slowly over time. It relies on the `fueled` component to manage fuel consumption in stages and the `burnable` component to render fire effects and interact with propagators. Its behavior is unique: as fuel decreases, it cycles through distinct visual states (MAX → MEDIUM → LOW), and when fully depleted (`section == 0`), it extinguishes and begins a countdown before erupting in a localized explosion. After the explosion, it "seals up" and resets to full workability, ready to be reignited. It also provides a small sanity aura to nearby players in darkness.

## Usage example
```lua
-- Typical usage is handled internally; this prefab is spawned automatically in the world.
-- Modders may spawn it manually as follows:
local rock = SpawnPrefab("rock_light")
rock.Transform:SetPosition(x, y, z)

-- The rock automatically begins burning, cycling fuel sections, and eventually exploding.
-- It cannot be manually relit; it resets after explosion.
```

## Dependencies & tags
**Components used:** `sanityaura`, `burnable`, `workable`, `fueled`, `inspectable`  
**Tags:** Adds `rocklight`, `structure`, `stone`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `state` | number | `6` (`MAXWORK`) | Internal state tracking current visual/working stage: `6` = MAX, `4` = MEDIUM, `2` = LOW. |
| `exploding` | boolean | `false` | Indicates whether the rock is currently in its explosion sequence. |
| `lavaLight` | entity | `nil` | Reference to the spawned `lavalight` during explosion. |
| `blastTask` | task | `nil` | Scheduled explosion task, rescheduled if work not completed before detonation. |

## Main functions
### `SetWorkLevel(inst, workleft)`
* **Description:** Adjusts the rock’s visual animation and fuel consumption behavior based on the current work left (influenced by mining). It handles transitions between MAX → MEDIUM → LOW states and triggers special effects (e.g., sound, fuel reset).
* **Parameters:**  
  `inst` (entity) — The rock entity.  
  `workleft` (number) — Current work remaining; negative values are clamped to 0.  
* **Returns:** Nothing.
* **Error states:** No-op if `inst.exploding` is true.

### `onhammered(inst, worker)`
* **Description:** Called when mining finishes (work reaches 0). Plays a stone-break sound, resets `workleft` to 0, and triggers a full reset of the rock’s state.
* **Parameters:**  
  `inst` (entity) — The rock entity.  
  `worker` (entity) — The player or tool used to mine.  
* **Returns:** Nothing.

### `onhit(inst, worker, workleft)`
* **Description:** Called during mining (work in progress). Plays a stone-break sound and updates the visual state via `SetWorkLevel`.
* **Parameters:**  
  `inst` (entity) — The rock entity.  
  `worker` (entity) — The miner.  
  `workleft` (number) — Updated work remaining after the hit.  
* **Returns:** Nothing.

### `ExplodeRock(rock)`
* **Description:** Triggers a delayed explosion sequence if the rock still has work remaining. Plays a sound, spawns a `lavalight` and `explode_small` effect, shakes the camera, and resets the rock to MINING state after 5 seconds (`SealUp`).
* **Parameters:**  
  `rock` (entity) — The rock to explode.  
* **Returns:** Nothing.
* **Error states:** If `workleft < MAXWORK`, reschedules explosion for 90±30 seconds.

### `SealUp(rock)`
* **Description:** Resets the rock after an explosion. Clears `exploding`, restores full work (`MAXWORK`), and prepares it for future mining/fueling.
* **Parameters:**  
  `rock` (entity) — The rock entity.  
* **Returns:** Nothing.

### `onfuelchange(newsection, oldsection, inst)`
* **Description:** Callback for `fueled` section transitions. Handles extinguishing at section 0, updates fire FX, adjusts work thresholds (`MEDIUM`, `LOW`) based on fuel stage, and resets mining progress if fully depleted.
* **Parameters:**  
  `newsection` (number) — The new fuel section index (`0`, `1`, or `2`).  
  `oldsection` (number) — Previous fuel section.  
  `inst` (entity) — The rock entity.  
* **Returns:** Nothing.

### `GetStatus(inst)`
* **Description:** Returns a localized status string (`"OUT"`, `"LOW"`, or `"NORMAL"`) reflecting the current fuel section, for inspection UI.
* **Parameters:**  
  `inst` (entity) — The rock entity.  
* **Returns:** string — Current fuel status: `"OUT"` (section 0), `"LOW"` (section 1), `"NORMAL"` (section 2).

### `CalcSanityAura(inst, observer)`
* **Description:** Computes a sanity gain for observers within `0.5 * lightRadius` (squared distance check). Returns `TUNING.SANITY_SMALL` if in range and light is active; otherwise `0`.
* **Parameters:**  
  `inst` (entity) — The rock entity.  
  `observer` (entity) — The player being affected.  
* **Returns:** number — Sanity delta.

## Events & listeners
- **Listens to:**  
  `onextinguish` — Calls `onextinguish` to empty fuel if the fire is manually or naturally extinguished.  
- **Pushes:** None directly; relies on component events (e.g., `fueled` and `burnable` push events internally).