---
id: colouraddersync
title: Colouraddersync
description: Synchronizes colour addition data from the server to clients and triggers visual updates and callbacks when the colour changes.
tags: [network, visual, sync]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c7b59e93
system_scope: network
---

# Colouraddersync

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Colouraddersync` is a network-aware component that ensures the client receives and applies colour addition data (RGBA) intended for additive rendering. It is designed to work in tandem with a corresponding `colouradder` component on the master simulation. The component creates a networked uint value (bound to the entity's GUID) and listens for the `colourdirty` event on non-master instances to trigger visual and callback updates.

## Usage example
```lua
-- Assuming 'inst' is an entity with AnimState and a master-side 'colouradder' component
inst:AddComponent("colouraddersync")
inst.components.colouraddersync:SetColourChangedFn(function(entity, r, g, b, a)
    print("New colour:", r, g, b, a)
end)

-- Later, on the master, a colouradder component calls:
-- inst.components.colouradder:SetColour(r, g, b, a)
-- This will propagate to all clients via this sync component.
```

## Dependencies & tags
**Components used:** None directly accessed; intended to pair with a `colouradder` component on the master.
**Tags:** None added, removed, or checked.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `colour` | net_uint | (networked uint32) | Networked representation of RGBA, encoded as `(r<<24)\|(g<<16)\|(b<<8)\|a`. |
| `colourchangedfn` | function or nil | `nil` | Optional callback invoked on colour change, with signature `fn(inst, r, g, b, a)`. |

## Main functions
### `SetColourChangedFn(fn)`
* **Description:** Sets the callback function to be invoked whenever the colour changes. Immediately triggers one callback if `fn` is non-nil.
* **Parameters:** `fn` (function or nil) — callback expecting `(inst, r, g, b, a)`, where each component is a float in `[0, 1]`.
* **Returns:** Nothing.

### `ForceRefresh()`
* **Description:** Manually triggers the colour callback with the current colour value, bypassing event firing. Useful for ensuring state consistency.
* **Parameters:** None.
* **Returns:** Nothing.

### `SyncColour(r, g, b, a)`
* **Description:** Encodes and sends the RGBA values over the network, updates `AnimState:AddAddColour`, and invokes the colour-change callback (if present). Typically called from the master-side `colouradder` component.
* **Parameters:**  
  * `r` (number) — red component, expected in `[0, 1]`  
  * `g` (number) — green component, expected in `[0, 1]`  
  * `b` (number) — blue component, expected in `[0, 1]`  
  * `a` (number) — alpha (opacity) component, expected in `[0, 1]`  
* **Returns:** Nothing.
* **Error states:** No-op on non-master if called directly (as this method is intended for master use only). The colour is clamped and rounded via `math.floor(... + .5)` before encoding.

## Events & listeners
- **Listens to:** `colourdirty` — triggers `OnColourDirty` on non-master instances to propagate updates.
- **Pushes:** None (only receives and acts on events).
