'use client';
import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';

import { useDropzone } from 'react-dropzone';
import CheckloginContext from '@/app/context/auth/CheckloginContext';
import ImageComp from '@/app/Comp/ImageComp';

import { Progress } from '@/components/ui/progress';

const UploadFiles = ({ onImageUpload, Title }) => {
  const Contextdata = useContext(CheckloginContext);

  const [ErorrUploading, setErorrUploading] = useState(false);
  const [ErorrUploadingMsg, setErorrUploadingMsg] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [progress, setProgress] = React.useState(0);
  const progressRef = React.useRef(() => {});
  React.useEffect(() => {
    progressRef.current = () => {
      if (progress > 100) {
        setProgress(0);
      } else {
        const diff = Math.random() * 10;
        setProgress(progress + diff);
      }
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const onDrop = async (acceptedFiles) => {
    let fileFormat = acceptedFiles[0].type;

    if (fileFormat.startsWith('image/')) {
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/image-upload`;
        const response = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            folderName: 'feedpost',
            Authorization: `Bearer ${Contextdata.UserJwtToken}`
          },
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setUploadProgress(progress);
          }
        });

        if (response.data.fileName) {
          const Filedata = {
            postData: response.data,
            postType: fileFormat
          };
          onImageUpload(Filedata);
          console.log([Filedata]);
          setUploadedFiles([Filedata]);
        } else {
          setErorrUploading(true);
          setErorrUploadingMsg('Something went wrong');
        }
      } catch (error) {
        console.error('File upload error:', error);
      }
    } else {
      alert('Selected file is of an unsupported format.');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="">
      <div
        {...getRootProps()}
        className="rounded border-2 border-dashed border-gray-300 p-1 text-center hover:cursor-pointer"
      >
        <input {...getInputProps()} />
        <div>{uploadedFiles.length > 0 ? '✅ Image Added' : Title}</div>
      </div>
      {uploadProgress > 0 && (
        <div className="mt-4">
          <Progress value={uploadProgress} className="mb-2" />
          <div className="text-center">{uploadProgress.toFixed(2)}%</div>
        </div>
      )}
      {ErorrUploading && (
        <div className="mt-4 text-red-500">{ErorrUploadingMsg}</div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <ImageComp
            imgClass={'UploadedImg'}
            imgSrc={`${process.env.NEXT_PUBLIC_API_URL}/images/${uploadedFiles[0].postData.fileName}`}
            imgAlt={'img'}
            layout={'responsive'}
            width={100}
            height={100}
          />
        </div>
      )}
    </div>
  );
};

export default UploadFiles;
