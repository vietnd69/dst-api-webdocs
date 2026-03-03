---
id: attuner
title: Attuner
description: Manages attunement relationships between a player and attunable entities, tracking which entities the player is attuned to and enabling server/client-side attunement queries and transfers.
tags: [attunement, player, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9f4d7e52
system_scope: player
---

# Attuner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Attuner` tracks which attunable entities a player is attuned to, maintaining a local map of GUID → proxy entity references. It supports both server (`ismastersim`) and client operation—on clients, it works only for the local player and relies on replicated proxy objects (typically lightweight `attunable_classified` entities). The component is intended exclusively for players and interacts with the `attunable` component on target entities via `LinkToPlayer`/`UnlinkFromPlayer`.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("attuner")

-- Assuming a proxy attunable entity exists
inst.components.attuner:RegisterAttunedSource(proxy)
if inst.components.attuner:IsAttunedTo(target_entity) then
    print("Player is attuned to target")
end
```

## Dependencies & tags
**Components used:** `attunable` (accessed via `ent.components.attunable` on target entities during `TransferComponent`), `replica.attunable_classified` (accessed implicitly via `proxy.source_guid:value()`).
**Tags:** None added, removed, or directly checked on the player instance itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | `nil` | The player entity this component belongs to. |
| `ismastersim` | boolean | `false` | Whether the current instance is the master simulation (server). |
| `attuned` | table | `{}` | Map of GUID (number) → proxy entity (table); entries represent attuned sources. |

## Main functions
### `IsAttunedTo(target)`
* **Description:** Checks whether the player is currently attuned to the given target entity.
* **Parameters:** `target` (Entity) — the entity to check attunement against.
* **Returns:** `boolean` — `true` if attuned, `false` otherwise.
* **Error states:** On clients, this method relies on tag matching (`ATTUNABLE_ID_<GUID>`) and may be less reliable if proxies are stale or missing.

### `HasAttunement(tag)`
* **Description:** Checks whether any currently attuned entity carries the specified tag.
* **Parameters:** `tag` (string) — the tag to search for among attuned entities.
* **Returns:** `boolean` — `true` if at least one attuned entity has the tag, `false` otherwise.

### `GetAttunedTarget(tag)`
* **Description:** (Server only) Returns the actual entity that is attuned to this player and carries the specified tag.
* **Parameters:** `tag` (string) — the tag to match.
* **Returns:** Entity or `nil` — the matching attuned entity, or `nil` if not found.
* **Error states:** Only valid on the server (`ismastersim`); on clients, always returns `nil`.

### `TransferComponent(newinst)`
* **Description:** (Server only) Transfers all current attunements from this player to another entity (e.g., during character swap or respec).
* **Parameters:** `newinst` (Entity) — the new owner of the attunements.
* **Returns:** Nothing.
* **Error states:** Modifies `attunable` components on all attuned entities; assumes `attunable` is present on those entities.

### `RegisterAttunedSource(proxy)`
* **Description:** Registers a new attunement source using a proxy entity (typically an `attunable_classified` replica).
* **Parameters:** `proxy` (Entity) — the attunement proxy, must have a `source_guid` replica field.
* **Returns:** Nothing.
* **Error states:** Silently ignores duplicate registrations (idempotent).

### `UnregisterAttunedSource(proxy)`
* **Description:** Removes an attunement source and fires the `attunementlost` event.
* **Parameters:** `proxy` (Entity) — the proxy to unregister.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted debug string listing all attuned GUIDs (clients) or full entity references (server).
* **Parameters:** None.
* **Returns:** string — newline-separated list of attuned entities or GUIDs.

## Events & listeners
- **Pushes:** `gotnewattunement` — fired when a new attunement is registered (`{ proxy = proxy }`).
- **Pushes:** `attunementlost` — fired when an attunement is removed (`{ proxy = proxy }`).
