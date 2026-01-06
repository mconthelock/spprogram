Npm I git+https://github.com/sutthipongjab/webasset.git

## docker reconfigure

https://chatgpt.com/share/6943cc63-eb88-8008-b99f-f94639df8e0d

### Old Script command in package.json

```json
   "scripts": {
        "webpack:build": "webpack --mode production",
        "tailwind:build": "tailwindcss -i ./assets/style/tailwind.css -o ./assets/dist/css/tailwind.css --minify",
        "build": "npm-run-all --serial tailwind:build webpack:build",
        "webpack:watch": "webpack --watch --mode development",
        "tailwind:watch": "tailwindcss -i ./assets/style/tailwind.css -o ./assets/dist/css/tailwind.css --watch",
        "watch": "npm-run-all --parallel tailwind:watch webpack:watch"
   },
   "scripts": {
        "build:css": "tailwindcss -i ./assets/style/tailwind.css -o ./assets/dist/css/tailwind.css --minify",
        "build:js": "webpack --mode production",
        "build": "run-s build:css build:js",
        "watch:css": "tailwindcss -i ./assets/style/tailwind.css -o ./assets/dist/css/tailwind.css --watch",
        "watch:js": "webpack --watch --mode development",
        "watch": "run-p watch:css watch:js",
        "dev": "npm run watch"
    }
```
