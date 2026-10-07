/**
 * C&A FINANZAS CORPORATIVAS - Dirección Financiera & CFO Externo para PyMEs
 * Interactive Scripts: Navigation, Simulator de Costos y Márgenes, FAQ, Contact & WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking any nav link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 2. Header shadow on scroll
  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (header && content) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all open FAQs
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.faq-content');
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherContent) otherContent.style.maxHeight = null;
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        });

        // Toggle clicked item
        if (!isActive) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 30 + 'px';
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    }
  });

  // 4. Simulator Tabs Switching
  const tabBtns = document.querySelectorAll('.simulator-tab-btn');
  const tabPanels = document.querySelectorAll('.simulator-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabPanels.forEach(panel => {
        if (panel.id === targetTab) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });

  // Utility Currency and Number Formatters
  function formatCurrency(val) {
    if (isNaN(val) || !isFinite(val)) return '$ 0';
    return '$ ' + Math.round(val).toLocaleString('es-AR');
  }

  function formatPercent(val) {
    if (isNaN(val) || !isFinite(val)) return '0.0%';
    return (val).toFixed(1) + '%';
  }

  function formatNumber(val) {
    if (isNaN(val) || !isFinite(val)) return '0';
    return Math.round(val).toLocaleString('es-AR');
  }

  // -------------------------------------------------------------
  // SIMULATOR 1: Punto de Equilibrio Económico & Margen de Seguridad
  // -------------------------------------------------------------
  const peVentasSlider = document.getElementById('peVentasSlider');
  const peVentasDisplay = document.getElementById('peVentasDisplay');
  const peMatDirectos = document.getElementById('peMatDirectos');
  const peComisionesVenta = document.getElementById('peComisionesVenta');
  const peComisionesCanal = document.getElementById('peComisionesCanal');
  const peImpuestos = document.getElementById('peImpuestos');
  const peCostosFijos = document.getElementById('peCostosFijos');

  const peBreakEvenEl = document.getElementById('peBreakEven');
  const peUtilidadEl = document.getElementById('peUtilidad');
  const peMargenSeguridadEl = document.getElementById('peMargenSeguridad');
  const peMargenSeguridadPctEl = document.getElementById('peMargenSeguridadPct');
  const peCMgPercentEl = document.getElementById('peCMgPercent');
  const peProgressBar = document.getElementById('peProgressBar');
  const peCtaBtn = document.getElementById('peCtaBtn');

  function calculatePuntoEquilibrio() {
    if (!peVentasSlider || !peBreakEvenEl) return;

    const ventas = parseFloat(peVentasSlider.value) || 0;
    peVentasDisplay.textContent = formatCurrency(ventas);

    const matPct = (parseFloat(peMatDirectos.value) || 0) / 100;
    const comVPct = (parseFloat(peComisionesVenta.value) || 0) / 100;
    const comCPct = (parseFloat(peComisionesCanal.value) || 0) / 100;
    const impPct = (parseFloat(peImpuestos.value) || 0) / 100;
    const costosFijos = parseFloat(peCostosFijos.value) || 0;

    const totalVarPct = matPct + comVPct + comCPct + impPct;
    const costosVariables = ventas * totalVarPct;
    const contribucionMarginal = ventas - costosVariables;
    const margenContribucionPct = ventas > 0 ? (contribucionMarginal / ventas) : 0;

    let breakEven = 0;
    if (margenContribucionPct > 0) {
      breakEven = costosFijos / margenContribucionPct;
    }

    const utilidadOperativa = contribucionMarginal - costosFijos;
    const margenSeguridad = ventas - breakEven;
    const margenSeguridadPct = ventas > 0 ? (margenSeguridad / ventas) * 100 : 0;

    // Update UI elements
    peBreakEvenEl.textContent = formatCurrency(breakEven);
    peUtilidadEl.textContent = formatCurrency(utilidadOperativa);
    peMargenSeguridadEl.textContent = formatCurrency(margenSeguridad);
    peMargenSeguridadPctEl.textContent = (margenSeguridadPct >= 0 ? '+' : '') + margenSeguridadPct.toFixed(1) + '% s/ventas';
    peCMgPercentEl.textContent = (margenContribucionPct * 100).toFixed(1) + '%';

    // Visual Progress Bar (% covered above break-even)
    if (peProgressBar) {
      let progressPct = 0;
      if (breakEven > 0) {
        progressPct = Math.min(Math.max((ventas / breakEven) * 50, 0), 100);
      }
      peProgressBar.style.width = progressPct + '%';
      if (utilidadOperativa >= 0) {
        peProgressBar.className = 'h-full bg-emerald-500 rounded-full transition-all duration-300';
        peUtilidadEl.className = 'font-heading font-extrabold text-2xl sm:text-3xl text-emerald-400';
      } else {
        peProgressBar.className = 'h-full bg-rose-500 rounded-full transition-all duration-300';
        peUtilidadEl.className = 'font-heading font-extrabold text-2xl sm:text-3xl text-rose-400';
      }
    }

    // Dynamic WhatsApp CTA
    if (peCtaBtn) {
      const msg = encodeURIComponent(
        `Hola Cristian, estuve en tu web utilizando el Simulador de Punto de Equilibrio. ` +
        `En mi empresa estimamos una facturación de ${formatCurrency(ventas)} y costos fijos de ${formatCurrency(costosFijos)}, con un Punto de Equilibrio de ${formatCurrency(breakEven)}. ` +
        `Me interesa coordinar un diagnóstico para auditar nuestra estructura de costos y márgenes.`
      );
      peCtaBtn.href = `https://wa.me/5491157720869?text=${msg}`;
    }
  }

  if (peVentasSlider) {
    peVentasSlider.addEventListener('input', calculatePuntoEquilibrio);
    peMatDirectos.addEventListener('input', calculatePuntoEquilibrio);
    peComisionesVenta.addEventListener('input', calculatePuntoEquilibrio);
    peComisionesCanal.addEventListener('input', calculatePuntoEquilibrio);
    peImpuestos.addEventListener('input', calculatePuntoEquilibrio);
    peCostosFijos.addEventListener('input', calculatePuntoEquilibrio);
    calculatePuntoEquilibrio();
  }

  // -------------------------------------------------------------
  // SIMULATOR 2: Impacto de Descuentos & Promociones Comerciales
  // -------------------------------------------------------------
  const descQty = document.getElementById('descQty');
  const descPrice = document.getElementById('descPrice');
  const descMatDirectos = document.getElementById('descMatDirectos');
  const descComercialPercent = document.getElementById('descComercialPercent');
  const descPercent = document.getElementById('descPercent');

  const descCaidaCMgEl = document.getElementById('descCaidaCMg');
  const descUnidadesExtraEl = document.getElementById('descUnidadesExtra');
  const descVolumenExtraPctEl = document.getElementById('descVolumenExtraPct');
  const descNuevasVentasEl = document.getElementById('descNuevasVentas');
  const descCtaBtn = document.getElementById('descCtaBtn');

  function calculateDescuentos() {
    if (!descQty || !descCaidaCMgEl) return;

    const qty = parseFloat(descQty.value) || 0;
    const price = parseFloat(descPrice.value) || 0;
    const matUnit = parseFloat(descMatDirectos.value) || 0;
    const comPct = (parseFloat(descComercialPercent.value) || 0) / 100;
    const discountPct = (parseFloat(descPercent.value) || 0) / 100;

    // Base Case
    const baseVentas = qty * price;
    const baseCostosVar = (qty * matUnit) + (baseVentas * comPct);
    const baseCMg = baseVentas - baseCostosVar;

    // Discounted Case with SAME quantity
    const discountedPrice = price * (1 - discountPct);
    const discountedVentasMismaQty = qty * discountedPrice;
    const discountedCostosVarMismaQty = (qty * matUnit) + (discountedVentasMismaQty * comPct);
    const discountedCMgMismaQty = discountedVentasMismaQty - discountedCostosVarMismaQty;
    const discountedMargenContribPct = discountedVentasMismaQty > 0 ? (discountedCMgMismaQty / discountedVentasMismaQty) : 0;

    // Variation in CMg
    const caidaCMg = discountedCMgMismaQty - baseCMg;
    const caidaCMgPct = baseCMg > 0 ? (caidaCMg / baseCMg) * 100 : 0;

    // Required extra sales & quantity to match base CMg
    let nuevasVentasExigidas = 0;
    let unidadesExtraExigidas = 0;
    let volumenExtraPct = 0;

    if (discountedMargenContribPct > 0 && discountedPrice > 0) {
      nuevasVentasExigidas = (-caidaCMg) / discountedMargenContribPct;
      unidadesExtraExigidas = nuevasVentasExigidas / discountedPrice;
      volumenExtraPct = qty > 0 ? (unidadesExtraExigidas / qty) * 100 : 0;
    }

    const nuevaFacturacionTotal = baseVentas + nuevasVentasExigidas;

    // Update UI
    descCaidaCMgEl.textContent = (caidaCMgPct).toFixed(1) + '%';
    descUnidadesExtraEl.textContent = '+' + formatNumber(unidadesExtraExigidas) + ' unidades';
    descVolumenExtraPctEl.textContent = '+' + volumenExtraPct.toFixed(1) + '% en volumen necesario';
    descNuevasVentasEl.textContent = formatCurrency(nuevaFacturacionTotal);

    // Dynamic WhatsApp CTA
    if (descCtaBtn) {
      const msg = encodeURIComponent(
        `Hola Cristian, estuve usando el Simulador de Descuentos en tu web. ` +
        `Al simular un descuento del ${(discountPct * 100).toFixed(0)}% en mis precios de lista, la ganancia marginal cae un ${Math.abs(caidaCMgPct).toFixed(1)}% exigiendo vender un +${volumenExtraPct.toFixed(1)}% más de unidades para compensar. ` +
        `Quisiera consultar para optimizar la política de precios y rentabilidad de mi empresa.`
      );
      descCtaBtn.href = `https://wa.me/5491157720869?text=${msg}`;
    }
  }

  if (descQty) {
    descQty.addEventListener('input', calculateDescuentos);
    descPrice.addEventListener('input', calculateDescuentos);
    descMatDirectos.addEventListener('input', calculateDescuentos);
    descComercialPercent.addEventListener('input', calculateDescuentos);
    descPercent.addEventListener('input', calculateDescuentos);
    calculateDescuentos();
  }

  // -------------------------------------------------------------
  // SIMULATOR 3: Punto de Equilibrio Financiero (Cash Flow Real)
  // -------------------------------------------------------------
  const peFinCostosFijos = document.getElementById('peFinCostosFijos');
  const peFinMargenContrib = document.getElementById('peFinMargenContrib');
  const peFinPrestamos = document.getElementById('peFinPrestamos');
  const peFinFondoSeguridad = document.getElementById('peFinFondoSeguridad');
  const peFinBienesUso = document.getElementById('peFinBienesUso');
  const peFinRetiroSocios = document.getElementById('peFinRetiroSocios');

  const peFinBreakEvenEl = document.getElementById('peFinBreakEven');
  const peEcoBreakEvenEl = document.getElementById('peEcoBreakEven');
  const peFinBrechaEl = document.getElementById('peFinBrecha');
  const peFinCtaBtn = document.getElementById('peFinCtaBtn');

  function calculatePuntoEquilibrioFinanciero() {
    if (!peFinCostosFijos || !peFinBreakEvenEl) return;

    const fijos = parseFloat(peFinCostosFijos.value) || 0;
    const mContribPct = (parseFloat(peFinMargenContrib.value) || 0) / 100;
    const prestamos = parseFloat(peFinPrestamos.value) || 0;
    const fondo = parseFloat(peFinFondoSeguridad.value) || 0;
    const bienesUso = parseFloat(peFinBienesUso.value) || 0;
    const retiros = parseFloat(peFinRetiroSocios.value) || 0;

    const totalErogaciones = fijos + prestamos + fondo + bienesUso + retiros;

    let peEconomico = 0;
    let peFinanciero = 0;

    if (mContribPct > 0) {
      peEconomico = fijos / mContribPct;
      peFinanciero = totalErogaciones / mContribPct;
    }

    const brecha = peFinanciero - peEconomico;

    peFinBreakEvenEl.textContent = formatCurrency(peFinanciero);
    peEcoBreakEvenEl.textContent = formatCurrency(peEconomico);
    peFinBrechaEl.textContent = '+' + formatCurrency(brecha) + ' a facturar para cubrir caja';

    if (peFinCtaBtn) {
      const msg = encodeURIComponent(
        `Hola Cristian, calculé el Punto de Equilibrio Financiero de mi empresa en tu web. ` +
        `Para cubrir costos fijos y erogaciones de caja (préstamos, retiros e inversiones) necesitamos facturar ${formatCurrency(peFinanciero)} al mes. ` +
        `Quisiera coordinar una reunión de diagnóstico para planificar nuestro Cash Flow.`
      );
      peFinCtaBtn.href = `https://wa.me/5491157720869?text=${msg}`;
    }
  }

  if (peFinCostosFijos) {
    peFinCostosFijos.addEventListener('input', calculatePuntoEquilibrioFinanciero);
    peFinMargenContrib.addEventListener('input', calculatePuntoEquilibrioFinanciero);
    peFinPrestamos.addEventListener('input', calculatePuntoEquilibrioFinanciero);
    peFinFondoSeguridad.addEventListener('input', calculatePuntoEquilibrioFinanciero);
    peFinBienesUso.addEventListener('input', calculatePuntoEquilibrioFinanciero);
    peFinRetiroSocios.addEventListener('input', calculatePuntoEquilibrioFinanciero);
    calculatePuntoEquilibrioFinanciero();
  }

  // -------------------------------------------------------------
  // 5. Contact Form Submission Handler (Supabase Serverless + WhatsApp)
  // -------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const company = document.getElementById('formCompany').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const topic = document.getElementById('formTopic').value;
      const message = document.getElementById('formMessage').value.trim();

      const waMessage = encodeURIComponent(
        `*Nueva Consulta desde la Web*\n\n` +
        `👤 *Nombre:* ${name}\n` +
        `🏢 *Empresa / Rubro:* ${company}\n` +
        `📱 *Teléfono:* ${phone}\n` +
        `✉️ *Email:* ${email}\n` +
        `🎯 *Motivo de consulta:* ${topic}\n` +
        `💬 *Detalle:* ${message || 'Deseo coordinar una llamada de diagnóstico.'}`
      );

      // Save simulator context if available
      let simulationData = null;
      if (peVentasSlider && peBreakEvenEl) {
        simulationData = {
          ventas_mensuales: peVentasSlider.value,
          punto_equilibrio_estimado: peBreakEvenEl.textContent.trim(),
          utilidad_operativa_estimada: peUtilidadEl ? peUtilidadEl.textContent.trim() : null
        };
      }

      // 1. Asynchronously post to Vercel Serverless Function -> Supabase
      const payload = { name, company, phone, email, topic, message, simulationData };
      try {
        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(err => {
          console.warn('Registro en base de datos no disponible localmente (se guardará en Vercel):', err);
        });
      } catch (err) {
        // Silent error to guarantee WhatsApp always opens
      }

      // 2. Open WhatsApp directly
      const waUrl = `https://wa.me/5491157720869?text=${waMessage}`;
      window.open(waUrl, '_blank');

      // 3. Reset form and show success confirmation
      contactForm.reset();
      if (formSuccess) {
        formSuccess.classList.remove('hidden');
        setTimeout(() => {
          formSuccess.classList.add('hidden');
        }, 8000);
      }
    });
  }
});
