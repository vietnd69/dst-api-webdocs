---
id: writeable
title: Writeable
description: Manages the state and behavior of entities that can be written on, including text storage, writing session management, and automatic UI interaction.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: eba8b18d
---

# Writeable

## Overview
The `Writeable` component enables entities to hold and display user-provided text (e.g., signs, notebooks), tracks writing sessions initiated by players, manages associated UI widgets, and handles synchronization of writer identity and text content across clients. It integrates closely with the `inspectable` component to provide dynamic descriptions and supports events for custom behavior during writing completion or cancellation.

## Dependencies & Tags
- **Components:**
  - Relies on `inspectable` (for custom description via `gettext`) if present.
  - Uses `rider` component (to detect if writer is riding and auto-cancel writing).
- **Tags:**
  - Dynamically adds/removes `"writeable"` tag based on `writeable_by_default` state and whether text is present.
  - AnimState layers `"WRITING"` shown/hidden in sync with tag changes when `AnimState` exists.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `writeable_by_default` | `boolean` | `true` | Controls whether the entity starts with the `"writeable"` tag and default writing capability. |
| `text` | `string?` | `nil` | The stored written text. `nil` indicates unwritten state. |
| `writer` | `Entity?` | `nil` | The entity currently initiating or participating in the writing session. |
| `screen` | `WriteableScreen?` | `nil` | Reference to the client-side UI screen/widget for writing (created on write start). |
| `onclosepopups` | `function` | — | Internal callback triggered on popup close or writer removal to auto-end writing. |
| `generatorfn` | `function?` | `nil` | Reserved for future use (uninitialized in current code). |
| `automatic_description` | `boolean` | `true` | Enables/disables dynamic description updates (e.g., showing written text in inspect). |
| `writeable_distance` | `number` | `3` | Maximum distance (in world units) required for a writer to remain valid during writing. |
| `writer_netid` | `number?` | `nil` | Network ID of the writer, stored for safe replication and display (e.g., attribution). |
| `writer_userid` | `string?` | `nil` | User ID of the writer, stored for attribution and safety. |

## Main Functions
### `BeginWriting(doer)`
* **Description:** Starts a writing session on the entity with the given writer (`doer`). Initializes the writer reference, opens the writing UI (if `doer.HUD` exists), and begins entity updates to check for writing session validity.
* **Parameters:**
  - `doer` (`Entity`): The entity initiating writing (typically a player).

### `EndWriting()`
* **Description:** Ends the current writing session gracefully. Cleans up the UI screen, removes writer-related event listeners, stores writer identity info, invokes `onwritingended` callback (if set), and stops entity updates.
* **Parameters:** None.

### `Write(doer, text)`
* **Description:** Finalizes the writing session by storing the provided text, invoking the `onwritten` callback (if set), ending the writing session, and optionally destroying the entity if `remove_after_write` is true.
* **Parameters:**
  - `doer` (`Entity`): Must match the current `writer` (security check).
  - `text` (`string?`): The written content (may be `nil` to clear; length is validated via `utf8len` or `MAX_WRITEABLE_LENGTH`).

### `GetText()`
* **Description:** Returns the stored text. On Xbox One (`IsXB1()`), prepends and appends `\1` and includes `writer_netid` for platform-specific handling.
* **Parameters:** None.

### `SetText(text)`
* **Description:** Sets the internal `text` property (low-level; does not trigger side effects like tag updates—use `Write` instead for full behavior).
* **Parameters:**
  - `text` (`string?`): The new text value.

### `SetAutomaticDescriptionEnabled(ad_enabled)`
* **Description:** Enables or disables dynamic descriptions (e.g., showing written text when inspecting the entity). Modifies `inspectable.getspecialdescription`.
* **Parameters:**
  - `ad_enabled` (`boolean`): Whether to enable automatic description updates.

### `SetDefaultWriteable(writeable_by_default)`
* **Description:** Changes the `writeable_by_default` flag and immediately updates the `"writeable"` tag and `"WRITING"` animation state accordingly.
* **Parameters:**
  - `writeable_by_default` (`boolean`): New default writeable state.

### `SetWriteableDistance(dist)`
* **Description:** Sets the maximum distance (`writeable_distance`) the writer must remain within to keep the writing session active.
* **Parameters:**
  - `dist` (`number`): New distance threshold.

### `SetOnWrittenFn(fn)`
* **Description:** Assigns a custom callback to be invoked when writing is successfully completed via `Write()`.
* **Parameters:**
  - `fn` (`function`): Signature: `fn(inst, text, writer)`.

### `SetOnWritingEndedFn(fn)`
* **Description:** Assigns a custom callback to be invoked when a writing session ends (successfully or canceled).
* **Parameters:**
  - `fn` (`function`): Signature: `fn(inst)`.

### `IsWritten()`
* **Description:** Returns `true` if the entity has non-`nil` written text.
* **Parameters:** None.

### `IsBeingWritten()`
* **Description:** Returns `true` if a writing session is currently in progress (`writer` is set).
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Handles auto-cancellation of writing sessions if the writer is no longer near, no longer visible, or riding an entity. Called each frame only while `writer` is set.
* **Parameters:**
  - `dt` (`number`): Delta time (unused directly, but required per component update contract).

### `OnSave()`
* **Description:** Serializes persistent state (text, writer netid, writer userid) for saving to disk.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores state from saved data. Applies word filtering for RAIL builds.
* **Parameters:**
  - `data` (`table`): Contains keys `text`, `netid`, `userid`.

### `OnRemoveFromEntity()`
* **Description:** Cleanup called when component is removed from the entity. Ends any active writing session, removes tags/events, and cleans up inspectable callbacks.
* **Parameters:** None.

## Events & Listeners
- **Listens for `"onbuilt"`:** Triggers `onbuilt` handler, which calls `BeginWriting(data.builder)`.
- **Listens for `"ms_closepopups"` (on writer):** Triggered via `onclosepopups` to end writing if the writer closes popups.
- **Listens for `"onremove"` (on writer):** Ensures writing is ended if the writer is removed.
- **Pushes events:**
  - `onwritten` (via callback, if set) after successful write.
  - `onwritingended` (via callback, if set) when writing ends.
  - (`onwritten` and `onwritingended` are *not* standard DST events but custom callbacks stored locally.)