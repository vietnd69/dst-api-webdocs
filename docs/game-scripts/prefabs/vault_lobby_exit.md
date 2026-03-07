---
id: vault_lobby_exit
title: Vault Lobby Exit
description: A non-interactive exit point for teleportation from the Caves to the Vault Lobby, handling sound triggers and teleporter state management.
tags: [teleport, environment, cave]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: beadb677
system_scope: environment
---

# Vault Lobby Exit

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`vault_lobby_exit` is a prefab that serves as a terminal exit point for teleportation events—specifically for transitions from the Caves to the Vault Lobby. It functions primarily as a `teleporter` target and provides support for sound playback and travel state coordination. The prefab does not move or respond to gameplay logic directly; instead, it acts as a destination anchor managed externally by other systems (e.g., player stategraphs or worldgen tasks). It registers itself globally via the `"ms_register_vault_lobby_exit"` event and integrates with the `teleporter` and `talker` components during activation.

## Usage example
```lua
local exit = SpawnPrefab("vault_lobby_exit")
exit.Transform:SetPosition(x, y, z)
-- Later, associate it as a teleport target
local entrance = SpawnPrefab("some_teleporter_prefab")
entrance.components.teleporter:Target(exit)
exit:SetExitTarget(exit) -- ensures cleanup on removal
```

## Dependencies & tags
**Components used:** `teleporter`, `talker` (external, via `doer.components.talker:ShutUp()`), `inspectable`
**Tags:** Adds `groundhole`, `blocker`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_facing` | number | `FACING_LEFT` | Facing direction used for scrapbook UI rendering (not networked). |
| `StartTravelSound` | function | `StartTravelSound` | Callback function invoked on `"starttravelsound"` event to trigger travel audio. |
| `SetExitTarget` | function | `SetExitTarget(inst, targetinst)` | Public method to assign or clear the teleporter target and manage listener cleanup. |

## Main functions
### `StartTravelSound(inst, doer)`
* **Description:** Plays the travel sound and pushes a `"wormholetravel"` event on the `doer`. Used when initiating travel via the exit.
* **Parameters:**  
  `inst` (Entity) — the vault lobby exit prefab instance.  
  `doer` (Entity) — the entity initiating travel (e.g., player).  
* **Returns:** Nothing.
* **Error states:** If `doer` lacks a `talker` component, no `ShutUp()` call is made.

### `OnActivate(inst, doer)`
* **Description:** Handler assigned to `teleporter.onActivate`. Handles silence and sound playback on teleport activation.
* **Parameters:**  
  `inst` (Entity) — the vault lobby exit prefab instance.  
  `doer` (Entity) — the entity teleporting into this exit.  
* **Returns:** Nothing.
* **Error states:** Sound only plays if `inst.SoundEmitter` exists; no-op for non-player `doer`s lacking `talker`.

### `SetExitTarget(inst, targetinst)`
* **Description:** Assigns `targetinst` as the teleport destination and manages event listeners for cleanup when the target is removed. Sets enabled state based on validity.
* **Parameters:**  
  `inst` (Entity) — the vault lobby exit prefab instance (implicit `self`).  
  `targetinst` (Entity?) — the destination teleporter, or `nil` to clear.  
* **Returns:** Nothing.
* **Error states:** If `targetinst` is removed while assigned, the callback `_exittarget_onremove` triggers automatically, clearing the target.

## Events & listeners
- **Listens to:**  
  `"starttravelsound"` — invokes `StartTravelSound(inst, doer)`.  
  `"onremove"` (on target) — invokes `_exittarget_onremove`, which clears the teleporter target.  
- **Pushes:**  
  `"ms_register_vault_lobby_exit"` — fires `TheWorld:PushEvent("ms_register_vault_lobby_exit", inst)` on server during initialization to register the exit globally.  
  `"wormholetravel"` — pushed on the `doer` during travel initiation.