# QAlgo

**English** · [Français](README.fr.md)

**A quantum circuit simulator in the browser, for the classroom.**

QAlgo lets you build a quantum circuit with the mouse, watch the state of every
qubit live along with the output amplitudes and probabilities, then take
measurements. Nothing to install: a web page is enough. The tool is built for
teaching — a first encounter with quantum computing in upper secondary school,
in technical colleges or in early undergraduate courses — and is deliberately
simpler at first sight than simulators aimed at research.

👉 **Use QAlgo: <https://www.qalgo.org>**

| Version | Address |
|---|---|
| English | <https://www.qalgo.org/index.html> |
| Français | <https://www.qalgo.org/indexFR.html> |

A set of demonstration videos (in French) is available on
[this YouTube playlist](https://www.youtube.com/playlist?list=PLRB_NPOpDF7c1ls7fDW1XJaqxqoHdImrc).

Use is free and unrestricted. No account is required.

---

## Contents

- [What QAlgo does](#what-qalgo-does)
- [Available gates](#available-gates)
- [Controls](#controls)
- [Bundled examples](#bundled-examples)
- [Technical architecture](#technical-architecture)
- [Repository layout](#repository-layout)
- [Working on the code](#working-on-the-code)
- [Running your own instance](#running-your-own-instance)
- [Known limitations](#known-limitations)
- [Author, contact and licence](#author-contact-and-licence)

---

## What QAlgo does

- **Draw a circuit with the mouse.** Drop input qubits and gates onto the
  canvas, connect them, move them, resize them. The circuit is recomputed on
  every change.
- **Watch the state live.** The coefficients of each qubit, and the complex
  amplitudes and probabilities of the whole register, displayed along the
  circuit. Superposition states can be animated.
- **Choose your notation.** Coefficients in algebraic or trigonometric form, or
  as Bloch angles; angles in degrees, radians or multiples of π; basis states in
  binary or decimal; adjustable precision.
- **Measure.** Measure the whole register, or take a **partial measurement** of
  a single quantum line, collapsing the state and renormalising the rest — this
  is what makes teleportation and superdense coding readable. Draws can be
  repeated as often as you like.
- **Write your own oracle.** The `f(x)` function of an oracle is written
  directly in JavaScript in a panel of the interface; it is then tabulated over
  every possible input.
- **Create your own gates.** A matrix editor lets you define an arbitrary gate
  (up to 8 quantum lines); it is normalised automatically and joins the palette
  under the symbol you choose.
- **Turn a whole circuit into a single gate.** QAlgo feeds in each basis state
  in turn to rebuild the matrix of the displayed circuit column by column, and
  makes a reusable gate out of it.
- **Visualise on the Bloch sphere.** Two orientable 3D views, at the input and
  after measurement, for a circuit with a single quantum line.
- **Plot the amplitudes.** A chart gives, for each basis state, the phase, the
  probability, or the real or imaginary part of the amplitude.
- **Save and share.** A circuit is saved to a text file along with its teaching
  notes, and reloads identically. Amplitudes can be exported as CSV for a
  spreadsheet.
- **Undo.** `Ctrl+Z` undoes and `Ctrl+Y` redoes, over some sixty steps; the ↶
  and ↷ buttons in the palette do the same, and grey out when there is nothing
  to undo. The current circuit is also saved in the browser: if one is left from
  your last visit, QAlgo offers to pick it up again.
- **Work large.** A "Full screen" button hides the browser bar; the canvas grows
  accordingly.
- **Work in French or English**, the whole interface switching with one click.

## Available gates

| Family | Elements |
|---|---|
| Input qubits | ∣0⟩, ∣1⟩, (∣0⟩+∣1⟩)/√2, (∣0⟩−∣1⟩)/√2, or any qubit given by its coefficients |
| Single-qubit gates | X, Y, Z, H, R<sub>Φ</sub> (adjustable phase), √X |
| Two-qubit gates | SWAP, √SWAP |
| n-qubit gates | Quantum Fourier transform and its inverse, oracle O<sub>f</sub>, Grover diffusion operator 2∣ψ⟩⟨ψ∣−I |
| Controls | Control and anti-control, applicable to any gate |
| Outputs | State and probability probe, measurement |
| Decoration | Alice, Bob and Gérard characters, for communication protocols |

Any gate defined by a unitary matrix can be added to this list from the
interface, without touching the code.

## Controls

| Action | Command |
|---|---|
| Drop or remove a qubit or a gate | Click and drag |
| Select and move | Left click |
| Change the size | Left click + scroll wheel |
| Change the colour | Right click |
| Change a qubit's coefficients | Double click |
| Change an oracle's `f(x)` | Double click |
| Change the Φ of an R<sub>Φ</sub> gate | Double click |
| Partial measurement | Double click on a measurement |
| Delete | `Delete` key |
| Undo, redo | `Ctrl+Z`, `Ctrl+Y`, or the ↶ and ↷ buttons |

## Bundled examples

Available from the **Examples** menu, in French and in English. Each one
carries its own explanatory text, shown in the interface.

| Example | What it shows |
|---|---|
| Bell states ∣Φ+⟩, ∣Φ−⟩, ∣Ψ+⟩, ∣Ψ−⟩ | Entanglement of two qubits |
| Toffoli gate | Classical universal gate, double control |
| Superdense coding | Two classical bits carried by one qubit |
| Deutsch-Jozsa algorithm | Constant or balanced function, in a single call |
| Grover's algorithm, 3 and 6 qubits | Search in an unsorted list |
| Quantum teleportation | Transfer of a state through partial measurements |
| Shor's algorithm for 15 and for 21 | Factoring, Fourier transform |

## Technical architecture

| Layer | Technologies |
|---|---|
| Interface | Plain JavaScript, no framework, Bootstrap 5 |
| Rendering and interaction | p5.js (2D canvas, and WEBGL for the Bloch sphere) |
| Compute engine | JavaScript, full state vector (2<sup>n</sup> complex amplitudes) |
| Server | None: everything runs in the visitor's browser |

**The circuit is modelled as a directed graph.** Every element placed on the
canvas is a vertex (input qubit, gate, control, probe, measurement) and every
wire is an edge; control wires form a separate list. A traversal of the graph
rebuilds the quantum lines and the order in which the gates apply. That is what
makes it possible to draw freely and still obtain a computable circuit.

**The simulation is exact**, by state vector: each gate transforms the
2<sup>n</sup> complex amplitudes of the register. Controls are not particular
gates but a condition applied to the components of the vector, so that any gate
can be controlled.

The circuit file format, the catalogue of vertex types and the compute chain are
documented in comments inside the relevant files: `src/outils.js` for
serialisation, `src/sommetaretes.js` for the types, `src/calculsQuantiques.js`
for the engine. Every file in `src/` opens with an `//INTERFACE` section listing
its functions with a one-line description each.

Note that the source code and its comments are written in French.

## Repository layout

| Path | Role |
|---|---|
| `index.html` | Application page, English version |
| `indexFR.html` | Application page, French version |
| `analytics.js` | Deferred loading of Google Analytics, abandoned after 2 s |
| `src/` | **The JavaScript code**: the files you edit, and the ones the browser loads |
| `assets/css/style.css` | Style sheet of the application |
| `assets/img/favicon.svg` | Tab icon: a stylised Bloch sphere |
| `assets/img/` | Interface images: Alice, Bob, Gérard, flags, cursors |
| `assets/gates/` | Gate thumbnails shown in the palette |
| `assets/fonts/regular.ttf` | Font used by the 3D rendering of the Bloch sphere |
| `vendor/bootstrap/` | Bootstrap 5 |
| `vendor/p5/` | Local copy of p5.js, optional and not versioned |
| `examples/fr/`, `examples/en/` | Example circuits loaded from the menu |
| `examples/circuitouverture.txt` | Circuit shown on start-up |
| `server/compteurquantique.php` | Visit counter, currently disabled |
| `outils/test_algos.js` | Replays the 24 example circuits and compares the amplitudes |
| `outils/test_interface.js` | Checks full screen and the circuit history |
| `outils/references_algos.json` | Reference results of the 24 circuits |
| `outils/verifie_pages.py` | Checks that the two pages have not drifted apart |
| `outils/publie.sh` | Sends the server only the files that changed |
| `outils/publie.conf.exemple` | Template for the publishing server's details |

The sources in detail:

| File | Role |
|---|---|
| `src/sketch.js` | p5.js loop: canvas, mouse, keyboard, context menu, zoom |
| `src/graphe.js` | `Graph` class: the circuit, its quantum lines, the chain of computations |
| `src/sommetaretes.js` | `Sommet` (qubit, gate, measurement) and `Arete` (wire, control wire) classes |
| `src/calculsQuantiques.js` | Engine: state vector, gate application, measurements, oracle |
| `src/affichage.js` | Interface panels, matrix editor, user-created gates |
| `src/outils.js` | Settings, complex numbers, saving and loading, CSV export |
| `src/bloch.js` | 3D Bloch sphere and its sliders |
| `src/Graphic.js` | Phase / probability / real part / imaginary part chart |
| `src/traduction.js` | French ↔ English switching of the whole interface |
| `src/plein_ecran.js` | "Full screen" button in the menu bar |
| `src/historique.js` | Undo, and automatic saving of the circuit |

Names in the code are French, as are the comments: `sommet` is a vertex, `arete`
an edge, `porte` a gate, `ligne quantique` a quantum line, `mesure` a
measurement.

## Working on the code

**There is neither compilation nor a build step**: the files in `src/` are both
the sources and what the browser runs. Edit, refresh.

The ten scripts are loaded in an order that matters — they share global
variables and none of them is a module — and that order is fixed at the top of
the `<body>` of both pages.

The pages append a version number to the scripts (`?v=21.4`) to force a reload
in visitors' browsers after a deployment; it must be incremented on every
publication.

To work locally, serve the folder:

```bash
python -m http.server 8000
# then open http://localhost:8000/index.html
```

Opening `index.html` by double-clicking it is not enough: the examples are
fetched over HTTP, which browsers refuse from a local file.

### The two-page rule

There are two pages because a search engine ties **one language to one URL**:
each therefore has its own `<head>`, with its title, description and Open Graph
tags in its own language, the two declaring each other through `hreflang`.

**The body of the two pages, however, must stay identical.** It is written in
French; `index.html` adds `onload="changeLanguage()"` to its `<body>` tag, and
`src/traduction.js` translates the whole interface on load.

In practice:

1. every interface change is made in `indexFR.html`;
2. it is then copied into `index.html`, whose `<head>` alone is its own;
3. every visible string goes through `src/traduction.js`, in both languages.

A script checks this invariant, and verifies along the way that every identifier
`traduction.js` addresses does exist in the page:

```bash
python outils/verifie_pages.py
```

### Checking that no algorithm has moved

Before and after any change to the engine:

```bash
node outils/test_algos.js
```

This test reloads the files from `src/` — **the real engine, with no
reimplementation whatsoever** — then replays the 24 example circuits and
compares the amplitudes obtained against `outils/references_algos.json`. It runs
outside the browser: minimal stubs stand in for p5.js and the DOM, and nothing
is drawn. Expect some twenty seconds, ten of which are Shor for 21 and its
262,144 amplitudes; `--rapide` leaves that one out.

The comparison is made on a SHA-256 fingerprint of the complex amplitudes, not
just on the probabilities: a phase error, invisible on screen, is therefore
caught. The test also prints the most probable states of each circuit, which
tells you at once *which* algorithm changed, and how.

After a **deliberate** change to a computation:

```bash
node outils/test_algos.js --enregistre
```

then read the diff of `references_algos.json` to confirm that only the
algorithms concerned have moved.

The interface modules have their own test, which also reloads the real engine:

```bash
node outils/test_interface.js
```

Node.js is needed only for these tests; the site itself does not require it.

### Publishing to the server

First copy `outils/publie.conf.exemple` to `outils/publie.conf` and fill in the
server address, its SSH port, the destination folder and the matching public
address. **`publie.conf` is not versioned**: a server's details have no place in
a public repository.

```bash
sh outils/publie.sh --liste    # what changed, without sending anything
sh outils/publie.sh            # runs the tests, shows, asks, publishes
```

The script asks the server for the MD5 checksum of each of the 65 files of the
site and sends only those that are missing or differ, in a single archive. It
**refuses to publish if a test fails**, then verifies over HTTP that the server
really serves the new content, and reports any file present on the web server
that has no business being there.

The list of what makes up the site is an **allow-list**, at the top of the
script: anything not in it stays on the development machine.

## Running your own instance

QAlgo is a static site: there is no database and no code to compile.

1. Copy the contents of the repository to the root of the site, or into a
   subfolder.
2. That is all. No configuration, no secret, no dependency to install; p5.js and
   Bootstrap are loaded from a CDN.

PHP is only needed for `server/compteurquantique.php`, a visit counter that
writes to a `compteurquantique.txt` file next to it. The code that called it is
disabled today in `src/sketch.js`.

## Known limitations

- **18 qubits at most.** Beyond that, the state vector (2<sup>18</sup>
  amplitudes) no longer computes fast enough to stay interactive.
- **The Bloch sphere is only shown for a circuit with a single quantum line**:
  the state of an entangled qubit is not a point on the sphere.
- **The oracle runs the JavaScript typed into the interface.** This is
  deliberate: it is what allows `f(x)` to be written freely. But since a circuit
  file records that function, **do not open a circuit file from an unknown
  source.**
- The pages are written in French and translated into English on load by
  `src/traduction.js`: the English text is therefore absent from the delivered
  HTML, which limits the search engine ranking of the English version.
- p5.js is loaded in version 0.10.2, the one the rendering was tuned against.

## Author, contact and licence

QAlgo is developed by **Frédéric Boissac**, a physics and computer science
teacher.

- Contact: <prof.boissac@gmail.com>
- A bug, an idea, a suggestion: open an issue on this repository, or write to the
  address above.
- By the same author: [Dariush](https://physalgo.fr/Dariush/), a Python, SQL and
  Linux programming environment in the browser.

### Licence

Copyright © 2025-2026 Frédéric Boissac

QAlgo is free software, distributed under the
[GNU Affero General Public License, version 3](LICENSE) (AGPL-3.0). You may use
it, study it, modify it and redistribute it. In return, any modified version —
including one offered as an online service — must remain under this same
licence, with its source code available to its users and the author's
attribution preserved.

The third-party libraries included keep their respective licences.

QAlgo stands on free software, and thanks are due to its authors:
[p5.js](https://p5js.org) and [Bootstrap](https://getbootstrap.com).
