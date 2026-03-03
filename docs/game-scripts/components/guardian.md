---
id: guardian
title: Guardian
description: Manages the lifecycle of a summoned guardian entity, tracking summon progress, spawning and dismissing the guardian, and handling its death.
tags: [summoning, combat, ai, boss]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d45ce680
system_scope: entity
---

# Guardian

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Guardian` is an entity component that manages the summoning, tracking, and dismissal of a designated guardian prefab (e.g., mossling, moose). It tracks summon progress via a `summons` counter that can be incremented or decremented (e.g., via `DoDelta`, `Call`, `Decay`). When summon progress reaches a threshold, the guardian prefab is spawned; when progress drops to zero, the guardian is dismissed. The component maintains event listeners for the guardian's `death` and `onremove` events and handles save/load synchronization.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("guardian")

inst.components.guardian.prefab = "moose"
inst.components.guardian.threshold = 20
inst.components.guardian.onsummonfn = function(summoner, guardian) print("Guardian summoned!") end
inst.components.guardian.onguardiandeathfn = function(summoner, guardian, cause) print("Guardian died") end

inst.components.guardian:Call() -- increases summon count
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Checks `guardian` entity existence via `self.guardian ~= nil`; does not modify entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in constructor) | The entity instance the component is attached to. |
| `prefab` | `string?` | `nil` | Name of the prefab to summon as guardian. Required for `SummonGuardian`. |
| `guardian` | `Entity?` | `nil` | Reference to the currently active guardian entity. |
| `onsummonfn` | `function?` | `nil` | Callback invoked when a new guardian is summoned: `fn(summoner, guardian)`. |
| `onguardiandeathfn` | `function?` | `nil` | Callback invoked when the guardian dies: `fn(summoner, guardian, cause?)`. |
| `threshold` | `number` | `20` | Minimum `summons` value required to spawn the guardian. |
| `summons` | `number` | `0` | Current summon progress count. Clamped between `0` and `threshold`. |
| `decaytime` | `number` | `20` | Seconds before the summon count automatically decrements by 1 (via `Decay`). |
| `decaytask` | `Task?` | `nil` | Ongoing decay task handle, `nil` if no decay is scheduled. |
| `_onguardiandeath` | `function` | (internal) | Event handler bound to `self:OnGuardianDeath(data)`. |
| `_onguardianremove` | `function` | (internal) | Event handler bound to `self:SetGuardian(nil)`. |

## Main functions
### `SetGuardian(guardian)`
* **Description:** Updates the currently tracked guardian entity. Registers or removes event listeners for `death` and `onremove` events on the previous and new guardian.
* **Parameters:** `guardian` (`Entity?`) — the new guardian entity or `nil` to dismiss tracking.
* **Returns:** Nothing.

### `DoDelta(d)`
* **Description:** Adjusts the summon count by `d`, clamps it between `0` and `threshold`, fires a `"summonsdelta"` event, manages decay scheduling, and automatically summons or dismisses the guardian if thresholds are crossed.
* **Parameters:** `d` (`number`) — delta to apply (e.g., `+1`, `-1`). Default is `1`.
* **Returns:** Nothing.

### `SummonGuardian(override)`
* **Description:** Spawns or links a guardian entity if `summons >= threshold` and `guardian` is `nil`. First checks for existing guardians in range (`radius = 30`), then attempts `SpawnPrefab`. Applies position and triggers `onsummonfn`.
* **Parameters:** `override` (`Entity?`, optional) — if provided, uses this entity as the guardian directly.
* **Returns:** Nothing.
* **Error states:** Returns early and prints an error if `self.prefab` is `nil`.

### `DismissGuardian()`
* **Description:** Removes the guardian entity. If `ondismissfn` is defined, calls it before removing; otherwise, removes the entity directly.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early with no effect if `self.guardian` is `nil`.

### `OnGuardianDeath(data)`
* **Description:** Handles guardian death. Invokes `onguardiandeathfn`, if set, then clears the guardian reference.
* **Parameters:** `data` (`table?`) — death event data, containing optional `cause`.
* **Returns:** Nothing.

### `Call(d)`
* **Description:** Convenience wrapper for `DoDelta` to increase summon count (default `d = 1`).
* **Parameters:** `d` (`number?`) — delta to apply. Defaults to `1`.
* **Returns:** Nothing.

### `Decay(d)`
* **Description:** Convenience wrapper for `DoDelta` to decrease summon count (default `d = -1`).
* **Parameters:** `d` (`number?`) — delta to apply. Defaults to `-1`.
* **Returns:** Nothing.

### `StartDecay()`
* **Description:** Cancels any existing decay task and, if `summons > 0`, schedules a decay task to trigger after `decaytime`.
* **Parameters:** None.
* **Returns:** Nothing.

### `HasGuardian()`
* **Description:** Returns whether a guardian entity is currently active and tracked.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `self.guardian ~= nil`.

### `OnSave()`
* **Description:** Serializes component state for network and save file persistence.
* **Parameters:** None.
* **Returns:** `data` (`table`), `refs` (`table` of GUID strings) — `data.summons` and optional `data.guardian` GUID.

### `OnLoad(data)`
* **Description:** Restores `summons` count after loading. Restarts decay if needed.
* **Parameters:** `data` (`table?`) — saved state, with optional `summons`.
* **Returns:** Nothing.

### `LoadPostPass(ents, data)`
* **Description:** Called after initial load to restore the guardian entity reference using the saved guardian GUID.
* **Parameters:** `ents` (`table` of GUID→Entity), `data` (`table`) — saved data containing optional `guardian` GUID.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `"death"` on `guardian` entity — triggers `self:OnGuardianDeath(data)`.
  - `"onremove"` on `guardian` entity — triggers `self:SetGuardian(nil)`.
  - `"summonsdelta"` on `inst` — fired internally by `DoDelta` with `{ old = number, new = number }`.
- **Pushes:**
  - `"summonsdelta"` — fired each time `DoDelta` is called, with `{ old = number, new = number }`.
