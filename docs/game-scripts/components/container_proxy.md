---
id: container_proxy
title: Container Proxy
description: Acts as a proxy layer between a container's master entity and its openers, managing network synchronization and opener lifecycle for multiplayer consistency.
tags: [network, inventory, container, ui]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f556982d
system_scope: network
---

# Container Proxy

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ContainerProxy` is a network-aware component that synchronizes container access between a master container entity and remote openers (typically players). It runs in parallel with the `container` component attached to the master entity and is responsible for tracking opener-specific proxy objects (`container_opener`), managing opener registration, and ensuring proper event routing and cleanup during multiplayer sessions. It does not manage inventory logic itself but coordinates with the `container` component on the master entity to maintain session state.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("container")
-- Assume 'inst' is now the master container

local proxy = inst:AddComponent("container_proxy")
proxy:SetMaster(inst) -- Required for master-sim behavior
proxy:SetCanBeOpened(true)
proxy:Open(player)
-- ... (player interacts with container) ...
proxy:Close(player)
```

## Dependencies & tags
**Components used:** `container`, `inventory` (via `opencontainerproxies`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *N/A* | The entity instance this component is attached to. |
| `ismastersim` | `boolean` | *N/A* | Whether this instance is running on the master simulation (server). |
| `_cannotbeopened` | `net_bool` | *N/A* | Replicated boolean indicating if the container is blocked from opening. |
| `master` | `Entity?` | `nil` | (Server-only) The master container entity this proxy interfaces with. |
| `openlist` | `table` | `{}` | (Server-only) Map of opener entity → `container_opener` prefab instance. |
| `opencount` | `number` | `0` | (Server-only) Number of active openers. |
| `onopenfn` | `function?` | `nil` | (Server-only) Optional callback invoked when the first opener opens the container. |
| `onclosefn` | `function?` | `nil` | (Server-only) Optional callback invoked when the last opener closes the container. |
| `container_opener` | `Entity?` | `nil` | (Client-only) Reference to the local `container_opener` instance. |

## Main functions
### `SetCanBeOpened(canbeopened)`
*   **Description:** Sets whether the container can be opened. Controls network replication of the openable state.
*   **Parameters:** `canbeopened` (boolean) — `true` to allow opening, `false` to block.
*   **Returns:** Nothing.

### `CanBeOpened()`
*   **Description:** Returns whether the container is currently allowed to be opened.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if openable, `false` otherwise.

### `IsOpenedBy(guy)`
*   **Description:** Checks if a specific entity (`guy`) currently has the container opened via this proxy.
*   **Parameters:** `guy` (Entity) — The entity to check.
*   **Returns:** `boolean` — `true` if opened by `guy`, `false` otherwise.
*   **Error states:** Behavior differs on client vs server: on client, it only checks against `ThePlayer`.

### `AttachOpener(container_opener)`
*   **Description:** (Client-only) Attaches a local `container_opener` instance to this proxy. Registers cleanup listener.
*   **Parameters:** `container_opener` (Entity) — The opener instance to attach.
*   **Returns:** Nothing.
*   **Error states:** Assertion fails if called on server or if an opener is already attached.

### `GetMaster()`
*   **Description:** (Server-only) Returns the master container entity this proxy is associated with.
*   **Parameters:** None.
*   **Returns:** `Entity?` — The master entity, or `nil` if none set.

### `SetMaster(ent)`
*   **Description:** (Server-only) Attaches a master container entity and sets up event callbacks (`onopenother`, `onclose`) to coordinate with it.
*   **Parameters:** `ent` (Entity?) — The master entity to link, or `nil` to detach.
*   **Returns:** Nothing.

### `SetOnOpenFn(fn)`
*   **Description:** (Server-only) Registers a callback to be invoked when the container is first opened (i.e., `opencount` transitions from `0` to `1`).
*   **Parameters:** `fn` (function) — Callback signature: `fn(inst)`.
*   **Returns:** Nothing.

### `SetOnCloseFn(fn)`
*   **Description:** (Server-only) Registers a callback to be invoked when the container is fully closed (i.e., `opencount` reaches `0`).
*   **Parameters:** `fn` (function) — Callback signature: `fn(inst)`.
*   **Returns:** Nothing.

### `Open(doer)`
*   **Description:** (Server-only) Registers a new opener (`doer`) for the container by delegating to the master's `container` component and spawning/attaching a `container_opener` proxy.
*   **Parameters:** `doer` (Entity?) — The entity opening the container. Must not already be in `openlist`.
*   **Returns:** Nothing.
*   **Error states:** No-op if `doer` is `nil` or already in `openlist`. If master’s container fails to open `doer`, the proxy registration is aborted.

### `Close(doer)`
*   **Description:** (Server-only) Closes the container for a specific opener or all openers if `doer` is `nil`.
*   **Parameters:** `doer` (Entity?) — The opener to close; if `nil`, closes all openers.
*   **Returns:** Nothing.

### `OnClose(doer)`
*   **Description:** (Server-only) Internal callback invoked after the master container registers a close event. Removes the opener’s proxy and updates state (`opencount`, inventory tracking).
*   **Parameters:** `doer` (Entity) — The opener that closed the container.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** (Server-only) Delegates the update logic to the master container’s `OnUpdate` method, preserving shared state (`openlist`, `opencount`, `Close`).
*   **Parameters:** `dt` (number) — Delta time in seconds.
*   **Returns:** Nothing.

### `OnRemoveEntity()`
*   **Description:** Cleans up on entity removal: closes all openers and clears master binding.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRemoveFromEntity()`
*   **Description:** Asserts that this component should never be removed from its entity (enforces strict lifecycle).
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` (on `container_opener`) — Clears `self.container_opener` on client when the local opener is removed.
- **Pushes:** (via master) `onopenother` (when `Open` initiates), `oncloseother` (when `OnClose` completes). These events use `{ doer = opener, other = self.inst }`.

## Notes
- This component *must* be paired with a `container` component on a separate master entity. It does not implement container logic itself.
- The `container_opener` entities spawned on open are specialized client-side actors used for UI/interaction binding.
- Client behavior relies entirely on `ThePlayer` and local replica state (`container_opener`). Server behavior manages full multi-opener state.
- Event callbacks (`onopenother`, `onclose`) are used to propagate state changes between the proxy and master to prevent duplicate opens/closes or stale proxies.
