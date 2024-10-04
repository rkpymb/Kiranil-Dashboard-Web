import React from 'react';
import PageContainer from '@/components/layout/page-container';

import AddSlider from '../Comp/AddSlider';

import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

export default function Page() {
  return (
    <div>
      <PageContainer scrollable={true}>
        <div className="flex-1 space-y-4 p-2 md:p-8">
          <div className="flex items-start justify-between">
            <Heading
              title={`Create Slider`}
              description="Add New App Home Slider"
            />
          </div>
          <Separator />

          <AddSlider />
        </div>
      </PageContainer>
    </div>
  );
}
