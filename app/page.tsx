'use client'
import Image from 'next/image'
import { HeaderTabs } from '@/components/HeaderTabs';
import { HeroText } from '@/components/HeroText';
import { FooterLinks } from '@/components/FooterLinks';
import { ArticlesCardsGrid } from '@/components/ArticlesCardsGrid';
import FormComponent from '../components/FormComponent';

export default function Home() {
  return (
    <main>
      <HeaderTabs />
      <FormComponent />
      <FooterLinks />
    </main>
  )
}
