---
id: gelblob_attach_fx
title: Gelblob Attach Fx
description: Manages the visual attachment effect and debuff application when a gel blob connects to a player or creature.
tags: [fx, debuff, locomotion, network, fx]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 21bb1f00
system_scope: fx
---

# Gelblob Attach Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`gelblob_attach_fx` is a client/serverprefab component that creates and manages the visual attachment effect (the "connector" blobs) and applies a movement-speed debuff to entities affected by a gel blob. It uses networked boolean properties (`mainblob`, `killed`) to synchronize state between server and clients. The component dynamically generates two visual connector blobs (`connector1`, `connector2`) that visually stretch between the main gel blob and the target, and adjusts their position and scale using easing functions. On the server, it also registers locomotor or uneven-ground debuffs depending on whether the target is riding or a wereplayer.

## Usage example
```lua
local inst = SpawnPrefab("gelblob_attach_fx")
if inst then
    inst:SetupBlob(mainblob_entity, target_entity)
    -- later, when the effect should end:
    inst.KillFX(inst)
end
```

## Dependencies & tags
**Components used:** `locomotor` (server), `rider` (server), `updatelooper` (server/client), `network` (client/server)  
**Tags added/removed:** Adds `FX` tag on self and connector blobs; adds `gelblobbed` tag to target entity; removes `gelblobbed` tag from parent on removal.  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `mainblob` | `net_entity` | `nil` | Networked reference to the main gel blob entity the effect is attached to. |
| `killed` | `net_bool` | `false` | Networked boolean indicating whether the effect has been killed. |
| `connector1`, `connector2` | `entity` or `nil` | `nil` | Visual connector blobs that stretch between main blob and target. |
| `_target` | `entity` or `nil` | `nil` | Local reference to the debuffed target (server only). |
| `highlightparent` | `entity` or `nil` | `nil` | Parent entity used for highlighting (target's `highlightchildren` list). |
| `unevengroundtask` | `DoPeriodicTask` or `nil` | `nil` | Periodic task used to emit `unevengrounddetected` events (server only). |

## Main functions
### `SetupBlob(mainblob, target)`
*   **Description:** Attaches the effect to a target entity, sets up visual connectors, registers the debuff (locomotor or uneven ground), and starts the update loop on the server.
*   **Parameters:**  
    `mainblob` (entity) — the original gel blob entity.  
    `target` (entity) — the entity being affected by the gel blob.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `mainblob` or `target` is `nil`; silently handles cases where target lacks `locomotor` or `rider` components.

### `KillFX(inst)`
*   **Description:** Terminates the effect: sets `killed=true`, removes connectors, stops update loop, detaches from parent, plays the "splash" animation, and removes the `gelblobbed` tag from the parent.
*   **Parameters:**  
    `inst` (entity) — the gelblob_attach_fx instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `mainblobdirty` (client) — triggers `OnMainBlobDirty` when `mainblob` changes.  
  - `killeddirty` (client) — triggers `OnKilledDirty` when `killed` changes.  
  - `animover` — self-calls `Remove()` on animation finish.  
  - `onremove` (via `OnRemoveEntity`) — cleans up `highlightchildren` and parent tags.  
  - `mounted`, `dismounted`, `startwereplayer`, `stopwereplayer` (server, on player) — refreshes debuff type.
- **Pushes:**  
  - `unevengrounddetected` (via target) — used to animate player legs/movement when on uneven ground.  
  - `mainblobdirty`, `killeddirty` (via network setters) — notify remote instances of property changes.