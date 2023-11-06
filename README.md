# Just Another Launcher Dashboard (JALD.)

This is JALD. It is just another launcher dashboard.

I like naming things.

It uses [KDL](https://kdl.dev) to define dashboards that are rendered using [Eleventy](https://11ty.dev).

This is a total work-in-progress. Expect wonkiness. Expect questionable decisions. But we're on this journey together, aren't we? Good, good. Moving on.

## Pronunciation

Like "bald," with a soft "j."

Or the past-tense form "y'all."

## Why?

First, that's a vague question. I respect that.

Second, there are lots of dashboard application service things out there. They're great. And none of them did exactly what I wanted. So this one does. Or it can.

I have options.

And you do, too, perhaps. I dunno if JALD is for you--I'll be honest, so far, zero out of four dentists recommend it at press time.

Thirdually, I jumped on this chance to use KDL with Eleventy.

## Install

```bash
# install
git clone [this repo url]
npm install

# generate dashboards
npm run-script build

# for development
npm start
```

## Configuring and using JALD.

### App config

JALD expects there to be a `config.kdl` file wherever the script is being run. [A sample config document](/config.kdl.sample) is included. This tells JALD some dashboard-wide settings like an app title and a little image to include in the main menu bar included on all dashboards.

### Dashboards

A dashboard is made from a [KDL document](https://kdl.dev), which sit in `layouts`. You can have as many files as you want. Each document will be made into a dashbaord in `build`, with the same folder structure as `layouts`. So, `layouts/index.kdl` becomes `build/index.html`, `layouts/path/index.kdl` becomes `build/path/index.html`, etc.

Who doesn't love options?

A layout file, `layouts/index.kdl` for example, can have a `config` item anywhere in the document root, and it can have as many panels as you want, each with its own API of sorts.

```kdl
config title="a sample jald dashboard" icon="/layouts/assets/example.svg"
```

A [sample dashboard document](dashboards/sample.kdl) is included in this repo.

### Links Panel

It's why we're here. We want lists of links with pretty icons that will help us navigate to things we use often. JALD has 'em.

Links wrap any number of link blocks, and accept some attributes as well. The `icon` attribute expects the name of a [Material Design icon](https://materialdesignicons.com/).

The child nodes of `links` are identified by the text you want in the tile&mdash;whatever you want, name of the link, a codeword for your favorite pair of pants, whatever. Again, options. Its properties are the different properties of the link itself:

```
links heading="A bunch of great links" icon="link-variant" {
	"The name of your link" icon="link" href="https://..."
	...
}
```

At the moment, all links are opened in new tabs.

## TODO

- [ ] There is a mix of Nunjuck and ES6 templates. Do... something about that.
- [ ] That RSS panel needs to get migrated to Nunjuck.
- [ ] This readme needs more config clarity. I have it looking for `config.kdl` to define... something, but I also have `dotEnv`? Should probably centralize on KDL.
