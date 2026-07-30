import { useEffect } from 'react';

export const ScrollEffects = () => {
  useEffect(() => {
    const root = document.documentElement;
    const parallaxItems = Array.from(document.querySelectorAll('[data-parallax]'));

    const updateScroll = () => {
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const progress = window.scrollY / maxScroll;
      root.style.setProperty('--scroll-progress', progress.toFixed(4));

      parallaxItems.forEach((item) => {
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

    document.querySelectorAll('[data-reveal]').forEach((item, index) => {
      item.style.setProperty('--reveal-delay', `${Math.min(index % 8, 7) * 70}ms`);
      revealObserver.observe(item);
    });

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);

    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      revealObserver.disconnect();
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true" />
  );
};

export default ScrollEffects;
