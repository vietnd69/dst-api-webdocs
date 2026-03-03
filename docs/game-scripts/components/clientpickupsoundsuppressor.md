---
id: clientpickupsoundsuppressor
title: Clientpickupsoundsuppressor
description: Temporarily suppresses pickup sound playback for an entity on the client to avoid duplicate sounds during network synchronization.
tags: [audio, network, synchronization]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 7d8f002d
system_scope: audio
---

# Clientpickupsoundsuppressor

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ClientPickupSoundSuppressor` prevents redundant pickup sound events on the client during entity spawn and network resynchronization. It works by temporarily setting `inst.pickupsound` to `"NONE"` and restoring it after a short delay, using a networked boolean flag (`_ignorenext`) to distinguish between newly spawned entities on the client versus existing entities receiving delayed spawn events. This component is only active on non-master simulation clients.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("clientpickupsoundsuppressor")
-- Optionally trigger suppression logic for next pickup event
inst.components.clientpickupsoundsuppressor:IgnoreNextPickupSound()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties  

## Main functions
### `IgnoreNextPickupSound()`
* **Description:** Marks the next pickup event to be ignored on the client by setting a networked boolean flag. Used to prevent duplicate sound playback when an entity spawns on the client but is not newly spawned server-side.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If the entity has `pickupsound == "NONE"`, no action is taken.

## Events & listeners
- **Listens to:** `clientpickupsoundsuppressor._ignorenext` — triggers `OnIgnoreNext()` to suppress `pickupsound` when the networked flag is set to `true`.
- **Pushes:** None.
