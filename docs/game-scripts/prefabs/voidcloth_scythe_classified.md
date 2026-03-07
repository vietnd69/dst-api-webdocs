---
id: voidcloth_scythe_classified
title: Voidcloth Scythe Classified
description: A classified component that manages voice line delivery and network synchronization for the Voidcloth Scythe's dialogue system.
tags: [dialogue, network, classified]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 53d9d648
system_scope: network
---

# Voidcloth Scythe Classified

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `voidcloth_scythe_classified` component implements a classified data container for the Voidcloth Scythe, handling voice line selection, network replication, and client-side speech triggering. It acts as a bridge between server-side logic (determining which line to say) and client-side execution (delivering speech via the `Talker` component). The component is not persisted in save files and exists only as a transient data carrier attached to the parent entity.

## Usage example
```lua
-- Server-side: schedule a line to be spoken
if entity.components.voidcloth_scythe_classified ~= nil then
    entity.components.voidcloth_scythe_classified:Say(
        "SAY_LISTEN",           -- string_list
        "LINE_THRALL_WARN_1",   -- string_id
        "rifts2/thrall_generic/vocalization_small"  -- sound_override
    )
    entity.components.voidcloth_scythe_classified:SetTarget(ThePlayer)
end
```

## Dependencies & tags
**Components used:** `talker` (via `inst._parent.components.talker:Say`)  
**Tags:** Adds `CLASSIFIED`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `string_list` | net_smallbyte (server/shared) | `0` | Networked ID of the selected string list. |
| `string_id` | net_smallbyte (server/shared) | `0` | Networked ID of the selected string within the list. |
| `sound_override` | net_tinybyte (server/shared) | `0` | Networked ID of the sound override; triggers `saydirty` event on change. |
| `enabled` | boolean | `false` | Local flag (not replicated); unused in current implementation. |
| `timeouttask` | Task (server only) | `nil` | Task scheduled to auto-clear the current line after 1 second. |
| `istarget` | boolean (server only) | `nil` | Tracks whether `ThePlayer` is the current target for event subscription. |

## Main functions
### `Say(string_list, string_id, sound_override)`
*   **Description:** On the server, schedules a voice line to be spoken. Sets networked values and triggers a 1-second timeout to clear them. Should be called before `SetTarget` to ensure data is ready.
*   **Parameters:**  
    `string_list` (string) — key identifying the string list (e.g., `"SAY_LISTEN"`).  
    `string_id` (string) — key identifying the specific line within the list.  
    `sound_override` (string) — optional sound path to override default selection.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; invalid keys may result in `nil` line resolution and no speech.

### `SetTarget(target)`
*   **Description:** On the server, designates which client (`ThePlayer`) should hear the next line. Registers or unregisters the `"saydirty"` event listener on the classified entity depending on whether the target matches `ThePlayer`.
*   **Parameters:**  
    `target` (Entity or `nil`) — the entity that should be targeted (typically a player or `nil`).
*   **Returns:** Nothing.
*   **Error states:** If `target` is `nil`, the classified listens for `"saydirty"` to enable speech (broadcast to all clients).

### `GetTalkSound(inst)`
*   **Description:** Returns the sound path to use for the current line, selecting from `TALK_SOUNDS` based on `sound_override` value.
*   **Parameters:** `inst` — the classified entity.
*   **Returns:** string — the sound path, or a random fallback if no override matches.
*   **Error states:** Returns a random sound if `inst.sound_override:value()` is out of range.

### `ClearString(inst)`
*   **Description:** Resets the `sound_override` networked value to `0` on the server.
*   **Parameters:** `inst` — the classified entity.
*   **Returns:** Nothing.

### `OnEntityReplicated(inst)`
*   **Description:** On the client, attaches the classified instance to its parent entity after entity replication completes.
*   **Parameters:** `inst` — the classified entity.
*   **Returns:** Nothing.
*   **Error states:** Logs an error and fails to attach if the parent entity cannot be resolved.

## Events & listeners
- **Listens to:**  
  `"saydirty"` — triggers on the client to evaluate and speak the pending line (via `OnSayDirty`). Also registered statically during client initialization.
- **Pushes:** None (does not fire custom events).