---
id: carnivalgame_placementblocker
title: Carnivalgame Placementblocker
description: Provides a non-interactive, non-persistent placeholder entity used during carnival game setup to block placement and mark valid locations.
tags: [placement, decoration, network]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 232d92af
system_scope: environment
---

# Carnivalgame Placementblocker

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`carnivalgame_placementblocker` is a simple, client-server compatible entity prefab used as a temporary visual and logical marker during carnival game placement. It is non-interactive (`NOCLICK`), non-persistent (`persists = false`), and purely decorative (`DECOR`). It is added to the scene only on the master simulation (server) and never sent to clients beyond its transform data.

## Usage example
This prefab is not intended for direct manual instantiation in mod code. It is created internally by the game during carnival game setup, typically via placement utilities, and discarded once the actual game is initialized.

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `NOCLICK`, `DECOR`, `carnivalgame_part`.

## Properties
No public properties.

## Main functions
This is a prefab constructor function (not a component), so it has no instance methods. It is invoked via `Prefab("carnivalgame_placementblocker", fn)` during game initialization.

## Events & listeners
None identified.

