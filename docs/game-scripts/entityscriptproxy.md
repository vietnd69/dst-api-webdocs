---
id: entityscriptproxy
title: Entityscriptproxy
description: Provides a proxy mechanism for wrapping EntityScript instances to override property access and ensure consistent reference equality for nested components.
tags: [network, component, proxy]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: f82ee393
system_scope: entity
---

# Entityscriptproxy

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`EntityScriptProxy` is a meta-programming utility that wraps `EntityScript` instances (and by extension, their components) to intercept property reads and writes via custom metatables. Its primary purpose is to ensure that when components are accessed through `.components` or `.replica` on an entity, the wrapped component proxies correctly forward `.inst` to the proxy instance itself—not the original entity—thereby preserving reference consistency across the ECS layer. This is critical for client-server synchronization and for maintaining stable references in dynamic entity compositions.

## Usage example
```lua
-- Typically used internally; rarely instantiated directly by mods
-- The `EntityScriptProxy` is automatically applied to entity script instances
local ent = TheSim:FindEntity(function(e) return e:HasTag("player") end)
-- Accessing components through proxy ensures .inst points to the proxy itself
local cmp_proxy = ent.components.combat
assert(cmp_proxy.inst == ent) -- true, even though ent.components.combat is a proxy
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `components_proxy_mt.__index` | function | — | Metamethod for component access: returns proxy-wrapped components and sets their `.inst` to the proxy. |
| `components_proxy_mt.__newindex` | function | — | Metamethod for setting component values directly on the proxy table. |
| `ProxyClass` | function | — | Factory for creating proxy classes with shared behavior (`__gc`, `__eq`, `__index`, `__newindex`). |
| `ProxyInstance` | function | — | Wraps a given object (`obj`) in its own proxy class. |

## Main functions
### `ProxyClass(class, ctor)`
*   **Description:** Creates or retrieves a proxy class for a given base `class`. This proxy class overrides `__index`, `__newindex`, and `__eq` to delegate property access to an underlying `_` table while managing garbage collection and equality semantics across proxies.
*   **Parameters:**
    *   `class` (table) – the base class to be proxied.
    *   `ctor` (function?, optional) – constructor callback invoked during proxy instantiation.
*   **Returns:** A proxy class (table) with custom metamethods.
*   **Error states:** None.

### `ProxyInstance(obj)`
*   **Description:** Wraps an arbitrary object `obj` in a proxy class derived from its metatable.
*   **Parameters:**
    *   `obj` (table) – the object to wrap.
*   **Returns:** A proxy instance of `obj`.
*   **Error states:** None.

### `EntityScriptProxy`
*   **Description:** A pre-instantiated proxy for `EntityScript` that overrides `components` and `replica` with custom proxy tables. These proxy tables ensure that accessed components have their `.inst` property set to the proxy instance instead of the original entity.
*   **Parameters:** None (static constant).
*   **Returns:** None. Sets up metatables on the `EntityScript` type during initialization.

## Events & listeners
None identified.