[![pipeline status](https://gitlab.forge.orange-labs.fr/optisam/optisam-ui/badges/develop/pipeline.svg)](https://gitlab.forge.orange-labs.fr/OrangeMoney/optisam/optisam-ui/commits/develop)

OpTISAM
======

## Introduction

__OPTISAM__ (Optimized tool for inventive Software Asset Management) is a tool for the Software Asset Management Compliance Audit and Optimization Tool.

## Quick start

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

------------------
For open source GCP deployment

Open cloud shell and clone source code.

cd ~/optisam-ui

npm install
npm run build --prod
docker build .
export PROJECT_ID=diese-dev-optisam-it
docker tag 377eaa1477e6 eu.gcr.io/${PROJECT_ID}/optisam/optisam_ui:v1.0.0
docker push  eu.gcr.io/${PROJECT_ID}/optisam/optisam_ui:v1.0.0

## Tag the image id created
------------------------