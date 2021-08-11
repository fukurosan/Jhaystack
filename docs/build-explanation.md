# Build Explanation

## Available builds
There are multiple builds of Jhaystack that can be used for different purposes. Find the one that you need in the table below.

?> All builds are compatible with all evergreen browsers as well as nodejs version 12+.  

The bundle names follow the following pseudo pattern:  
"jhaystack.(modulesystem).(?min).js"

| Module system | Description                                                                                       |
| ---           | ---                                                                                               |
| umd           |   Universal Module Definition, works in most places.                                              |
| iife          |   Immediately invoked function.                                                                   |
| cjs           |   CommonJS, suitable for example in nodejs projects.                                              |
| esm           |   ES Modules, especially suitable in projects that will be bundled as it allows for tree shaking. |

| Build Type    | Description                                                                                       |
| ---           | ---                                                                                               |
| Regular       |   Not minified. These builds do not have the ".min" additions in their names.                     |
| Minified      |   Minified versions. Suitable for production use. Files are marked with ".min" in the name        |

- If importing the library from unpkg the minified umd version will be used by default.  
- If installing the library through npm the minified cjs version will be used by default.  
- If installing the library through npm and running it through a bundler the minified esm version will be used by default.  

!> **Tip**  
*If you are unfamiliar with what the different terms mean then below is a cheat sheet.*

- Using the library in the browser with a \<script\> element?
 - umd or iife
- Using it in a nodejs project?
 - cjs
- Using it inside of a bundler?
 - esm

And, generally, use the .min version for production.
