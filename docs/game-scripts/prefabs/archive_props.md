---
id: archive_props
title: Archive Props
description: Defines prefabs and logic for Archive-related structures and entities, including mechanical switches, security systems, rune statues, and portal mechanics.
tags: [boss, puzzle, infrastructure, environment, ai]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ba9c8d67
system_scope: environment
---

# Archive Props

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `archive_props.lua` file defines a suite of prefabs representing interactive structures and entities within the Archive zone in Don't Starve Together. These include Moon Statues (workable loot sources), Rune Statues (story-driven inspectable objects), Security Desks and Security Pulses (AI-controlled patrol and spawning systems), Power Switch components (gem-based triggers), and Portal entities (ambient/doorway elements). The prefabs collectively manage puzzle progression, loot, lighting, sound, and interaction logic in coordination with components like `workable`, `inspectable`, `childspawner`, `trader`, `lootdropper`, and `updatelooper`. Central coordination is handled via the `archivemanager`, `grottowarmanager`, and `inventory` components on players.

## Usage example
```lua
-- Example: Spawning a Moon Statue and checking its mine progress
local statue = SpawnPrefab("archive_moon_statue")
statue.Transform:SetPosition(x, 0, z)
statue.components.workable:SetWorkLeft(20)
statue.components.lootdropper:DropLoot(statue:GetPosition())

-- Example: Interacting with an Archive Switch
local switch = SpawnPrefab("archive_switch")
switch.Transform:SetPosition(x, 0, z)
-- When a player places an opal gem:
local gem = SpawnPrefab("opalpreciousgem")
switch.components.trader:AcceptGift(player, gem, 1)
```

## Dependencies & tags
**Components used:** `workable`, `inspectable`, `lootdropper`, `childspawner`, `locomotor`, `updatelooper`, `playerprox`, `trader`, `pickable`, `pointofinterest`, `health`.  
**Tags:** `structure`, `statue`, `dustable`, `ancient_text`, `NOBLOCK`, `archive_waypoint`, `security_powerpoint`, `INLIMBO`, `FX`, `power_point`, `gemsocket`, `outofreach`, `archive_switch`, `archive_chandelier`, `groundhole`, `blocker`, `DECOR`, `NOCLICK`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.anim` | number (int) | `math.random(1,4)` (statues), `math.random(1,3)` (security desks, runes) | Animation variant ID for statue/rune state management. |
| `inst.storyprogress` | number (int) | `1` (per instance), shared via `_storyprogress` | Tracks the active story line displayed on rune statues. |
| `inst.canspawn` | boolean | `false` | Controls whether a Security Desk may spawn Security Pulses (set `true` via `playerprox`). |
| `inst.gem` | boolean | `false` | Indicates if a gem is inserted in the switch. |
| `inst.shadowwartask` | TaskHandle (nullable) | `nil` | A scheduled task triggering the `ms_archivesbreached` event after a delay when gems are inserted. |
| `inst.possession_range` | number | `0.2` | Radius used by Security Pulse to detect and possess eligible power points. |
| `inst.patrol` | boolean | `true` | Used as a flag for behavior logic in Security Pulse (not directly used internally). |

## Main functions
### `ShowWorkState(inst, worker, workleft)`
* **Description:** Updates the animation state of moon and rune statues based on remaining work. Lower health progresses to "idle_low_" and "idle_med_" animation variants before "idle_full_".
* **Parameters:**  
  - `inst` (Entity) – the statue instance.  
  - `worker` (Entity or `nil`) – the worker performing the mine action (may be `nil` if called from `OnLoadPostPass`).  
  - `workleft` (number) – remaining work units to finish.
* **Returns:** Nothing.

### `OnWorkFinished(inst)`
* **Description:** Final step when a statue is fully mined: drops loot at its position, spawns a small collapse FX, and removes the entity.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `getstatus(inst)`
* **Description:** For Rune Statues, increments and returns the current story line ID string `LINE_n`.
* **Parameters:** `inst` (Entity).
* **Returns:** `"LINE_1"` … `"LINE_5"` (string).

### `rune_getdescription(inst, viewer)`
* **Description:** Returns the localized description for a Rune Statue line if the viewer has an item with tag `ancient_reader` equipped.
* **Parameters:**  
  - `inst` (Entity) – rune statue instance.  
  - `viewer` (Entity) – the inspecting player.
* **Returns:** String description or `nil`.

### `canspawn(inst)`
* **Description:** Conditional function for the `childspawner.canspawnfn`. Allows spawning Security Pulses only if Archive power is *on* and the desk's animation is `idle`.
* **Parameters:** `inst` (Entity) – the Security Desk.
* **Returns:** `true` or `false`.

### `OnUpdateDesk(inst)`
* **Description:** Runs periodically on Security Desks to manage animation, light, and sound based on Archive power state and children count.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `getStatusPower(inst)`
* **Description:** Returns `"POWEROFF"` status for Security Desk and Portal when Archive power is off; otherwise `nil`.
* **Parameters:** `inst` (Entity).
* **Returns:** `"POWEROFF"` (string) or `nil`.

### `FindSecurityPulseTarget(inst)`
* **Description:** Searches for nearby entities with tag `security_powerpoint` within `inst.possession_range` and a low health ratio (`< MED_THRESHOLD_DOWN`), then triggers a `possess` event on the first valid target.
* **Parameters:** `inst` (Entity) – the Security Pulse.
* **Returns:** Nothing.

### `OnLocomote(inst)`
* **Description:** Drives movement of the Security Pulse based on `WantsToMoveForward` state.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `SetSfxPosition(inst)`
* **Description:** Positions the linked SFX child entity at a fixed distance to the Security Pulse for directional audio.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `rune_AdvanceStory(inst)`
* **Description:** Advances the global `_storyprogress` counter and stores it in `inst.storyprogress`.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnGemGiven(inst, giver, item)`
* **Description:** Handles placing a valid opal gem in the switch: disables trading, pauses picking, enables `gem` flag, triggers light/sound, and schedules `checkforgems`.
* **Parameters:**  
  - `inst` (Entity) – the switch instance.  
  - `giver` (Entity or `nil`) – the item placer.  
  - `item` (Entity) – the opal gem.
