---
title: "Source maps"
description: "CLI tool reference for bugsee-sourcemaps, which generates and uploads JavaScript source maps to Bugsee for readable crash stack traces."
sidebar_position: 0
slug: "/tools/sourcemaps"
---

`bugsee-sourcemaps` is a CLI tool that generates and uploads source maps to Bugsee servers from JavaScript-based projects.

## Installation

```bash
# using NPM
npm install -g bugsee-sourcemaps

# using Yarn
yarn global add bugsee-sourcemaps
```

## Usage

```bash
Usage
    $ bugsee-sourcemaps <command> <options> <project-dir>

    Commands
        upload

    Options
        -h, --help
        -t, --app-token,
        -v, --app-version,
        -s, --source-map,
        -b, --bundle,
        -e, --endpoint,
        -p, --platform,
        -c, --configuration,
        -o, --overwrite
```

### Options

|Option|Required|Compatible commands|Description
|---|---|---|---|
|-t, --app-token|Yes|make, upload, generate|Application token that identifies the app in Bugsee you want to upload source maps for|
|-v, --app-version|No|make, generate, upload|Lets Bugsee to associate source maps with the specified application version. We recommend to set this manually to make sure there will be no any differences in versions of source maps and crash reports|
|-s, --source-map|Yes|upload|Path to the generated source maps (file)|
|-b, --bundle|Yes|upload|Path to the generated bundle (file)|
|-e, --endpoint|No|upload, make|Defines the upload endpoint|
|-p, --platform|Yes|make, generate, upload|Identifies the platform source maps are generated for. Available values are: 'ios' and 'android'|
|-c|No\*|make, generate, upload|Defines the configuration to use when handling the source maps. Available values: 'debug' and 'release'. <br />\*_Note that this option is required for `upload` command as there is no way to easily found out for which configuration sourcemap was generated.For other commands, if omitted, source maps will be generated for both debug and release configurations_.|
|-o, --overwrite|No|make, upload|Instructs the tool to overwrite any existing source maps of the same version, build configuration and platform|


### Commands

- **make**: This command is a union of generate and upload. It automatically generates source maps and uploads them to Bugsee servers.
- **generate**: This command instructs the tool to trigger source maps generation for the specified project.
- **upload**: This command instructs the tool to upload the specified   to the Bugsee servers.
