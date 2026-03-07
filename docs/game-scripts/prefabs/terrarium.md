---
id: terrarium
title: Terrarium
description: Manages the terrarium crafting station and boss-summoning mechanics, including normal and crimson variants, cooldowns, and state transitions.
tags: [boss, inventory, world, crafting, network]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 28518118
system_scope: world
---

# Terrarium

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `terrarium` prefab implements the Terrarium crafting station, which allows players to summon the Eye of Terror or the Twins boss fight under specific conditions. It integrates with multiple systems including inventory management, timers, trading (for crimson conversion), lighting effects, and world state events (e.g., day/night cycles). It tracks state such as active summoning, cooldown, and whether the crimson variant has been traded. The component also handles serialization for save/load and network synchronization via local net variables.

## Usage example
```lua
local inst = SpawnPrefab("terrarium")
-- The terrarium is automatically usable; no manual setup needed.
-- Typical interactions:
--   inst.components.activatable:Activate() -- toggles on/off via quick action
--   inst.components.trader:AcceptItem(item) -- triggers crimson conversion if item is nightmarefuel
--   inst.components.worldsettingstimer:ActiveTimerExists("cooldown") -- check if on cooldown
```

## Dependencies & tags
**Components used:** `activatable`, `hauntable`, `inspectable`, `inventoryitem`, `timer`, `trader`, `worldsettingstimer`
**Tags:** Adds `irreplaceable`, `trader`, `alltrader`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `is_on` | boolean | `false` | Whether the terrarium is currently activated (in use). |
| `_iscrimson` | net_bool | `false` | Networked flag indicating the crimson variant is active. |
| `_islighton` | net_bool | `false` | Networked flag indicating the terrarium’s light is active. |
| `_lightframe` | net_smallbyte | `0` | Networked value representing the current light animation frame (0–14). |
| `eyeofterror` | entity or nil | `nil` | Reference to the spawned boss (EyeOfTerror or TwinManager). |
| `_summoning_fx` | entity or nil | `nil` | Reference to the summoning beam FX entity. |
| `_LightTask` | task or nil | `nil` | Periodic task for light frame updates. |
| `_lightcolourtask` | task or nil | `nil` | Periodic task for dynamic light colour updates (client only). |
| `_ShadowDelayTask` | task or nil | `nil` | Task used to delay shadow enable/disable on state transitions. |
| `_lighttweener` | number | `0` | Accumulated angle for colour oscillation (client only). |

## Main functions
### `TurnOn(inst, is_loading)`
* **Description:** Activates the terrarium, preventing inventory movement, disabling trading, playing activation animations, starting a cooldown timer if it’s night, and emitting sound effects.
* **Parameters:** `is_loading` (boolean) — if true, skips presentation and directly sets idle animation (used during load).
* **Returns:** Nothing.
* **Error states:** No effect if already on.

### `TurnOff(inst)`
* **Description:** Deactivates the terrarium, restoring inventory pickup, enabling trading, stopping sounds, restoring idle animation, and managing shadow/light cleanup.
* **Returns:** Nothing.
* **Error states:** No effect if already off.

### `StartSummoning(inst, is_loading)`
* **Description:** Begins the boss-beam phase: locks inventory, shows summoning FX, enables light after a delay, plays sounds, and schedules the boss spawn timer. Only runs if `is_on` is true and conditions are met.
* **Parameters:** `is_loading` (boolean) — skips presentation and announcement if true.
* **Returns:** Nothing.

### `SpawnEyeOfTerror(inst)`
* **Description:** Spawns or revives the Eye of Terror or Twins boss near a random player, announces target, sets up listeners, and records the eye reference.
* **Returns:** Nothing.

### `OnBossFightOver(inst)`
* **Description:** Handles end of boss fight: turns off terrarium, clears eye reference, starts cooldown timer, restores default image and tags, and cleans up FX.
* **Returns:** Nothing.

### `OnCooldownOver(inst)`
* **Description:** Ends cooldown: re-enables activatable, shows tree part (if not crimson), and restores default inventory image.
* **Returns:** Nothing.

### `OnDay_SendBossAway(inst)`
* **Description:** Sends the boss away at dawn via `leave` event, and returns the terrarium to “on but idle” state.
* **Returns:** Nothing.

### `GetActivateVerb(inst)`
* **Description:** Returns the verb string `"TOUCH"` used for the quick action UI.
* **Returns:** `"TOUCH"` (string).

### `AbleToAcceptTest(inst, item, giver)`
* **Description:** Implements the trader logic: checks if trade is allowed based on cooldown, item type, and crimson slot availability.
* **Returns:** `true` if accepted, `false` otherwise; also returns a string reason code (e.g., `"TERRARIUM_COOLDOWN"`, `"TERRARIUM_REFUSE"`, `"SLOTFULL"`).

### `ItemGet(inst, giver, item)`
* **Description:** Called after a successful crimson trade: converts to crimson variant, spawns `shadow_despawn` FX.
* **Returns:** Nothing.

### `OnActivate(inst, doer)`
* **Description:** Simple toggle entry point for the activatable component: calls `TurnOn` if off, otherwise `TurnOff`.
* **Returns:** Nothing.

### `OnEyeLeft(eye, inst)`
* **Description:** Cleanup after the boss finishes leaving the world: removes from scene, handles crimson cleanup if applicable.
* **Returns:** Nothing.

### `OnPutInInventory(inst)`
* **Description:** Ensures the terrarium turns off when moved into inventory (prevents unintended summoning).
* **Returns:** Nothing.

### `OnDroppedFromInventory(inst)`
* **Description:** Disables dynamic shadow when dropped (affects physics/visuals on ground).
* **Returns:** Nothing.

### `TimerDone(inst, data)`
* **Description:** Event callback for timer completion: dispatches to `StartSummoning`, `SpawnEyeOfTerror`, or `OnCooldownOver` based on timer name (`"summon_delay"`, `"warning"`, `"cooldown"`).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"timerdone"` — triggers `TimerDone`.  
  - `"lightdirty"` (client only) — updates light frame/colour.  
  - `"turnoff_terrarium"` and `"onremove"` (on `eyeofterror`) — calls `on_end_eyeofterror_fn`.  
  - `"finished_leaving"` (on `eyeofterror`) — calls `on_eye_left_fn`.  
  - `"isnight"` (world state) — triggers `on_night`.

- **Pushes:**  
  - `"imagechange"` — via `ChangeImageName` on inventory item.  
  - `"leave"`, `"arrive"`, `"set_spawn_target"` — to `eyeofterror` during spawn.  
  - `"turnoff_terrarium"` — to `eyeofterror` during manual deactivation.