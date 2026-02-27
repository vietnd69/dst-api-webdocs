---
id: writeable_replica
title: Writeable Replica
description: Manages client-side representation and interaction with writeable entities by synchronizing access to classified data and handling UI presentation.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: d013b160
---

# Writeable Replica

## Overview
This component acts as a client-side replica for writeable entities (e.g., journals, notes), coordinating access to `writeable_classified` data, managing UI screen creation, and synchronizing text input with the server via RPC. It ensures safe rendering and interaction when the client gains access to classified writeable data, while avoiding duplication of behavior handled by the master simulation.

## Dependencies & Tags
- Relies on the `writeable_classified` prefab for classification data (spawned on master, referenced on client).
- Listens to the `"onremove"` event on the attached `classified` entity.
- Does not add or remove entity tags directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component is attached to. |
| `screen` | `WriteableScreen?` | `nil` | Reference to the currently active writeable UI screen on the client. |
| `opentask` | `Task?` | `nil` | A delayed task to begin writing immediately upon classified attachment; canceled during detach or explicit close. |
| `classified` | `writeable_classified?` | `nil` | Reference to the classified component providing writeable content; populated differently on master vs. client. |
| `ondetachclassified` | `function?` | `nil` | Callback function to handle classified entity removal; stores `self:DetachClassified()` to be passed to event listener. |

## Main Functions

### `AttachClassified(classified)`
* **Description:** Attaches a classified component to this writeable replica, sets up removal listener, and schedules immediate writing initialization via `opentask`. Called when client receives classified data (e.g., after server sync).
* **Parameters:**
  * `classified`: The `writeable_classified` component instance to attach.

### `DetachClassified()`
* **Description:** Removes the classified reference and ends any active writing session, closing the UI if present.
* **Parameters:** None.

### `BeginWriting(doer)`
* **Description:** Initiates the writing process. If the master sim `writeable` component exists, delegates to it; otherwise, creates the writeable screen on the client (only for local player).
* **Parameters:**
  * `doer`: The entity attempting to write (typically `ThePlayer`); must be provided for client-side screen creation.

### `Write(doer, text)`
* **Description:** Writes or updates the writeable’s text. Delegates to the master `writeable` component if present; otherwise, sends RPC to server with sanitized text (length-checked) for replication.
* **Parameters:**
  * `doer`: The entity performing the write (validated against `ThePlayer` on client).
  * `text`: The string or `nil` to clear the writeable; length enforced via `text:utf8len()` against layout-defined max characters.

### `EndWriting()`
* **Description:** Ends the active writing session. Cancels pending open task, delegates to master `writeable` if present, or closes and destroys the local screen.
* **Parameters:** None.

### `SetWriter(writer)`
* **Description:** Assigns the writer (target entity) for the classified component’s network tracking. Used for permission or attribution logic; asserts that this is not used during normal operation if a master `writeable` component exists.
* **Parameters:**
  * `writer`: The entity to set as writer (or `nil` to clear); defaults to `self.inst` if passed as `nil`.

## Events & Listeners
- Listens for `"onremove"` event on `self.classified`, triggering `self.ondetachclassified` (which calls `DetachClassified()`).
- Triggers no custom events itself.