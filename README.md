# Meoew.com

Meoew.com is a custom Discord desktop app — a fork of [Vesktop](https://github.com/Vencord/Vesktop) that ships the [doiksub](https://github.com/ghxstprey/doiksub) client mod instead of stock Vencord

**Main features**:
- doiksub preinstalled (curated Vencord fork with custom plugins)
- Much more lightweight and faster than the official Discord app
- Linux Screenshare with sound & wayland
- Much better privacy, since Discord has no access to your system

**Not yet supported**:
- Global Keybinds
- see the [Roadmap](https://github.com/Vencord/Vesktop/issues/324)

![](https://github.com/Vencord/Vesktop/assets/45497981/8608a899-96a9-4027-9725-2cb02ba189fd)
![](https://github.com/Vencord/Vesktop/assets/45497981/8701e5de-52c4-4346-a990-719cb971642e)

## Installing

Build from source (see below) or grab artifacts from a GitHub Actions run.

## Building from Source

You need to have the following dependencies installed:
- Git
- Node.js >= 22
- pnpm: `npm install --global pnpm`

Packaging will create builds in the dist/ folder

```sh
git clone https://github.com/sqzass/meoew.com.git
cd meoew.com

# Install Dependencies
pnpm i

# Either run it without packaging
pnpm start

# Or package (will build packages / the app for your OS)
pnpm package

# Or only build the Linux deb package
pnpm package --linux deb

# Or package to a directory only
pnpm package:dir
```