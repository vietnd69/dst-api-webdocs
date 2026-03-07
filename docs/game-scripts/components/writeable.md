---
id: writeable
title: Writeable
description: Manages the ability for entities to hold and display custom text written by players.
tags: [interaction, text, network, item, player]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: eba8b18d
system_scope: entity
---

# Writeable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Writeable` enables entities (e.g., signs, scrolls, journals) to store, display, and persist custom text written by players. It handles the entire writing workflow—starting a writing session, updating text, and finalizing the written state—and synchronizes the writer identity and content over the network. It integrates with the `inspectable` component to provide special description text for written/unwritten states and reacts to proximity and riding states to auto-close writing sessions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("writeable")
inst.components.writeable:SetText("Hello world")
inst.components.writeable:SetDefaultWriteable(false) -- Not auto-writeable by default
inst.components.writeable:SetAutomaticDescriptionEnabled(true)
```

## Dependencies & tags
**Components used:** `rider` (to check `IsRiding`), `inspectable` (for `getspecialdescription`)
**Tags:** Adds/removes `writeable` tag based on state; uses `burnt` tag for special description.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `writeable_by_default` | boolean | `true` | If `true`, the entity starts with the `writeable` tag and shows "UNWRITTEN" state. |
| `text` | string or `nil` | `nil` | The currently written text content. |
| `writer` | entity or `nil` | `nil` | The entity currently performing the writing action. |
| `screen` | widget or `nil` | `nil` | The UI screen/widget shown during writing. |
| `automatic_description` | boolean | `true` | If `true`, enables dynamic description handling for written/unwritten states. |
| `writeable_distance` | number | `3` | Max distance the writer can be from the entity to begin/write. |
| `onwritten` | function or `nil` | `nil` | Callback fired after successful write. Signature: `fn(inst, text, doer)`. |
| `onwritingended` | function or `nil` | `nil` | Callback fired when a writing session ends. Signature: `fn(inst)`. |

## Main functions
### `BeginWriting(doer)`
*   **Description:** Starts a writing session for the given entity (`doer`). Updates internal state, adds event listeners, and opens a writing UI if `doer.HUD` is present.
*   **Parameters:** `doer` (entity) - the player or entity attempting to write.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `writer` is already set (no re-entry allowed).

### `EndWriting()`
*   **Description:** Finalizes and closes the current writing session. Clears UI, removes event listeners, and saves writer identity (userid/netid). Fires `onwritingended` callback.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Write(doer, text)`
*   **Description:** Saves the provided `text` to the entity if validation passes (correct writer, text length within limit). Applies word filtering in RAIL builds. Removes the entity if `remove_after_write` is set.
*   **Parameters:**  
    *   `doer` (entity) - must match the current `writer`.  
    *   `text` (string or `nil`) - the content to write; may be `nil` to erase. Length must be `<= maxcharacters` (from layout) or `MAX_WRITEABLE_LENGTH`.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `doer` is not the current writer, is `nil`, or text exceeds length limit.

### `GetText()`
*   **Description:** Returns the stored text. In XB1 builds, returns a special format string with writer netid for rendering.
*   **Parameters:** None.
*   **Returns:** `string or nil` — the written text or `"\1" .. text .. "\1" .. writer_netid` on XB1.

### `SetText(text)`
*   **Description:** Directly sets the `text` field without validation or side effects.
*   **Parameters:** `text` (string or `nil`) — the new content.
*   **Returns:** Nothing.

### `IsWritten()`
*   **Description:** Checks if the entity has been written on.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `text ~= nil`.

### `IsBeingWritten()`
*   **Description:** Checks if a writing session is currently active.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `writer ~= nil`.

### `SetAutomaticDescriptionEnabled(ad_enabled)`
*   **Description:** Enables/disables the automatic `inspectable.getspecialdescription` logic (which returns "BURNT", written text, or "UNWRITTEN").
*   **Parameters:** `ad_enabled` (boolean).
*   **Returns:** Nothing.

### `SetDefaultWriteable(writeable_by_default)`
*   **Description:** Toggles the `writeable_by_default` flag and updates the `writeable` tag and animation state accordingly.
*   **Parameters:** `writeable_by_default` (boolean).
*   **Returns:** Nothing.

### `SetWriteableDistance(dist)`
*   **Description:** Sets the maximum distance (`writeable_distance`) the writer must be within to write.
*   **Parameters:** `dist` (number).
*   **Returns:** Nothing.

### `SetOnWrittenFn(fn)`
*   **Description:** Registers a callback function to be invoked after a successful write.
*   **Parameters:** `fn` (function) — callback with signature `fn(inst, text, doer)`.
*   **Returns:** Nothing.

### `SetOnWritingEndedFn(fn)`
*   **Description:** Registers a callback function to be invoked when a writing session ends.
*   **Parameters:** `fn` (function) — callback with signature `fn(inst)`.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** serializes the written state for persistence. Returns `text`, `writer_netid`, and `writer_userid`.
*   **Parameters:** None.
*   **Returns:** `table` — ` { text, netid, userid }`.

### `OnLoad(data)`
*   **Description:** Restores the written state from saved data. Applies word filtering in RAIL builds.
*   **Parameters:** `data` (table) — must contain `text`, `netid`, `userid`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `onbuilt` — triggers `BeginWriting(data.builder)` when the entity is built.
  - `ms_closepopups` (from writer only) — triggers `EndWriting()` if the writer closes popups.
  - `onremove` (from writer only) — triggers `EndWriting()` if the writer is removed.
  - `text`, `writer`, `automatic_description` — triggers corresponding listener functions (`ontextchange`, `onwriter`, `onautodescribechanged`).
- **Pushes:** None.

## Utility / Helper functions
### `gettext(inst, viewer)`
*   **Description:** INTERNAL — Returns description string for inspectable depending on burn and write state. Used as `inspectable.getspecialdescription`.
*   **Parameters:**  
    *   `inst` (entity) — the writeable entity.  
    *   `viewer` (entity) — the inspecting entity (player).  
*   **Returns:** `string or {string, context, netid}` — description string(s) based on state.

### `onbuilt(inst, data)`
*   **Description:** INTERNAL — Event handler for `onbuilt`; invokes `BeginWriting(data.builder)`.

### `ontextchange(self, text)`
*   **Description:** INTERNAL — Adds/removes the `writeable` tag and controls `"WRITING"` animation based on whether `text` is `nil`.

### `onwriter(self, writer)`
*   **Description:** INTERNAL — Syncs writer identity to the network replica (`self.inst.replica.writeable:SetWriter(writer)`).

### `onautodescribechanged(self, new_ad, old_ad)`
*   **Description:** INTERNAL — Attaches or detaches the `gettext` handler to `inspectable.getspecialdescription` based on `automatic_description`.
