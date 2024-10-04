'use client';
import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { LuDownload } from 'react-icons/lu';
import CheckloginContext from '@/app/context/auth/CheckloginContext';
import { Button } from '@/components/ui/button';

const PwaInstallModal = () => {
  const Contextdata = useContext(CheckloginContext);
  const [BtnLoading, setBtnLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [manifestURL, setManifestURL] = useState(null);

  const blurredImageData =
    'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88enTfwAJYwPNteQx0wAAAABJRU5ErkJggg==';

  useEffect(() => {
    if (Contextdata.UserData) {
      setManifestURL(
        `${process.env.NEXT_PUBLIC_API_URL}/open/manifest_admin.json`
      );
    }
  }, [Contextdata.UserData]);

  const checkAppInstalled = () => {
    const isInstalled =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone;
    setIsAppInstalled(isInstalled);
    console.log(isInstalled);
  };

  const listenForInstallPrompt = (event) => {
    event.preventDefault();
    setDeferredPrompt(event);
    setShowModal(true);
  };

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', listenForInstallPrompt);
    checkAppInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', listenForInstallPrompt);
    };
  }, [manifestURL]);

  const installApp = () => {
    console.log('Installing');
    checkAppInstalled();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          setBtnLoading(true);
        }
        setTimeout(() => {
          setBtnLoading(false);
        }, 1000);
        setShowModal(false);
      });
    }
  };

  return (
    <div>
      <div className="mt-2 flex w-full flex-col justify-between rounded border p-5 md:flex-row">
        <div className="flex flex-row gap-2">
          <div>
            <Image
              src={`/pwa.webp`}
              alt="image"
              placeholder="blur"
              width={50}
              height={50}
              quality={80}
              blurDataURL={blurredImageData}
              objectFit="cover"
            />
          </div>
          <div>
            <div>
              <span className="text-sm font-semibold">
                Install Dashboard App
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold">
                Try Progressive web App for Better Experience 🚀
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center md:mt-0 md:block">
          <Button
            size="sm"
            onClick={installApp}
            className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white"
            disabled={BtnLoading}
          >
            {BtnLoading ? (
              <span>Installing...</span>
            ) : (
              <>
                <LuDownload className="mr-2" /> <span>Install App</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PwaInstallModal;
