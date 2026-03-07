---
id: spellbookcooldown
title: Spellbookcooldown
description: Tracks and synchronizes individual spell cooldowns for networked spellbook interactions.
tags: [network, cooldown, spell, sync]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 402abb28
system_scope: network
---

# Spellbookcooldown

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`spellbookcooldown` is a lightweight, networked prefab that represents the visual and stateful data for a single spell cooldown. It is instantiated per active spell cooldown and is registered with the player's `spellbookcooldowns` component. The prefab uses network variables (`_name`, `_pct`, `_len`) to synchronize cooldown state across clients, and integrates with the `updatelooper` component to decrement the cooldown progress each frame. It exists only to propagate state changes and is not persistent in saved worlds.

## Usage example
```lua
-- On server, create a new cooldown for a spell
local cooldown = SpawnPrefab("spellbookcooldown")
cooldown.components.spellbookcooldowns:RegisterSpellbookCooldown(cooldown)
cooldown:InitSpellCooldown("fireball", 5.0)

-- Later, restart the cooldown duration
cooldown:RestartSpellCooldown(3.5)
```

## Dependencies & tags
**Components used:** `updatelooper`  
**Tags:** Adds `CLASSIFIED` only.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `pct` | number | `1` | Local representation of cooldown progress (0 = done, 1 = active). Used only for rendering and logic. |
| `syncdelay` | number | `1` | Delay counter (in seconds) before next full network sync; resets each update. |
| `_name` | net_hash | `"namedirty"` | Networked hash of the spell name. |
| `_pct` | net_byte | `180` | Networked percentage (scaled to 0–180 for byte precision). |
| `_len` | net_ushortint | `0` | Networked raw cooldown duration (tenths of seconds). |

## Main functions
### `InitSpellCooldown(spellname, duration)`
* **Description:** Initializes the cooldown with a specific spell name and duration, starting at full progress (`pct = 1`). Must be called on server only.
* **Parameters:**  
  `spellname` (string or hash) — identifier for the spell.  
  `duration` (number) — cooldown duration in seconds.  
* **Returns:** Nothing.
* **Error states:** Duration is clamped to `0–6553.5` seconds (internal precision: tenths of seconds). Invalid names are not validated locally.

### `RestartSpellCooldown(duration)`
* **Description:** Resets the cooldown to full progress (`pct = 1`) and updates its duration to `duration`. Does not re-register with `spellbookcooldowns`.
* **Parameters:**  
  `duration` (number) — new cooldown duration in seconds.  
* **Returns:** Nothing.
* **Error states:** Duration is clamped to `0–6553.5` seconds. Behavior is undefined if called before `InitSpellCooldown`.

### `GetSpellName()`
* **Description:** Returns the current spell name hash.
* **Parameters:** None.
* **Returns:** string or number — the value stored in `_name`.

### `GetLength()`
* **Description:** Returns the current cooldown duration in seconds.
* **Parameters:** None.
* **Returns:** number — raw `_len` divided by 10.

### `GetPercent()`
* **Description:** Returns the current cooldown progress (0–1).
* **Parameters:** None.
* **Returns:** number — value of `pct`.

### `SetPercent(percent, overtime)`
* **Description:** Updates the local `pct` and network variable `_pct` (scaled to 0–180). Sync behavior differs based on `overtime`.
* **Parameters:**  
  `percent` (number) — target progress between `0` and `1`.  
  `overtime` (boolean) — if `true`, uses local-only sync (`set_local`) to avoid frequent network updates.  
* **Returns:** Nothing.
* **Error states:** If `percent <= 0`, the entity is removed on master simulation; on client, only `pct` is set to `0`.

## Events & listeners
- **Listens to:**  
  `namedirty` — triggers `OnNameDirty`, which registers this cooldown with the local player's `spellbookcooldowns` component.  
  `pctdirty` — triggers `OnPctDirty`, which updates local `pct` from `_pct`.  
- **Pushes:**  
 None. (Internally triggers `namedirty`/`pctdirty` via network variables but does not fire custom events.)