---
title: "Bhavesh Adivi"
description: "High school researcher in computational proteomics and machine learning for biological data."
permalink: /
---

I am a high school student at Thomas Jefferson High School for Science and Technology in Alexandria, Virginia! I study computational proteomics and machine learning for biological data at the Georgetown ICBI DPM lab, with an independent research focus on what protein language models learn and whether those features reflect real biology through unsupervised techniques. I am also Chief Technology Officer of CodeTheCure, a startup building frontier AI tools for cancer patients, while I volunteer at Children's National Hospital on Sundays.

## Research Interests

- **Interpretability of protein language models:** Testing through interpretability research whether the features that these protein language models and protein-protein attraction models learn actually match real biological patterns through interchain categorical Jacobians and Knowledge Distillation.
- **Computational proteomics:** Modeling protein stability and how proteins depend on helper proteins called chaperones by training the first-ever chaperone-dependency prediction Graph Network Model.
- **Machine learning for omics data:** Applying explainable AI and symbolic regression to gene expression data at NASA GeneLab (Summer 2026, ASGSR Annual Conference 2026).
- **Mechanistic models in medicine:** Combining mechanistic model heuristics of the original Dynamic Precision Medicine (DPM) Generalized Evolutionary Classifier (EC1) with novel clustering research for Mixture-of-Experts XGBoost optimal treatment trajectory prediction training at Georgetown University DPM Lab (Innovation Center for Biomedical Informatics).

## Education and Training

I am a junior at TJHSST, graduating in June 2028. My coursework includes AP Calculus BC, AP Physics C: Mechanics, AP Chemistry, and several advanced computer science and biology courses. In summer 2026, I took part in research programs at Stanford Medicine (Department of Radiology), NASA GeneLab, and Virginia Commonwealth University. See the <a href="/education/" class="blue-underline">Education</a>, <a href="/research/" class="blue-underline">Research</a>, <a href="/projects/" class="blue-underline">Projects</a>, and <a href="/experience/" class="blue-underline">Experience</a> pages for full details.

<style>
#intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 999999;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #000000;
}
#intro-name {
  font-size: 36px;
  font-weight: 900;
  letter-spacing: -0.5px;
  white-space: nowrap;
  z-index: 1000001;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: relative;
  margin-left: 100px;
}
#intro-name a {
  text-decoration: none;
  border-bottom: 2px solid #0066ff;
  padding-bottom: 2px;
}
#intro-name .first {
  color: #000000;
  position: absolute;
  right: 0;
  animation: slideOutFromBox 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
#intro-name .last { color: #ffffff; background: #000000; padding: 6px 16px; border-radius: 8px; }
html[data-theme="dark"] #intro-overlay { background: rgba(0, 0, 0, 0.85); color: #ffffff; }
html[data-theme="dark"] #intro-name .first { color: #ffffff; }
html[data-theme="dark"] #intro-name .last { background: #ffffff; color: #000000; }

@keyframes slideOutFromBox {
  0% { right: 0; }
  100% { right: 100%; }
}

.contact-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}
.contact-links a,
.contact-links span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: var(--global-text-color);
  font-weight: 500;
  font-size: 15px;
  padding: 6px 12px;
  border: 1px solid var(--global-border-color);
  border-radius: 4px;
  background: var(--global-bg-color);
  transition: all 0.2s ease-in-out;
}
.contact-links a:hover,
.contact-links span:hover {
  border-color: var(--global-text-color);
  color: var(--global-text-color);
}
.contact-links a i,
.contact-links span i {
  margin-right: 4px;
}
html[data-theme="dark"] .contact-links a,
html[data-theme="dark"] .contact-links span {
  color: #ffffff;
  border-color: #555555;
  background: #1a1a1a;
}
html[data-theme="dark"] .contact-links a:hover,
html[data-theme="dark"] .contact-links span:hover {
  border-color: #ffffff;
  color: #ffffff;
}
.blue-underline {
  color: #0066ff;
  text-decoration: none;
  border-bottom: 2px solid #0066ff;
  padding-bottom: 2px;
}
.blue-underline:hover {
  color: #0044cc;
  border-bottom-color: #0044cc;
}
</style>

<div id="intro-overlay">
  <div id="intro-name"><a href="/"><span class="first">Bhavesh</span> <span class="last">Adivi</span></a></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  var overlay = document.getElementById('intro-overlay');
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      overlay.style.transition = 'opacity 0.5s ease';
      overlay.style.opacity = '0';
      setTimeout(function() { overlay.style.display = 'none'; }, 500);
    }
  });
  setTimeout(function() {
    overlay.style.transition = 'opacity 0.5s ease';
    overlay.style.opacity = '0';
    setTimeout(function() { overlay.style.display = 'none'; }, 500);
  }, 2000);
});
</script>

<hr />

<h2>Reach Out</h2>
<p>I'm open to collaborate. You can contact me at the following links.</p>

<div class="contact-links">
  <span class="contact-email" aria-label="Email"><i class="fas fa-envelope" aria-hidden="true"></i> 2028badivi [@] tjhsst.edu</span>
  <a href="https://bhaveshadivi.github.io" aria-label="Website"><i class="fas fa-globe" aria-hidden="true"></i> Website</a>
  <a href="https://github.com/2028badivi" aria-label="GitHub"><i class="fab fa-github" aria-hidden="true"></i> GitHub</a>
  <a href="https://www.linkedin.com/in/bhavesh-adivi" aria-label="LinkedIn"><i class="fab fa-linkedin-in" aria-hidden="true"></i> LINKEDIN</a>
  <a href="https://orcid.org/0009-0005-8462-3559" aria-label="ORCID"><i class="ai ai-orcid" aria-hidden="true"></i> ORCID</a>
</div>
