'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import useMeasure from 'react-use-measure';
import '../app/globals.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AudioPlayer from './AudioPlayer';
import ExpandText from './ExpandText';
import CopyText from './CopyText';

const variants = {
  initial: (direction: number) => ({
    x: `${110 * direction}%`,
    opacity: 0,
  }),
  active: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: `${-110 * direction}%`,
    opacity: 0,
  }),
};

export default function MultiStepComponent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [ref, bounds] = useMeasure();
  const [glaze, setGlaze] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [audioSrc, setAudioSrc] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [direction, setDirection] = useState(1); // Set initial value to 1 or -1 as appropriate

  const nameSchema = z
    .string()
    .nonempty('Name is required')
    .min(2, 'Name must be at least 2 characters');
  const descriptionSchema = z
    .string()
    .nonempty('Description is required')
    .min(5, 'Description must be at least 5 characters');

  // useForm setup with Zod resolver
  const {
    register,
    getValues,
    trigger,
    formState: { errors },
    reset, // Destructure the reset method here
  } = useForm({
    resolver: zodResolver(
      z.object({
        name: nameSchema,
        description: descriptionSchema,
      })
    ),
  });

  async function generateGlazing(name: string, description: string) {
    try {
      // Request to generate text based on name and description
      // const response = await fetch('http://127.0.0.1:8080/generate', {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + '/generate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: name, description: description }),
        }
      );

      const data = await response.json();
      console.log(data);
      setGlaze(data.response);

      // If there's a response, request the audio URL
      if (data.response) {
        const audioResponse = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/text-to-speech',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, text: data.response }),
          }
        );

        if (audioResponse.ok) {
          const audioData = await audioResponse.json();
          setAudioSrc(audioData.audio_url);
          console.log('Audio URL:', audioData.audio_url);
        } else {
          console.error('Failed to fetch audio URL');
          setGlaze('Failed to fetch audio URL');
        }
      }
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        const errorData = await error.response.json();
        console.error('Rate limit exceeded:', errorData.detail);
        setGlaze('Rate limit exceeded. Please try again later.');
      } else {
        console.error('Error calling API:', error);
        setGlaze('Error calling API: ' + error.message);
      }
    }
  }

  const content = useMemo(() => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <h2 className="heading text-foreground">
              Enter the name of the person you are glazing
            </h2>
            <p className="text-foreground">
              Begin by writing the name of the person you are glazing.
            </p>

            <div>
              <input
                type="text"
                placeholder="John Doe"
                className="input border border-border p-2 my-6 text-foreground"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message as string}</p>
              )}
            </div>
          </>
        );
      case 1:
        return (
          <>
            <h2 className="heading text-foreground ">Describe the person</h2>
            <p className="text-foreground">
              Explain some hobbies or interests the person has for some
              incredible compliments, or just roast him for a laugh.
            </p>
            <textarea
              placeholder="Waterloo student who doesn't shower and stays in his room all day."
              className="textarea p-2 my-6 border border-border text-foreground"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-red-500">
                {errors.description.message as string}
              </p>
            )}
          </>
        );
      case 2:
        return (
          <>
            <div className="sm:p-3 rounded-lg w-full flex justify-center items-center">
              <div style={{ minWidth: '220px' }}>
                {' '}
                {/* Set a minimum width or a fixed width */}
                <div className="audio-player">
                  <div className="progress-bar">
                    <div className="progress"></div>
                  </div>
                  <AudioPlayer src={audioSrc} size={24} />
                </div>
                {glaze ? (
                  <div className="flex flex-row space-x-3 justify-center mt-3">
                    <button
                      className="button"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      <ExpandText size={18} />
                    </button>

                    <div>
                      <CopyText size={18} text={glaze} />
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex flex-row space-x-3 justify-center mt-3"
                    style={{ visibility: 'hidden' }}
                  >
                    <button className="button">
                      <ExpandText size={18} />
                    </button>
                    <div>
                      <CopyText size={18} text="Placeholder" />
                    </div>
                  </div>
                )}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-response"
                    >
                      <p className="text-foreground mt-6">{glaze}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* {!glaze ? (
              <div className="flex flex-row justify-between">
                <div>
                  <h2 className="heading text-foreground">Generating...</h2>
                  <p className="text-foreground">
                    Please wait while we generate the glazing.
                  </p>
                </div>
                <div className="m-4 sm:mr-12">
                  <Spinner color="orange" size={40} />
                </div>
              </div>
            ) : null} */}
          </>
        );
    }
  }, [
    currentStep,
    glaze,
    errors.name,
    errors.description,
    isExpanded,
    audioSrc,
    currentTime,
    duration,
  ]); // Track specific error fields

  return (
    <MotionConfig transition={{ duration: 0.5, type: 'spring', bounce: 0 }}>
      <motion.div
        animate={{ height: bounds.height }}
        className="multi-step-wrapper sm:w-[550px]"
      >
        <div ref={ref}>
          <div className="header flex flex-col h-8 w-full">
            <button
              className="my-2 mx-3"
              onClick={() => {
                setCurrentStep(0); // Reset the step
                // Reset form fields and clear errors
                reset({
                  name: '',
                  description: '',
                });
                // Reset other state variables
                setGlaze('');
                setAudioSrc('');
                setCurrentTime(0);
                setDuration(0);
                setIsExpanded(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor" // Use currentColor to control color via CSS (header-icon)
                className="w-[18px] h-[18px] header-icon" // Changed from w-4 h-4 to w-6 h-6
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>
          <div className="multi-step-inner sm:p-6 p-6">
            <AnimatePresence
              mode="popLayout"
              initial={false}
              custom={{ direction }}
            >
              <motion.div
                key={currentStep}
                variants={variants}
                initial="initial"
                animate="active"
                exit="exit"
                custom={direction}
              >
                {/* {direction} */}
                {content}
              </motion.div>
            </AnimatePresence>
            <motion.div layout className="actions">
              <button
                className="secondary-button text-foreground"
                disabled={currentStep === 0}
                onClick={() => {
                  if (currentStep === 0) {
                    return;
                  }
                  setDirection(-1);
                  setCurrentStep((prev) => prev - 1);
                }}
              >
                Back
              </button>
              {/* {direction} */}
              {currentStep !== 2 && (
                <button
                  className="primary-button"
                  onClick={async () => {
                    // Determine which field to validate based on the current step
                    const fieldToValidate =
                      currentStep === 0 ? 'name' : 'description';

                    // Trigger validation for the specific field
                    const isValid = await trigger(fieldToValidate);

                    if (!isValid) {
                      console.log('Form validation failed');
                      return;
                    }

                    // If the validation passes and it's the last input step, process the form data
                    if (currentStep === 1) {
                      const formData = getValues();
                      generateGlazing(formData.name, formData.description);
                      setDirection(1);
                      setCurrentStep(2); // Move to the final step to show the result
                      return;
                    }

                    // Otherwise, just move to the next step
                    setDirection(1);
                    setCurrentStep((prev) => prev + 1);
                  }}
                >
                  {currentStep === 1 ? 'Generate 🎉' : 'Next'}
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </MotionConfig>
  );
}
