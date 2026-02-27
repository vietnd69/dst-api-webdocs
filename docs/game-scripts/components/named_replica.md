---
id: named_replica
title: Named Replica
description: This component synchronizes the name and author of an entity across the network using replica variables and updates local instance properties in response to dirty events on clients.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 936a8f23
---

# Named Replica

## Overview
This component manages client-server synchronization of an entity's display name and author identifier. It uses `net_string` replica variables to propagate changes from the master simulation to clients and listens for dirty events on non-master instances to update local name and author properties.

## Dependencies & Tags
- **Replica Variables:** Creates two replica string variables: `_name` and `_author_netid`.
- **No external component dependencies** (e.g., no `AddComponent` calls).
- **Event Listeners:** Registers local listeners for `"namedirty"` and `"authordirty"` events only on non-master instances.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_name` | `net_string` | `net_string(inst.GUID, "named._name", "namedirty")` | Replica variable storing the entity's display name; synchronized across the network. |
| `_author_netid` | `net_string` | `net_string(inst.GUID, "named._author_netid", "authordirty")` | Replica variable storing the author's NetID as a string; synchronized across the network. |

## Main Functions

### `Named:SetName(name, author)`
* **Description:** Sets the entity's name and author on the master simulation. This triggers dirty events on the master, which propagate the values to clients via replica sync.
* **Parameters:**
  * `name` (string): The display name to assign to the entity. Empty strings are accepted but may trigger fallback naming on clients.
  * `author` (string): The author's NetID (as a string). Can be empty; clients treat empty values as `nil`.

## Events & Listeners
- **Listens for `"namedirty"` event** (client-side only): Triggers `OnNameDirty`, which updates `inst.name` using the value from `self._name` or falls back to a default string based on `inst.prefab`.
- **Listens for `"authordirty"` event** (client-side only): Triggers `OnAuthorDirty`, which updates `inst.name_author_netid` with the author NetID from `self._author_netid`, or sets it to `nil` if the value is empty.