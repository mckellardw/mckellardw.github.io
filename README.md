# mckellardw.github.io

Source for my personal site — [mckellardw.github.io](https://mckellardw.github.io/).

**David W. McKellar, PhD**
Co-founder & CTO, Romix Biosciences
david [at] romixbio [dot] com

[google scholar](https://scholar.google.com/citations?user=Hta5xCcAAAAJ&hl=en&oi=ao) ·
[pubmed](https://pubmed.ncbi.nlm.nih.gov/?term=David+McKellar%5BAuthor%5D&sort=date) ·
[github](https://github.com/mckellardw) ·
[linkedin](https://www.linkedin.com/in/dwmckellar) ·
[twitter](https://twitter.com/dwmckellar)

## Building

Hugo (extended) with the [hugo-paper](https://github.com/nanxiaobei/hugo-paper) theme as a submodule:

```bash
git clone --recursive https://github.com/mckellardw/mckellardw.github.io
hugo server -D      # local preview at localhost:1313
hugo --gc --minify  # production build
```

Pushes to `main` deploy automatically via GitHub Actions.
