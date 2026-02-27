---
id: guardian
title: Guardian
description: Manages summoned guardians by tracking summon progress, spawning/dismissing guardian entities, and handling their lifecycle events.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: d45ce680
---

# Guardian

## Overview
The `Guardian` component manages the lifecycle of summoned guardian entities. It tracks summon progress via a counter (`summons`) against a configurable threshold, automatically spawns a guardian when the threshold is reached, and dismisses or destroys the guardian when summon progress drops to zero. It listens to guardian-specific events (death, removal) and provides hooks for custom behavior on summon, death, and dismissal.

## Dependencies & Tags
- **Component Dependency:** Relies on `inst` having the `transform` and `event` subsystem capabilities (standard for entities in DST).
- **Events Listens For (on guardian):**
  - `"death"` → triggers `OnGuardianDeath`
  - `"onremove"` → triggers `SetGuardian(nil)`
- **Events Pushed (on owner entity):**
  - `"summonsdelta"` → emitted when `summons` changes, with `{ old = <int>, new = <int> }`
- **Tags:** No tags are added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The owner entity instance (set in constructor). |
| `prefab` | `string?` | `nil` | Prefab name of the guardian to summon; must be set externally. |
| `guardian` | `Entity?` | `nil` | Reference to the currently active guardian entity. |
| `onsummonfn` | `function?` | `nil` | Callback invoked when a new guardian is successfully summoned (`fn(inst, guardian)`). |
| `onguardiandeathfn` | `function?` | `nil` | Callback invoked when the guardian dies (`fn(inst, guardian, cause)`). |
| `ondismissfn` | `function?` | `nil` | Callback invoked before guardian is dismissed (if present); otherwise, guardian is removed directly. |
| `threshold` | `number` | `20` | Summon count required to trigger guardian summoning. |
| `summons` | `number` | `0` | Current summon progress (clamped between `0` and `threshold`). |
| `decaytime` | `number` | `20` | Seconds between summon decay ticks. |
| `decaytask` | `Task?` | `nil` | Active decay task; cancels and nullifies on entity removal or decay update. |

## Main Functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up state when component is removed from its owner entity. Cancels the decay task and disassociates the guardian.
* **Parameters:** None.

### `SetGuardian(guardian)`
* **Description:** Sets or updates the active guardian entity. Adds/removes event listeners on the guardian for `"death"` and `"onremove"` events.
* **Parameters:**
  - `guardian` (`Entity?`): The new guardian entity, or `nil` to clear.

### `DoDelta(d)`
* **Description:** Adjusts the `summons` counter by `d`, clamps the value, pushes `"summonsdelta"`, starts decay, and conditionally summons/dismisses the guardian based on threshold bounds.
* **Parameters:**
  - `d` (`number`): Amount to change `summons` (positive to add, negative to reduce).

### `SummonGuardian(override)`
* **Description:** Spawns or assigns a guardian entity if none exists and summon threshold is met. First checks for existing guardians of `self.prefab` in range; if not found, spawns a new one at owner's position.
* **Parameters:**
  - `override` (`Entity?`, optional): Force-set this entity as the guardian, bypassing search/spawn logic.

### `DismissGuardian()`
* **Description:** Removes the current guardian. If `ondismissfn` is defined, calls it first and then clears the guardian reference; otherwise, removes the guardian entity directly.
* **Parameters:** None.

### `OnGuardianDeath(data)`
* **Description:** Handles guardian death events. Invokes `onguardiandeathfn` (if set) with cause and clears the guardian reference.
* **Parameters:**
  - `data` (`table?`): Death event data, optionally containing `data.cause`.

### `OnSave()`
* **Description:** Serializes component state. Returns `summons` count and the guardian's GUID for persistence.
* **Returns:** `data, refs` — `data` contains `summons` and `guardian` (GUID); `refs` contains guardian GUIDs.

### `OnLoad(data)`
* **Description:** Restores `summons` count and restarts decay from saved data.
* **Parameters:**
  - `data` (`table?`): Saved data containing `summons`.

### `LoadPostPass(ents, data)`
* **Description:** Reconnects the guardian entity after loading using its saved GUID from `data`.
* **Parameters:**
  - `ents` (`table`): Loaded entity lookup by GUID.
  - `data` (`table?`): Saved data with `guardian` GUID.

### `Call(d)`
* **Description:** Shorthand for increasing summons (defaults to `+1`).
* **Parameters:**
  - `d` (`number`, optional): Amount to add; defaults to `1`.

### `Decay(d)`
* **Description:** Shorthand for decreasing summons (defaults to `-1`).
* **Parameters:**
  - `d` (`number`, optional): Amount to subtract; defaults to `-1`.

### `StartDecay()`
* **Description:** Schedules or reschedules a decay task (if `summons > 0`) to reduce summon count after `decaytime` seconds.
* **Parameters:** None.

### `HasGuardian()`
* **Description:** Returns whether a guardian is currently assigned.
* **Returns:** `boolean`

### `SummonsAtMax()`
* **Description:** Checks if summon count has reached or exceeded `threshold`.
* **Returns:** `boolean`

### `SummonsAtMin()`
* **Description:** Checks if summon count is at or below zero.
* **Returns:** `boolean`

## Events & Listeners
- **Listens on `inst` for:**
  - `"death"` on `guardian` → calls `_onguardiandeath` → `OnGuardianDeath(data)`
  - `"onremove"` on `guardian` → calls `_onguardianremove` → `SetGuardian(nil)`
- **Pushes events on `inst`:**
  - `"summonsdelta"` → when `summons` changes (payload: `{ old = <int>, new = <int> }`)