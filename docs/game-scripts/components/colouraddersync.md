---
id: colouraddersync
title: Colouraddersync
description: This component synchronizes and applies additive color changes to an entity's animation state across the network.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: network
source_hash: c7b59e93
---

# Colouraddersync

## Overview
The `Colouraddersync` component is responsible for managing and synchronizing an entity's additive color values across a network. It uses a `net_uint` to store the combined RGBA color on the server, which is then replicated to clients. On the client side, it translates this network value back into individual RGBA channels and applies the color to the entity's `AnimState`, also providing a callback mechanism for other components to react to color changes.

## Dependencies & Tags
This component implicitly relies on the owning entity having an `AnimState` component for applying visual color changes. It does not explicitly add other components or tags.

None identified.

## Properties
| Property          | Type        | Default Value | Description                                                                         |
| :---------------- | :---------- | :------------ | :---------------------------------------------------------------------------------- |
| `inst`            | `Entity`    | `inst`        | A reference to the owning entity this component is attached to.                     |
| `colour`          | `net_uint`  | `0`           | A network unsigned integer used to synchronize the combined RGBA color value.       |
| `colourchangedfn` | `function?` | `nil`         | An optional callback function to be executed when the component's color value changes (either locally or via network sync). |

## Main Functions
### `SetColourChangedFn(fn)`
*   **Description:** Sets a callback function that will be invoked whenever the entity's additive color is updated, either through network synchronization or direct calls to `SyncColour`. It also immediately triggers the callback with the current color.
*   **Parameters:**
    *   `fn`: (`function`) The callback function to be set. It should accept five arguments: `(inst, r, g, b, a)`, where `inst` is the owning entity and `r, g, b, a` are the normalized (0-1) additive color components.

### `ForceRefresh()`
*   **Description:** Forces an immediate refresh of the current color state. This will trigger the `colourchangedfn` callback if one is set, using the component's currently stored color value. This can be useful to re-apply color or trigger effects without actually changing the color value.
*   **Parameters:** None.

### `SyncColour(r, g, b, a)`
*   **Description:** Sets the additive color for the entity and synchronizes it across the network. This function combines the individual RGBA components into a single `net_uint` for efficient network transfer. It also directly applies the color to the entity's `AnimState` and invokes the `colourchangedfn` callback if present.
*   **Parameters:**
    *   `r`: (`number`) The red component of the additive color, normalized (0-1).
    *   `g`: (`number`) The green component of the additive color, normalized (0-1).
    *   `b`: (`number`) The blue component of the additive color, normalized (0-1).
    *   `a`: (`number`) The alpha (opacity) component of the additive color, normalized (0-1).

## Events & Listeners
*   **Listens For:**
    *   `colourdirty`: On client machines, this component listens for the `colourdirty` event, which is triggered when the `self.colour` `net_uint` variable changes its value from the server. Upon receiving this event, the `OnColourDirty` function is called, which decodes the network color and triggers the `colourchangedfn` callback.