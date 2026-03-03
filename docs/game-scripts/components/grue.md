---
id: grue
title: Grue
description: Manages the darkness-based threat system that damages entities when they remain in darkness for extended periods.
tags: [darkness, damage, environment]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 65465491
system_scope: environment
---

# Grue

> Based on game build **7140014** | Last updated: 2026-03-03

## Overview
The `grue` component tracks an entity's exposure to darkness and progressively inflicts damage and sanity loss if the entity remains unlit for too long. It dynamically responds to changes in visibility conditions—such as entering light, gaining night vision, or becoming invincible—by granting or removing immunity. When active, it cycles through increasing threat levels, playing warning sounds and eventually attacking at randomized intervals.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("grue")
inst.components.grue:SetSounds("warg_warning", "warg_attack")
inst.components.grue:SetResistance(2) -- Requires 3 attacks to damage
```

## Dependencies & tags
**Components used:** `combat`, `health`, `playervision`, `sanity`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `soundwarn` | string or nil | `nil` | Sound event to play as a warning. |
| `soundattack` | string or nil | `nil` | Sound event to play during an attack. |
| `warndelay` | number | `1` | Seconds delay between warning sound and `"heargrue"` event. |
| `level` | number or nil | `nil` | Current threat level (increases on each hit cycle). |
| `immunity` | table | `{}` | Map of active immunity sources (keyed by source string or self). |
| `nonlethal` | boolean | `TUNING.NONLETHAL_DARKNESS` | Whether attacks are nonlethal (reduces health below safe threshold). |
| `nonlethal_pct` | number | `TUNING.NONLETHAL_PERCENT` | Fraction of max health used as nonlethal floor. |
| `resistance` | number or nil | `nil` | Threshold number of attacks before actual damage occurs. |

## Main functions
### `CheckForStart()`
*   **Description:** Determines whether the grue threat should begin based on current entity state. Used during initialization and when immunity changes.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if the grue should start, i.e., entity is not in light, not dead, not invincible, and cannot see in darkness (`CanEntitySeeInDark(self.inst)` returns false).
*   **Error states:** Returns `false` if any immunity condition is met.

### `Start()`
*   **Description:** Initializes and begins the grue threat cycle if not already active. Sets up timers and sound scheduling.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if `self.level` is already non-`nil` (threat already running).

### `Stop()`
*   **Description:** Halts the grue threat cycle and clears threat state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `AddImmunity(source)`
*   **Description:** Adds a source-based immunity that prevents the threat from running.
*   **Parameters:** `source` (string or self) — Identifier for the immunity source (e.g., `"light"`, `"nightvision"`, `"invincible"`, or `self` for generic).
*   **Returns:** Nothing.
*   **Error states:** No effect if immunity for the given source is already active.

### `RemoveImmunity(source)`
*   **Description:** Removes a source-based immunity and potentially restarts the threat if all immunities are cleared.
*   **Parameters:** `source` (string or self) — Identifier for the immunity source to remove.
*   **Returns:** Nothing.
*   **Error states:** No effect if immunity for the given source is not active.

### `Attack()`
*   **Description:** Inflicts darkness-based damage and sanity loss on the entity.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Details:** Damage is adjusted for nonlethal mode using `nonlethal` and `nonlethal_pct` settings. Calls `combat:GetAttacked()` with `"darkness"` as the damage type.

### `SetResistance(resistance)`
*   **Description:** Sets the number of attacks the entity can withstand before taking full damage.
*   **Parameters:** `resistance` (number) — Minimum number of hits before `Attack()` causes damage.
*   **Returns:** Nothing.

### `SetSounds(warn, attack)`
*   **Description:** Configures sound events played during warning and attack phases.
*   **Parameters:**  
    * `warn` (string) — Sound event name for warning phase.  
    * `attack` (string) — Sound event name for attack phase.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"enterdark"` — Removes `"light"` immunity and may trigger `Start()`.  
  - `"enterlight"` — Adds `"light"` immunity and calls `Stop()`.  
  - `"nightvision"` — Adds/removes `"nightvision"` immunity based on boolean data.  
  - `"invincibletoggle"` — Adds/removes `"invincible"` immunity based on boolean data.  
  - `"death"` — Calls `Stop()` permanently.  
  - `"ms_respawnedfromghost"` — Calls `Start()` if no active immunities remain.

- **Pushes:**  
  - `"heargrue"` — Fired after `warndelay` seconds when the threat warns the player.  
  - `"attackedbygrue"` — Fired when actual damage occurs (level exceeds `resistance`).  
  - `"resistedgrue"` — Fired when an attack attempt is blocked by `resistance`.
