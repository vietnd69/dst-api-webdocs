---
id: writeable_replica
title: Writeable Replica
description: Manages client-side networked writing interactions for writeable entities by coordinating with the server-hosted writeable component and classified data.
tags: [network, ui, interaction]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d013b160
system_scope: network
---
# Writeable Replica

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Writeable Replica` implements the client-side interface for writing on writeable entities (e.g., signs, journals). It handles the display of the writing UI, text input, and synchronization with the server via RPC calls. It relies on the `writeable` component on the server (when present) and falls back to direct communication via a `classified` child entity for networked clients. It is not responsible for the actual logic of writing—only for managing the client experience and relaying data.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("writeable_replica")
-- Writing UI and text handling occurs automatically when the player interacts
-- via the writeable's interaction UI; this component connects to the server
-- writeable component or classified entity to propagate changes.
```

## Dependencies & tags
**Components used:** `writeable`, `classified` (via `self.classified`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `screen` | widget (optional) | `nil` | Reference to the writeable UI widget, created when writing starts. |
| `opentask` | Task (optional) | `nil` | Delayed task used to begin writing after classification data is attached. |
| `classified` | Entity (optional) | `nil` | Child entity holding networked writeable data; created on master or attached from `inst.writeable_classified` on clients. |

## Main functions
### `AttachClassified(classified)`
* **Description:** Attaches a `classified` entity to this component. Once attached, it schedules writing to begin after a zero-time delay via `opentask`.
* **Parameters:** `classified` (Entity) — the classified data container entity.
* **Returns:** Nothing.

### `DetachClassified()`
* **Description:** Detaches the `classified` entity, cancels pending tasks, and ends any ongoing writing session.
* **Parameters:** None.
* **Returns:** Nothing.

### `BeginWriting(doer)`
* **Description:** Starts the writing interaction. If a server `writeable` component exists, it delegates to it. Otherwise (client-only path), it creates a UI screen if the player is the doer.
* **Parameters:** `doer` (Entity) — the entity (usually a player) attempting to start writing.
* **Returns:** Nothing.
* **Error states:** No-op if `doer` is `nil`, or if `doer.HUD` is missing, or if writing is already in progress on the `writeable` component.

### `Write(doer, text)`
* **Description:** Sends the written text to the server. If a `writeable` component exists, it delegates to it. Otherwise, it triggers an RPC to set the text on the server.
* **Parameters:**  
  - `doer` (Entity) — the entity performing the write (must be `ThePlayer` for the client path).  
  - `text` (string | `nil`) — the text to write (length checked before sending).  
* **Returns:** Nothing.
* **Error states:** Writing is rejected if `text` exceeds `MAX_WRITEABLE_LENGTH` or `doer ~= ThePlayer` in the classified path.

### `EndWriting()`
* **Description:** Cleans up and closes the writing UI and cancels any pending open tasks. Delegates to `writeable` component if present.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No explicit failure; silently handles missing HUD or screen instances.

### `SetWriter(writer)`
* **Description:** Assigns the target for classified data (e.g., owner or owner entity). Used during construction or target reassignment.
* **Parameters:** `writer` (Entity | `nil`) — the entity that should receive write access; if `nil`, defaults to `self.inst`.
* **Returns:** Nothing.
* **Error states:** Asserts if `writer` is non-`nil` when no `writeable` component is present (i.e., unexpected usage outside construction).

## Events & listeners
- **Listens to:**  
  - `onremove` on the `classified` entity (via `self.ondetachclassified`) — triggers `DetachClassified()` when the classified entity is removed.
- **Pushes:** None identified.

## Notes
- This component runs on **clients only**; the actual write logic resides in `components/writeable.lua` on the master simulation.
- It is designed to support both the traditional `writeable` component path (server-side authoritative) and a legacy/classified path for networked data propagation.
- RPC `RPC.SetWriteableText` is used to transmit text changes from client to server when the `writeable` component is absent.
- The `OnRemoveEntity()` override ensures the `classified` child is removed only on the master simulation to prevent duplicate cleanup.