* **Returns:** Nothing.

### `OnGemTaken(inst)`
* **Description:** Handles removing a gem from the switch: re-enables trading, sets `gem=false`, turns off Archive power, and triggers deactivation animation/sound.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `checkforgems(inst)`
* **Description:** Scans for three active gem sockets within range. If found, powers on the Archive, plays startup sounds, schedules `startshadowwar`, and updates chandeliers.
* **Parameters:** `inst` (Entity) – the switch instance.
* **Returns:** Nothing.

### `startshadowwar(inst)`
* **Description:** Schedules a 7-second delay after gem insertion to push the `ms_archivesbreached` global event (unless a war is already started).
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `startpowersound(inst)`
* **Description:** Plays a sequence of sounds moving outward from a switch to nearby waypoints, simulating power flowing through the circuit.
* **Parameters:** `inst` (Entity) – the switch instance.
* **Returns:** Nothing.

### `OnUpdatePulseSFX(inst, dt)`
* **Description:** Updates the position of the SFX child entity to circle its parent (Security Pulse) over time.
* **Parameters:**  
  - `inst` (Entity) – the SFX entity.  
  - `dt` (number) – elapsed time since last update.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `animover` – anim transition callback on switches (`activate`/`deactivate`) to transition to final idle frames and call `checkforgems`.  
  - `arhivepoweron` / `arhivepoweroff` – global events on the world instance for base and ambient prefabs to toggle animations and looped sounds.  
  - `locomote` – internal event on Security Pulse to drive walking behavior.  
  - `possess` – received from Security Pulse when it targets a power point.

- **Pushes:**  
  - `ms_archivesbreached` – global event after gem insertion delay.  
  - `ms_register_vault_lobby_exit_target` – registers the portal entity for world generation logic.  
  - `trade` – via `Trader:AcceptGift` when a gem is accepted.  
  - `possess` – sent to target entities by `FindSecurityPulseTarget`.

