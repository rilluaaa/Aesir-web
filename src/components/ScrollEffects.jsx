import { useEffect } from 'react';

export const ScrollEffects = ({ routeKey }) => {
  useEffect(() => {
    const root = document.documentElement;

    const updateScroll = () => {
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const progress = window.scrollY / maxScroll;
      root.style.setProperty('--scroll-progress', progress.toFixed(4));

      document.querySelectorAll('[data-parallax]').forEach((item) => {
        const speed = Number(item.dataset.parallax || 0.08);
        const rect = item.getBoundingClientRect();
        const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
        item.style.transform = `translate3d(0, ${centerOffset * speed * -0.12}px, 0)`;
      });
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 }
    );

    const observeRevealItems = () => {
      document.querySelectorAll('[data-reveal]').forEach((item, index) => {
        if (item.dataset.revealObserved === routeKey) return;

        item.dataset.revealObserved = routeKey;
        item.style.setProperty('--reveal-delay', `${Math.min(index % 8, 7) * 70}ms`);
        revealObserver.observe(item);
      });
    };

    const revealVisibleItems = () => {
      document.querySelectorAll('[data-reveal]').forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.92 && rect.bottom >= 0) {
          item.classList.add('is-visible');
        }
      });
    };

    const mutationObserver = new MutationObserver(() => {
      observeRevealItems();
      revealVisibleItems();
      updateScroll();
    });

    observeRevealItems();
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    updateScroll();
    const animationFrame = window.requestAnimationFrame(revealVisibleItems);
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('scroll', revealVisibleItems, { passive: true });
    window.addEventListener('resize', updateScroll);
    window.addEventListener('resize', revealVisibleItems);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('scroll', revealVisibleItems);
      window.removeEventListener('resize', updateScroll);
      window.removeEventListener('resize', revealVisibleItems);
      mutationObserver.disconnect();
      revealObserver.disconnect();
    };
  }, [routeKey]);

  return (
    <div className="scroll-progress" aria-hidden="true" />
  );
};

export default ScrollEffects;
