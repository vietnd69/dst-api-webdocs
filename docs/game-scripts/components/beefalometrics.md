---
id: beefalometrics
title: Beefalometrics
description: Records and reports metric events related to beefalo domestication, riding, attacks, and death for analytics purposes.
tags: [analytics, entity, metrics, behavior]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: fd572fcf
system_scope: entity
---

# Beefalometrics

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Beefalometrics` is a passive analytics component that listens for specific events on beefalo entities and pushes structured metric events to the `Stats` system. It focuses on domestication progression (feeding, brushing, domestication state changes), riding activity, combat interactions, and death events. It maintains a reference to the last player who interacted with the beefalo (e.g., via feeding or brushing) to associate metric events with that user. The component does not affect gameplay logic—it is strictly for telemetry.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("beefalometrics")

-- The component automatically starts listening for events upon addition.
-- No manual initialization is required.
-- Example metric events will fire when domestication, riding, or combat events occur.
```

## Dependencies & tags
**Components used:** `domesticatable`, `edible`, `rideable`, `uniqueid`, `Stats`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed in) | Reference to the entity this component is attached to. |
| `lastdomesticator` | `Entity` or `nil` | `nil` | Reference to the last player to feed/brush the beefalo (for event attribution). |
| `lastdomesticator_id` | `string` or `nil` | `nil` | User ID of the last domesticator, used for network serialization. |
| `ridestarttime` | `number` or `nil` | `nil` | Timestamp (via `GetTime()`) when riding began; used to compute ride duration. |

## Main functions
### `SetLastDomesticator(player)`
*   **Description:** Sets the last domesticator for event attribution (e.g., who fed or brushed the beefalo). Clears stored user ID if a full entity is provided.
*   **Parameters:** `player` (`Entity`) — the player entity performing the domestication action.
*   **Returns:** Nothing.

### `GetLastDomesticator()`
*   **Description:** Returns the last domesticator entity. Attempts to resolve a cached `lastdomesticator_id` to an entity; returns the user ID string if resolution fails, or `nil` if unavailable.
*   **Parameters:** None.
*   **Returns:** `Entity`, `string`, or `nil` — the domesticator entity if available, otherwise the user ID string, or `nil`.
*   **Error states:** If `UserToPlayer()` returns `nil`, returns the stored `lastdomesticator_id` (string) instead of failing.

### `OnSave()`
*   **Description:** Serializes state for network or save game persistence—specifically, the `lastdomesticator_id`.
*   **Parameters:** None.
*   **Returns:** `table?` — a table `{lastdomesticator_id = "userid"}` or `nil` if no ID is stored.

### `OnLoad(data)`
*   **Description:** Deserializes saved state—restores `lastdomesticator_id` from persistence data.
*   **Parameters:** `data` (`table`) — expected to contain `{lastdomesticator_id = string}`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `domesticationdelta` — triggered when domestication level crosses from 0 to >0; fires `beefalo.domestication.start` event.  
  `oneat` — triggered when beefalo eats; fires `beefalo.domestication.feed` event with feeding context.  
  `brushed` — triggered when beefalo is brushed; fires `beefalo.domestication.brushed` event with brushing context.  
  `domesticated` — triggered on full domestication; fires `beefalo.domestication.domesticated` event with tendancy values.  
  `goneferal` — triggered when beefalo reverts to feral state; fires `beefalo.domestication.feral` event.  
  `death` — triggered on beefalo death (only if domestication > 0); fires `beefalo.domestication.death` event with cause and afflicter info.  
  `riderchanged` — triggered when rider mounts/dismounts; fires `beefalo.domestication.ride` on dismount with ride duration.  
  `attacked` — triggered when beefalo is attacked while being ridden; fires `beefalo.domestication.mountedattacked` event.  
  `riderdoattackother` — triggered when rider attacks while mounted; fires `beefalo.domestication.mountedattack` event.

- **Pushes:** None — this component only consumes events and forwards them to `Stats.PushMetricsEvent`.
