# tsCoolDown

An experiment in TypeScript + React for rendering UIs. Based on the old addon
[wereHamster/coolDown](https://github.com/wereHamster/coolDown), partly because I loved that Addon,
and mostly because it's a simple and appropriate use case for React style declarative UI.

## Building & running

**Build:**

```
cd build
npm i
cd ..
npm i
npm run build

# or
npm run watch
```

This will build all the .lua files into `tsCoolDown/build/*.lua`.

**Run:**

Symlink the tsCoolDown folder into your `WoW/_classic_/Interface/Addons` folder

For Windows 10 you can use:

```
mklink /d tsCoolDown c:\Users\<me>\Desktop\tsCoolDown\tsCoolDown
```
