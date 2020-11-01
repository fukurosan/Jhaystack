# Build Explanation

## Available builds
There are multiple builds of Jhaystack that can be used for different purposes. Find the one that you need in the table below.

?> All builds are compatible with all evergreen browsers as well as nodejs version 8+
For compatibility with older browsers (i.e. IE11), use the legacy build. Note that the legacy build may not be as performant.

The bundle names follow the following pseudo pattern:  
"jhaystack.(modulesystem).(?legacy).(?min).js"

| Module system | Description                                                                                       |
| ---           | ---                                                                                               |
| umd           |   Universal Module System, works in most places.                                                  |
| iife          |   Immediately invoked function.                                                                   |
| cjs           |   CommonJS, suitable for example in nodejs projects.                                              |
| esm           |   ES Modules, especially suitable in projects that will be bundled as it allows for tree shaking. |

| Build Type  | Description                                                                                       |
| ---         | ---                                                                                               |
| Regular     |   Not minified. These builds do not have the ".min" or ".legacy" additions in their names.  |
| Minified    |   Minified versions. Suitable for production use. Files are marked with ".min" in the name  |
| Legacy      |   Build compatible with older browsers (read: IE11). Marked with ".legacy" in the name.     |

- If importing the library from unpkg the non-legacy minified umd version will be used.  
- If installing the library through npm the minified umd module will be used.

!> If you are unfamiliar with what the different terms mean then below is a cheat sheet.

- Using the library in the browser with a \<script\> element?
 - umd or iife
- Using it in a nodejs project?
 - cjs
- Using it inside of a bundler?
 - esm
- Need IE11 compatibility?
 - Use the .legacy version

And, generally, always use the .min version for production.