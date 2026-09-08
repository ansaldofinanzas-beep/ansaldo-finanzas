/**
 * Cristian Ansaldo - CFO Externo & Finanzas Corporativas
 * Interactive Scripts: Navigation, Simulator, FAQ, Contact & WhatsApp
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
  });

  // 4. Interactive Financing Savings Simulator
  const amountSlider = document.getElementById('amountSlider');
  const amountDisplay = document.getElementById('amountDisplay');
  const termSelect = document.getElementById('termSelect');
  const bankRateInput = document.getElementById('bankRateInput');
  const mktRateInput = document.getElementById('mktRateInput');

  const monthlySavingsEl = document.getElementById('monthlySavings');
  const annualSavingsEl = document.getElementById('annualSavings');
  const percentSavingsEl = document.getElementById('percentSavings');
  const simulatorCtaBtn = document.getElementById('simulatorCtaBtn');

  function formatCurrency(val) {
    return '$ ' + Math.round(val).toLocaleString('es-AR');
  }

  function calculateSavings() {
    if (!amountSlider || !monthlySavingsEl) return;

    const principal = parseFloat(amountSlider.value);
    const days = parseInt(termSelect.value, 10);
    const bankTNA = parseFloat(bankRateInput.value) / 100;
    const mktTNA = parseFloat(mktRateInput.value) / 100;

    // Actual interest calculation for the period
    const bankCost = principal * (bankTNA * (days / 365));
    const mktCost = principal * (mktTNA * (days / 365));

    // Estimated monthly saving (normalizing by 30 days)
    const factorToMonth = 30 / days;
    const monthlySaving = (bankCost - mktCost) * factorToMonth;
    const annualSaving = monthlySaving * 12;
    const percentDiff = ((bankTNA - mktTNA) / bankTNA) * 100;

    // Update displays
    amountDisplay.textContent = formatCurrency(principal);
    monthlySavingsEl.textContent = formatCurrency(monthlySaving);
    annualSavingsEl.textContent = formatCurrency(annualSaving);
    percentSavingsEl.textContent = `${Math.round(percentDiff)}% menor CFT`;

    // Dynamic WhatsApp CTA with current calculation
    if (simulatorCtaBtn) {
      const msg = encodeURIComponent(
        `Hola Cristian, estuve en tu web utilizando el Simulador de Financiamiento. ` +
        `En mi empresa descontamos aprox. ${formatCurrency(principal)} y me interesa estructurar el ahorro de ${formatCurrency(annualSaving)} anuales con herramientas bursátiles (eCheqs/SGR). ¿Podemos coordinar un diagnóstico?`
      );
      simulatorCtaBtn.href = `https://wa.me/5491157720869?text=${msg}`;
    }
  }

  if (amountSlider) {
    amountSlider.addEventListener('input', calculateSavings);
    termSelect.addEventListener('change', calculateSavings);
    bankRateInput.addEventListener('input', calculateSavings);
    mktRateInput.addEventListener('input', calculateSavings);
    // Initial run
    calculateSavings();
  }

  // 5. Contact Form Handling
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

      // Datos de simulación si estuvo explorando el calculador
      let simulationData = null;
      if (amountSlider && monthlySavingsEl) {
        simulationData = {
          monto_mensual: parseFloat(amountSlider.value),
          plazo_dias: parseInt(termSelect.value, 10),
          ahorro_mensual: monthlySavingsEl.textContent.trim(),
          ahorro_anual: annualSavingsEl.textContent.trim(),
          porcentaje_menor_cft: percentSavingsEl.textContent.trim()
        };
      }

      // 1. Guardar de forma asíncrona en Supabase a través de Vercel Serverless
      const payload = { name, company, phone, email, topic, message, simulationData };
      try {
        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(err => {
          console.warn('Registro en base de datos no disponible localmente (se guardará al desplegar en Vercel):', err);
        });
      } catch (err) {
        // Silencioso para garantizar que WhatsApp abra siempre
      }

      // 2. Abrir WhatsApp directamente con el mensaje armado
      const waUrl = `https://wa.me/5491157720869?text=${waMessage}`;
      window.open(waUrl, '_blank');

      // 3. Notificación de éxito y reseteo de formulario
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
