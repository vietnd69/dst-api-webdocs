---
id: grue
title: Grue
description: Manages the grue entity's behavior by tracking darkness exposure, immunity states, and periodic attacks in darkness.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 65465491
---

# Grue

## Overview
The `Grue` component governs the behavior of the grue—specifically, its responsiveness to darkness by initiating attack cycles when the entity is exposed to darkness and not protected by immunity sources. It handles sound playback, timing for warnings and attacks, and applies damage/sanity drain upon successful grue attacks.

## Dependencies & Tags
- Relies on:
  - `health` component (for invincibility checks, health values, and dead state)
  - `playervision` component (for night vision status)
  - `combat` component (to deal damage)
  - `sanity` component (to reduce sanity upon attack)
  - `soundemitter` (for playing grue sounds)
  - `"dark"` light level detection via `inst:IsInLight()`
  - `CanEntitySeeInDark()` helper function

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity this component belongs to. |
| `soundwarn` | `string` or `nil` | `nil` | Sound event to play for warning (initial growl). |
| `soundattack` | `string` or `nil` | `nil` | Sound event to play before attacking. |
| `warndelay` | `number` | `1` | Time in seconds between warning sound and grue audible warning event (`heargrue`). |
| `immunity` | `table` | `{}` | Map of immunity sources (`{"light", "nightvision", "invincible", "sleeping"}`) that prevent grue activation. |
| `nonlethal` | `boolean` | `TUNING.NONLETHAL_DARKNESS` | If true, grue damage is capped to preserve player life (only knocks out). |
| `nonlethal_pct` | `number` | `TUNING.NONLETHAL_PERCENT` | Minimum health fraction to preserve in nonlethal mode (e.g., 0.1 = 10% of max health). |
| `level` | `number` or `nil` | `nil` | Current grue attack level (starts at 0, increments with each attack cycle). |
| `nextHitTime` | `number` or `nil` | `nil` | Time remaining until the next grue attack (updated each frame during active state). |
| `nextSoundTime` | `number` or `nil` | `nil` | Time remaining until the warning sound plays before next attack. |
| `resistance` | `number` or `nil` | `nil` | Hard limit on attack level before damage/sanity apply; if `level > resistance`, attack succeeds. |
| `inittask` | `DoTaskInTime` or `nil` | `nil` | Delayed initialization task scheduled at component creation. |

## Main Functions

### `Grue:Start()`
* **Description:** Begins the grue attack cycle if the entity is in darkness and has no active immunities. Sets up timing and starts component updates.
* **Parameters:** None.

### `Grue:Stop()`
* **Description:** Halts the active grue cycle by clearing the `level` and stopping periodic updates.
* **Parameters:** None.

### `Grue:AddImmunity(source)`
* **Description:** Adds an immunity source (e.g., `"light"`, `"nightvision"`) and stops the grue cycle if it is active.
* **Parameters:**
  - `source` (`string` or `table`, optional): Identifier for the immunity source. Defaults to `self` if omitted.

### `Grue:RemoveImmunity(source)`
* **Description:** Removes an immunity source and restarts the grue cycle if no immunities remain.
* **Parameters:**
  - `source` (`string` or `table`, optional): Identifier for the immunity source to remove. Defaults to `self` if omitted.

### `Grue:CheckForStart()`
* **Description:** Determines whether the grue should start based on current entity state: not invincible, not in light, not dead, and unable to see in the dark.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if all conditions for starting are met.

### `Grue:Attack()`
* **Description:** Executes a grue attack: applies calculated damage (respecting nonlethal mode) to health, reduces sanity, and emits an attack event.
* **Parameters:** None.

### `Grue:SetResistance(resistance)`
* **Description:** Sets the `resistance` value, which defines the attack level threshold needed before damage occurs.
* **Parameters:**
  - `resistance` (`number`): Required level (`self.level`) to exceed before an attack is considered successful.

### `Grue:SetSounds(warn, attack)`
* **Description:** Configures warning and attack sound events for the grue.
* **Parameters:**
  - `warn` (`string`): Sound event string for the warning growl.
  - `attack` (`string`): Sound event string for the attack growl.

### `Grue:OnUpdate(dt)`
* **Description:** Drives the core grue behavior: decrements timers, plays warning sound at `nextSoundTime`, triggers `heargrue` event, then attacks if `nextHitTime` expires and `level` exceeds `resistance`.
* **Parameters:**
  - `dt` (`number`): Delta time since last update.

### `Grue:SetSleeping(asleep)` *(Deprecated)*
* **Description:** legacy wrapper to add/remove `"sleeping"` immunity for mod compatibility; now calls `AddImmunity`/`RemoveImmunity` internally.
* **Parameters:**
  - `asleep` (`boolean`): If `true`, adds `"sleeping"` immunity; otherwise, removes it.

## Events & Listeners
- Listens for `"enterdark"` → calls `OnEnterDark`
- Listens for `"enterlight"` → calls `OnEnterLight`
- Listens for `"nightvision"` → calls `OnNightVision`
- Listens for `"invincibletoggle"` → calls `OnInvincibleToggle`
- Listens for `"death"` → calls `OnDeath`
- Listens for `"ms_respawnedfromghost"` → calls `OnRespawned`

- Emits/pushes:
  - `"heargrue"` → shortly after warning sound (via `DoTaskInTime`)
  - `"attackedbygrue"` → after successful grue attack
  - `"resistedgrue"` → after attack but below resistance threshold