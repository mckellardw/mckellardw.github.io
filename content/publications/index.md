---
title: "Publications"
---

<style>
  .pub-link {
    text-decoration: none;
    font-weight: bold;
  }
  .pub-link:hover {
    text-decoration: underline;
  }
  .link-paper {
    color: #5A93E8;
  }
  .link-biorxiv {
    color: #D9615A;
  }
  .link-github {
    color: #4D9E62;
  }
  .link-pdf {
    color: #E8B42A;
  }
  .author-highlight {
    color: inherit;
    transition: color 0.2s ease;
    cursor: pointer;
    font-weight: bold;
  }
</style>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const authors = document.querySelectorAll('.author-highlight');
    const colors = ['#5A93E8', '#D9615A', '#4D9E62', '#E8B42A'];

    authors.forEach(function(author) {
      author.addEventListener('mouseenter', function() {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        author.style.setProperty('color', randomColor, 'important');
      });

      author.addEventListener('mouseleave', function() {
        author.style.removeProperty('color');
      });
    });
  });
</script>

## **Highlighted**

***High Resolution Spatial Mapping of Microbiome-Host Interactions via in situ Polyadenylation and Spatial RNA Sequencing.***<br>
I Ntekas^, L Takayasu^, <strong><u class="author-highlight">DW McKellar</u></strong>^, B Grodner, M Hinchman, C Holdener, P Schweitzer, M Sauthoff, Q Shi, L Brito, I de Vlaminck<br>
<a href="https://doi.org/10.1101/2024.11.18.624127" class="pub-link link-biorxiv">[bioRxiv, 2024]</a>
<a href="https://github.com/ntekasi/microSTRS" class="pub-link link-github">[github]</a>
<a href="https://mckellardw.github.io/pdfs/manuscripts/Ntekas_et_al_bioRxiv_2024.pdf" class="pub-link link-pdf">[pdf]</a>

***Spatial mapping of the total transcriptome by in situ polyadenylation.***<br>
<strong><u class="author-highlight">DW McKellar</u></strong>, M Mantri, M Hinchman, JSL Parker, P Sethupathy, BD Cosgrove, I de Vlaminck<br>
<a href="https://www.nature.com/articles/s41587-022-01517-6" class="pub-link link-paper">[Nature Biotechnology, 2023]</a>
<a href="https://doi.org/10.1101/2022.04.20.488964" class="pub-link link-biorxiv">[bioRxiv, 2022]</a>
<a href="https://github.com/mckellardw/STRS" class="pub-link link-github">[github]</a>
<a href="https://mckellardw.github.io/pdfs/manuscripts/McKellar_et_al_NatureBiotechnology_2022.pdf" class="pub-link link-pdf">[pdf]</a>
<a href="https://www.nature.com/articles/s41587-022-01562-1" class="pub-link link-paper">[Research Briefing]</a>

***Large-scale integration of single-cell transcriptomic data captures transitional progenitor states in mouse skeletal muscle regeneration.***<br>
<strong><u class="author-highlight">DW McKellar</u></strong>, LD Walter, LT Song, M Mantri, MFZ Wang, I de Vlaminck, BD Cosgrove<br>
<a href="https://doi.org/10.1038/s42003-021-02810-x" class="pub-link link-paper">[Communications Biology, 2021]</a>
<a href="https://www.biorxiv.org/content/10.1101/2020.12.01.407460v2" class="pub-link link-biorxiv">[bioRxiv, 2020]</a>
<a href="https://github.com/mckellardw/scMuscle" class="pub-link link-github">[github]</a>
<a href="https://mckellardw.github.io/pdfs/manuscripts/McKellar_et_al_Communications_Biology_2021.pdf" class="pub-link link-pdf">[pdf]</a>

