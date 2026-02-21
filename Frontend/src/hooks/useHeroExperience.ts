interface HeroExperienceModel {
  initReveal(cards: NodeListOf<Element>): void;
}

class HeroExperienceState implements HeroExperienceModel {
  initReveal(cards: NodeListOf<Element>): void {
    cards.forEach((card, index) => {
      const element = card as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'translateY(8px)';
      window.setTimeout(() => {
        element.style.transition = 'opacity 320ms ease, transform 320ms ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 70);
    });
  }
}

export function useHeroExperience(): HeroExperienceModel {
  return new HeroExperienceState();
}
