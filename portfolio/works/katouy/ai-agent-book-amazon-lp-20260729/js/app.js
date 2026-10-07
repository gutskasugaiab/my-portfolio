(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("has-js");

  const launchIntro = document.querySelector("[data-launch-intro]");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (launchIntro) {
    const hideLaunchIntro = () => launchIntro.classList.add("is-hidden");

    if (prefersReducedMotion.matches) {
      hideLaunchIntro();
    } else {
      window.setTimeout(hideLaunchIntro, 2400);
    }
  }

  const bookReveal = document.querySelector("[data-book-reveal]");
  const hero = document.querySelector(".hero");

  if (bookReveal && hero && !prefersReducedMotion.matches) {
    let bookRevealTicking = false;

    const updateBookReveal = () => {
      const start = Math.max(hero.offsetTop - 24, 0);
      const range = Math.min(Math.max(window.innerHeight * 0.42, 180), 300);
      const progress = Math.min(Math.max((window.scrollY - start) / range, 0), 1);

      bookReveal.style.setProperty(
        "--book-reveal-x",
        `${Math.round(-118 + progress * 118)}%`
      );
      bookReveal.style.setProperty(
        "--book-reveal-y",
        `${Math.round((1 - progress) * 20)}px`
      );
      bookReveal.style.setProperty(
        "--book-reveal-rotate",
        `${Math.round(-16 + progress * 16)}deg`
      );
      bookReveal.style.setProperty("--book-reveal-opacity", progress.toFixed(3));
      bookRevealTicking = false;
    };

    const queueBookReveal = () => {
      if (bookRevealTicking) return;
      bookRevealTicking = true;
      window.requestAnimationFrame(updateBookReveal);
    };

    updateBookReveal();
    window.addEventListener("scroll", queueBookReveal, { passive: true });
    window.addEventListener("resize", queueBookReveal);
  }

  const sehRunway = document.querySelector("[data-seh-runway]");
  const sehHero = document.querySelector("[data-seh-hero]");
  const sehPin = document.querySelector("[data-seh-pin]");

  if (sehRunway && sehHero && !prefersReducedMotion.matches) {
    let sehTicking = false;

    const updateScrollExpandHero = () => {
      const expandDistance = window.innerHeight * 1.2;
      const scrolled = Math.max(-sehRunway.getBoundingClientRect().top, 0);
      const val = expandDistance > 0 ? Math.min(scrolled / expandDistance, 1) : 0;
      sehHero.style.setProperty("--val", val.toFixed(4));

      const closeDistance = window.innerHeight * 0.5;
      const closeProgress = sehPin && closeDistance > 0
        ? Math.min(Math.max(-sehPin.getBoundingClientRect().top / closeDistance, 0), 1)
        : 0;
      sehHero.style.setProperty("--close", closeProgress.toFixed(4));

      sehTicking = false;
    };

    const queueScrollExpandHero = () => {
      if (sehTicking) return;
      sehTicking = true;
      window.requestAnimationFrame(updateScrollExpandHero);
    };

    updateScrollExpandHero();
    window.addEventListener("scroll", queueScrollExpandHero, { passive: true });
    window.addEventListener("resize", queueScrollExpandHero);

    const sehLines = document.querySelectorAll(".scroll-expand-line");
    if ("IntersectionObserver" in window && sehLines.length) {
      const sehLineObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            sehLineObserver.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -15% 0px", threshold: 0.01 }
      );
      sehLines.forEach((line) => sehLineObserver.observe(line));
    } else {
      sehLines.forEach((line) => line.classList.add("is-in"));
    }
  }

  const modal = document.getElementById("link-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalCopy = document.getElementById("modal-copy");
  const toast = document.getElementById("toast");
  let toastTimer;

  const modalMessages = {
    amazon: {
      title: "Amazon商品ページの<br />URLが未設定です",
      copy: "実販売用に公開する前に、実在のAmazon商品ページURLと、書籍情報・キャンペーン条件を設定してください。",
    },
    campaign: {
      title: "発売記念企画の<br />URLが未設定です",
      copy: "確認シートの配布先、受取条件、個人情報の取扱、問い合わせ先を確定してから、実際のリンク先を設定してください。",
    },
  };

  function showToast(message) {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2500);
  }

  function openModal(kind) {
    if (!modal) return;
    const message = modalMessages[kind] || modalMessages.amazon;
    modalTitle.innerHTML = message.title;
    modalCopy.textContent = message.copy;

    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");
    }
  }

  function closeModal() {
    if (!modal) return;
    if (typeof modal.close === "function") {
      modal.close();
    } else {
      modal.removeAttribute("open");
    }
  }

  document.querySelectorAll("[data-modal-open]").forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.modalOpen));
  });

  document.querySelectorAll("[data-modal-close]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
  }

  async function copyPageLink() {
    const url = window.location.href;
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = url;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  }

  const shareButton = document.querySelector("[data-share]");
  if (shareButton) {
    shareButton.addEventListener("click", async () => {
      const shareData = {
        title: "全て丸投げAIエージェント！｜出版サンプル",
        text: "AIエージェントとChatGPTの違いを考える書籍LPサンプル",
        url: window.location.href,
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
          showToast("共有メニューを開きました");
          return;
        }

        await copyPageLink();
        showToast("ページのリンクをコピーしました");
      } catch (error) {
        if (error && error.name === "AbortError") return;
        try {
          await copyPageLink();
          showToast("ページのリンクをコピーしました");
        } catch (_) {
          showToast("共有できませんでした。URLをコピーしてください。");
        }
      }
    });
  }

  const revealTargets = document.querySelectorAll(
    ".role-card, .editorial-photo, .campaign-photo, .recommendation-card, .chapter-list li"
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.14 }
    );

    revealTargets.forEach((target) => revealObserver.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
  }
})();
