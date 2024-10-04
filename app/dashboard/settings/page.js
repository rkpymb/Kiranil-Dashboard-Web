'use client';

import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  Suspense
} from 'react';

import AboutusEdit from './Comp/AboutusEdit';
import TermsConditions from './Comp/TermsConditions';
import Contact from './Comp/Contact';
import PrivacyPolicy from './Comp/PrivacyPolicy';
import PageContainer from '@/components/layout/page-container';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import CheckloginContext from '@/app/context/auth/CheckloginContext';

export default function Home() {
  const Contextdata = useContext(CheckloginContext);
  const [SData, setSData] = useState(null);
  const [SettingID, setSettingID] = useState('04yykG2JZ');

  const getServiceData = async ({ SettingID }) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/app-setting-data`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Contextdata.JwtToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ SettingID: SettingID })
      }
    );
    const data = await res.json();
    if (data.operation == true) {
      setSData(data.SData);
    }
  };

  useEffect(() => {
    if (Contextdata.JwtToken) {
      getServiceData({ SettingID });
    }
  }, [Contextdata.JwtToken]);

  return (
    <PageContainer scrollable={true}>
      <div className="flex w-full flex-col items-center gap-2">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>About us</AccordionTrigger>
            <AccordionContent>
              <AboutusEdit SData={SData} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Terms & Conditions</AccordionTrigger>
            <AccordionContent>
              <TermsConditions SData={SData} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Privacy Policy</AccordionTrigger>
            <AccordionContent>
              <PrivacyPolicy SData={SData} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Contact</AccordionTrigger>
            <AccordionContent>
              <Contact SData={SData} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </PageContainer>
  );
}
