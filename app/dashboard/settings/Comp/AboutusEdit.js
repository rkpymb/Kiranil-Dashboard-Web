'use client';

import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  Suspense
} from 'react';

import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import CheckloginContext from '@/app/context/auth/CheckloginContext';
import { Button } from '@/components/ui/button';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
const ReactQuill =
  typeof window === 'object' ? require('react-quill') : () => false;
import 'react-quill/dist/quill.snow.css';

const AboutusEdit = ({ SData }) => {
  const Contextdata = useContext(CheckloginContext);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState('');
  const [EditorContent, setEditorContent] = useState('');

  useEffect(() => {
    if (SData && SData.SettingData.About) {
      setValue(SData.SettingData.About);
    }
  }, [SData]);

  const handleEditorChange = (content) => {
    console.log(content);
    setEditorContent(content);
    setValue(content);
  };
  const onSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        SettingKey: 'About',
        SettingID: SData.SettingID,
        UpdateData: value
      };

      const token = Contextdata.JwtToken;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/update-app-setting`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(response.data);
      if (response.data.operation === true) {
        router.refresh();
        // router.push(`/dashboard/app-sliders`);
        toast({
          variant: 'success',
          title: 'Success !',
          description: 'Data Updated Sucessfully.'
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Unable to Update Data!`
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
    }
  };

  const defaultValues = {
    screenUrl: null,
    Order: null,
    imageUrl: null,
    isActive: false
  };

  const form = useForm({ defaultValues });

  return (
    <div className="p-5">
      <ReactQuill
        theme="snow"
        value={value}
        placeholder="write your post here ..."
        onChange={handleEditorChange}
      />
      <div className="mt-5">
        <Button
          disabled={loading}
          className="w-full md:w-auto"
          onClick={onSubmit}
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default AboutusEdit;
