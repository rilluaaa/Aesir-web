import React from 'react';
import { CTASection, Footer } from './Common';
import { contentData } from '../constants';

export const FinalCTA = () => (
  <>
    <CTASection 
      headline={contentData.cta.headline}
      subtext={contentData.cta.subtext}
      buttonText={contentData.cta.button}
    />
    <Footer text={contentData.footer.text} />
  </>
);
