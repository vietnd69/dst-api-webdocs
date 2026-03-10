---
id: popupmanager
title: Popupmanager
description: Manages UI popup states and RPC communication for client-server synchronization in Don't Starve Together.
tags: [ui, network, popup]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: d2f9895c
system_scope: ui
---

# Popupmanager

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`PopupManagerWidget` is a utility class used to manage UI popup screens in Don't Starve Together. Each popup instance defines a unique ID, a numeric code, a validation function for RPC parameters, and a handler function that opens or closes the corresponding screen. It supports both master-server and dedicated-server environments, routing calls appropriately via RPCs when needed, or directly on the master simulation. The system provides a centralized registry (`POPUPS`, `POPUPS_BY_POPUP_CODE`, etc.) for built-in and mod-added popups.

## Usage example
```lua
-- Access built-in popup and trigger its screen
local popup = POPUPS.WARDROBE
popup:Close(inst) -- Close if already open
popup:SendMessageToServer(inst, true, target_entity)

-- Or programmatically open via popup code
local popup = GetPopupFromPopupCode(2) -- WARDROBE code is 2
if popup and popup.fn then
    popup.fn(inst, true, target_entity)
end
```

## Dependencies & tags
**Components used:** None directly accessed via `inst.components.X`. Relies on `ThePlayer`, `TheWorld`, `TheNet`, and HUD components (`inst.HUD`) being present in the runtime context.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `id` | string | `nil` (set at initialization via loop) | String identifier (e.g., `"WARDROBE"`) assigned during `POPUPS` initialization. |
| `code` | number | `nil` (set at initialization via loop) | Unique numeric code assigned during `POPUPS` initialization. |
| `mod_name` | string | `nil` | Not used in this file; intended for modded popups. |
| `validaterpcfn` | function | `function() return true end` | Function to validate RPC parameters before processing. |
| `fn` | function | `function() end` | Handler function called to open/close the popup screen. |

## Main functions
### `Close(inst, ...)`
* **Description:** Closes the popup. On non-master-sim clients, sends an RPC to the server to trigger `ms_closepopup` on master; on master, directly pushes the event.
* **Parameters:**
  * `inst` (entity) — The player entity associated with the popup.
  * `...` (optional arguments) — Additional arguments passed through to the server.
* **Returns:** Nothing.

### `SendMessageToServer(inst, ...)`
* **Description:** Sends a popup message to the server. On non-master-sim clients, sends `RPC.RecievePopupMessage`; on master, pushes `ms_popupmessage`.
* **Parameters:**
  * `inst` (entity) — The player entity.
  * `...` (optional arguments) — Message payload.
* **Returns:** Nothing.

### `SendMessageToClient(inst, ...)`
* **Description:** Sends a popup message to a specific client. Uses `CLIENT_RPC.RecievePopupMessage` for remote clients or pushes `client_popupmessage` for local handling.
* **Parameters:**
  * `inst` (entity) — The target player entity (with `inst.userid`).
  * `...` (optional arguments) — Message payload.
* **Returns:** Nothing.

### `__tostring()`
* **Description:** Returns a formatted string representation: `"id (code)"`.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"WARDROBE (2)"`.

### `GetPopupFromPopupCode(popupcode, mod_name)`
* **Description:** Retrieves a popup instance by its numeric code. Supports both vanilla (`mod_name = nil`) and modded popups.
* **Parameters:**
  * `popupcode` (number) — The numeric code of the popup.
  * `mod_name` (string, optional) — Mod identifier; if provided, looks in `MOD_POPUPS_BY_POPUP_CODE[mod_name]`.
* **Returns:** `PopupManagerWidget` or `nil`.

### `GetPopupIDFromPopupCode(popupcode, mod_name)`
* **Description:** Retrieves the string ID of a popup by its numeric code. Supports both vanilla and modded popups.
* **Parameters:**
  * `popupcode` (number) — The numeric code of the popup.
  * `mod_name` (string, optional) — Mod identifier.
* **Returns:** `string` or `nil`.

## Events & listeners
- **Listens to:** `ms_closepopup`, `ms_popupmessage`, `client_popupmessage` — These are *not* listened to directly in this file; they are pushed by this component and expected to be handled elsewhere (e.g., in HUD or screen logic).
- **Pushes:** `ms_closepopup`, `ms_popupmessage`, `client_popupmessage` — Pushed via `inst:PushEvent(...)` under specific conditions (e.g., on master simulation or locally for debugging).