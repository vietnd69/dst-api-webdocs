---
id: lucy_classified
title: Lucy Classified
description: Manages networked string and sound data for Lucy's classified speech, syncing dialog triggers and talk sounds across clients.
tags: [network, speech, classified]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ef1425e1
system_scope: network
---

# Lucy Classified

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lucy_classified` is a lightweight, non-persistent networked entity used to coordinate classified speech for Lucy (Woodie's chicken form). It holds replicated fields for string list, string ID, and sound override, and works with the `talker` component on its parent entity to play dialog. It is attached via `parent:AttachClassified(inst)` and only activates listening/speaking when the parent entity is the local player. Server-side logic sets speech data, while client-side logic triggers actual talk events.

## Usage example
This component is not directly added by modders; it is instantiated as a prefab (`lucy_classified`) and attached to the parent entity via `inst:AttachClassified(inst)`. A typical server-side call looks like:

```lua
if inst.components.talker then
    inst:ListenForEvent("saydirty", function() inst.components.classified:Say("LUCY", 1, "dontstarve/characters/woodie/lucy_warn_1") end)
end
```

## Dependencies & tags
**Components used:** `talker` (via `inst._parent.components.talker:Say`)  
**Tags:** Adds `"CLASSIFIED"` to the classified entity itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `string_list` | `net_smallbyte` | `0` | Replicated index into `STRING_LISTS` for the dialog line. |
| `string_id` | `net_smallbyte` | `0` | Replicated string ID within the selected list. |
| `sound_override` | `net_tinybyte` | `0` | Replicated index into `TALK_SOUNDS`; triggers `"saydirty"` event on change. |
| `enabled` | boolean | `false` | Unused local flag (set but never referenced). |
| `timeouttask` | Task or `nil` | `nil` | Server-side delayed task to clear string data after 1 second. |
| `istarget` | boolean or `nil` | `nil` | Tracks if the parent is the local player, used to toggle event listeners. |
| `_parent` | Entity or `nil` | `nil` | (Client only) Reference to the parent entity (e.g., Lucy). |

## Main functions
### `Say(inst, string_list, string_id, sound_override)`
* **Description:** Sets the classified speech data on the server and schedules a timeout to clear it after 1 second. Must be called on the server.
* **Parameters:**  
  `string_list` (string) — Key in `STRINGS.LUCY` (e.g., `"LUCY"`).  
  `string_id` (number) — Index into the string list (e.g., `1`).  
  `sound_override` (string or `nil`) — Full path to a talk sound (e.g., `"dontstarve/characters/woodie/lucy_warn_1"`); uses fallback index if omitted.
* **Returns:** Nothing.
* **Error states:** No explicit error returns; silently clamps invalid indices via `table.invert` mappings.

### `SetTarget(inst, target)`
* **Description:** Sets the target for classified speech and toggles listening for `"saydirty"` events based on whether the parent matches the local player. Meant to be called on the server.
* **Parameters:**  
  `target` (Entity or `nil`) — Usually `ThePlayer` or `nil`.
* **Returns:** Nothing.
* **Error states:** No failure mode; toggles event listeners based on `target == ThePlayer`.

### `GetTalkSound(inst)`
* **Description:** (Client-facing) Returns the current talk sound path based on `sound_override`.
* **Parameters:** None.
* **Returns:** string — Sound path from `TALK_SOUNDS` or fallback if index is out of range.
* **Error states:** No error handling; uses `#TALK_SOUNDS + 1` as index when sound is unknown.

## Events & listeners
- **Listens to:**  
  `"saydirty"` — Triggered on change of `sound_override`; calls `OnSayDirty` to speak the line via `talker:Say`. Listened to only when `istarget` is `true`.  
- **Pushes:**  
  None.

### `RegisterNetListeners(inst)`
* Registers the `"saydirty"` listener and immediately invokes `OnSayDirty` for initial sync.

### `OnEntityReplicated(inst)`
* Binds `_parent` to the entity's parent and attaches this classified instance via `parent:AttachClassified(inst)`. Runs on the client after replication.

### `ClearString(inst)`
* Resets all replicated string/sound fields to `0` (client-server sync via `:set_local`). Used on say timeout or before new speech.

### `OnSayDirty(inst)`
* Executes only when `sound_override > 0` and the parent exists. Fetches and plays the line using `talker:Say`. `nobroadcast` is set to `true`.

### `OnSayTimeout(inst)`
* Clears the `timeouttask` and invokes `ClearString(inst)` to reset speech state.
