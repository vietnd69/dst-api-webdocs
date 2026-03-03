---
id: customise
title: Customise
description: This file is deprecated and serves only as a legacy alias that redirects to the actual customize.lua script.
tags: [deprecated, redirect, map]
sidebar_position: 100
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: map
source_hash: 5ba88f0b
---
# Customise

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This file is deprecated and should no longer be used. It exists solely to maintain backward compatibility by redirecting to the correct `map/customize.lua` file. The redirect is implemented via `return require("map/customize")`. No functional logic or component behavior resides in this file; it acts only as a forwarding shim.

## Usage example

This file should not be used directly. To access the functionality, require the `map/customize` module instead:

```lua
local customize = require("map/customize")
-- Use `customize` as intended (e.g., passing a callback or table as per `map/customize.lua`'s API)
```

## Dependencies & tags

**Components used:** None  
**Tags:** None identified

## Properties

No properties are defined in this file.

## Main functions

No functions are defined in this file.

## Events & listeners

No events or listeners are defined in this file.