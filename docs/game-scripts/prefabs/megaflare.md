---
id: megaflare
title: Megaflare
description: A deployable item prefab that detonates after ignition, creating visual and auditory effects, notifying nearby players, and spawning minimap indicators.
tags: [item, fx, hud, minimap, combat]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1551d178
system_scope: fx
---

# Megaflare

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `megaflare` is a deployable item prefab that serves as a high-impact visual signal device. When ignited, it triggers a detonation sequence that plays sound effects, updates the HUD overlay for nearby players, notifies other players via speech, and spawns temporary minimap markers. It uses components like `burnable`, `propagator`, and `inventoryitem`, and interacts with the minimap and HUD systems via specialized client-side functions. It does not function as a damage-dealing propagator — its heat and damage output are explicitly disabled.

## Usage example
```lua
local flare = SpawnPrefab("megaflare")
flare.Transform:SetPosition(x, y, z)
flare:DoTaskInTime(5, function() 
    if flare ~= nil and flare:IsValid() then
        flare.components.burnable:Ignite()
    end
end)
```

## Dependencies & tags
**Components used:** `burnable`, `propagator`, `tradable`, `inspectable`, `inventoryitem`, `hauntable`  
**Tags:** `donotautopick` (added on spawn)  
**Notable external components accessed:** `talker` (via `player.components.talker:Say()`), `minimap` (via `MiniMapEntity`), `hud` (via `ThePlayer.HUD`)

## Properties
No public properties are exposed directly by the prefab constructor or component functions. State is managed via local variables (`inst._megaflarecooldown`, `inst._small_minimap`, `inst.flare_igniter`) and component-backed fields (e.g., `inst.components.propagator.heatoutput`).

## Main functions
### `flare_fn()`
* **Description:** The core prefab factory function that creates and configures the main megaflare entity. It sets up animation, physics, inventory behavior, and component hooks, including attaching the `burnable` component with `on_ignite` as its ignition handler.
* **Parameters:** None.
* **Returns:** `inst` — The fully configured entity instance.
* **Error states:** Returns early on the client if `TheWorld.ismastersim` is `false` (i.e., non-authoritative simulation).

### `flare_minimap()`
* **Description:** Factory function for the minimap marker entity used during detonation — spawns `megaflare_minimap` prefabs to enhance local minimap visibility.
* **Parameters:** None.
* **Returns:** `inst` — The minimap marker entity.
* **Error states:** None identified.

### `on_ignite(inst, source, doer)`
* **Description:** Callback registered via `burnable:SetOnIgniteFn()`. Initiates the detonation process when the flare is lit: disables saving, disables sleep, plays fire animation, registers `animover` listener, and plays launch sound.
* **Parameters:**  
  - `inst` (`Entity`) — The megaflare instance.  
  - `source` (`Entity` or `nil`) — The source of ignition (e.g., fire).  
  - `doer` (`Entity` or `nil`) — The entity that directly ignited the flare (e.g., player).  
* **Returns:** Nothing.
* **Error states:** Assigns `inst.flare_igniter` to `doer or source or nil` — may be `nil` if both are missing.

### `on_ignite_over(inst)`
* **Description:** Callback triggered after the "fire" animation completes. Finalizes detonation: spawns minimap flash indicators, notifies nearby players via speech, emits global event `megaflare_detonated`, and removes the flare entity.
* **Parameters:** `inst` (`Entity`) — The megaflare instance.  
* **Returns:** Nothing.
* **Error states:** `inst.flare_igniter` is cleaned up if invalid before event push.

### `show_flare_hud(inst)`
* **Description:** Client-side function that plays detonation sound if not on cooldown and updates the HUD overlay based on player proximity. Invokes `SetupHudIndicator()` for longer-distance detection.
* **Parameters:** `inst` (`Entity`) — The megaflare instance.  
* **Returns:** Nothing.
* **Error states:** Returns early if `ThePlayer` is `nil`.

### `show_flare_minimap(inst)`
* **Description:** Client-side (and master sim) function that spawns and configures a `globalmapicon` entity to mirror the flare’s minimap presence. Also schedules periodic minimap icon swapping via `do_flare_minimap_swap`.
* **Parameters:** `inst` (`Entity`) — The megaflare instance.  
* **Returns:** Nothing.
* **Error states:** None identified.

## Events & listeners
- **Listens to:**  
  - `animover` — fires `on_ignite_over` after the "fire" animation completes.  
  - `ondropped` — triggers `on_dropped` (plays "place" animation then reverts to "idle").  
  - `floater_startfloating` — plays "float" animation.  
  - `floater_stopfloating` — plays "idle" animation.  
  - `onremove` — triggers `RemoveHudIndicator` to clean up HUD indicator.

- **Pushes:**  
  - `startflareoverlay` — client event (via `ThePlayer:PushEvent()`) to trigger HUD overlay (only if close enough).  
  - `megaflare_detonated` — global world event with `{sourcept, pt, igniter}` payload upon detonation.
