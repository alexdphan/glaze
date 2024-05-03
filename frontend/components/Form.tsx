'use client';
import { useEffect, useState } from 'react';
import 'animate.css';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// Define Zod schemas for form inputs
// Ensures the name is at least 2 characters long, making it required
const nameSchema = z.string().min(2, 'Name is required');

// Ensures the description is at least 1 character long, making it required
const descriptionSchema = z.string().min(5, 'Description is required');

// Optional field, can be empty
const specificSchema = z
  .string()
  .optional()
  .refine(
    (data) =>
      nameSchema.safeParse(data).success &&
      descriptionSchema.safeParse(data).success,
    {
      message: 'Please ensure the name and description are correctly filled.',
    }
  );

export default function Form() {
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState(1); // State to track the current step

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting, isSubmitted },
  } = useForm({
    resolver: zodResolver(
      z.object({
        name: nameSchema,
        description: descriptionSchema,
        specific: specificSchema,
      })
    ),
  });

  useEffect(() => {
    setLoaded(true);
  }, []);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const generate = (data: any) => {
    console.log(data); // Handle form submission data
    setStep(4);
  };

  const PaginationDots = () => {
    return (
      <div className="flex flex-col items-center">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className={`h-5 w-2 rounded-full mb-2 ${
              step === item
                ? 'bg-black animate__animated animate__fadeIn h-8'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex">
      <div
        className={`form-container ${
          loaded ? 'animate' : ''
        } sm:w-[500px] sm:h-[250px] w-[350px] h-[200px] flex rounded-lg`}
      >
        <form
          onSubmit={handleSubmit(generate)}
          className="form-content text-sm w-full flex items-center justify-between"
        >
          <div className="flex grid-cols-2 place-items-center">
            <div className="flex flex-col">
              {step === 1 && (
                <div className="animate__animated animate__fadeIn">
                  <div className="text-sm font-semibold">Enter the name</div>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-[250px] sm:w-[350px] px-4 py-2 text-black rounded-lg shadow-sm mt-2"
                    {...register('name')}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.name.message as string}
                    </p>
                  )}
                </div>
              )}
              {step === 2 && (
                <div className="animate__animated animate__fadeIn">
                  <div className="text-sm font-semibold">
                    Describe your friend
                  </div>
                  <input
                    type="text"
                    placeholder="Not showering, staying up late"
                    className="w-[250px] sm:w-[350px] px-4 py-2 text-black rounded-lg shadow-sm mt-2"
                    {...register('description')}
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.description.message as string}
                    </p>
                  )}
                </div>
              )}
              {step === 3 && (
                <div className="animate__animated animate__fadeIn">
                  <div className="text-sm font-semibold">
                    Any specifics to mention?
                  </div>
                  <input
                    type="text"
                    placeholder="He's always late to class"
                    className="w-[250px] sm:w-[350px] px-4 py-2 text-black rounded-lg shadow-sm mt-2"
                    {...register('specific')}
                  />
                  {formErrors.specific && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.specific.message as string}
                    </p>
                  )}
                </div>
              )}
              {step === 4 && (
                <div className="animate__animated animate__fadeIn">
                  <div className="text-sm font-semibold mt-2">
                    Generating...
                  </div>
                  <div className="w-[250px] sm:w-[350px] py-2 text-black rounded-lg mt-2">
                    Please wait
                  </div>
                  <button
                    onClick={prevStep}
                    className="px-4 py-2 text-white bg-gray-500 rounded-lg shadow-sm mt-3"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <div className="flex flex-row justify-end mt-3">
                {step > 1 && step < 4 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 text-white bg-gray-500 rounded-lg shadow-sm mr-2"
                  >
                    Previous
                  </button>
                )}
                {step < 3 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 text-white bg-black rounded-lg shadow-sm justify-end"
                  >
                    Next
                  </button>
                )}
                {step === 3 && (
                  <button
                    type="submit"
                    className="px-2 text-white bg-orange-500 rounded-lg shadow-sm"
                    disabled={isSubmitting}
                  >
                    <div className="flex flex-row items-center">
                      <span>Generate 🎉</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
            <span className="ml-8 flex flex-col items-center justify-center h-full">
              <PaginationDots />
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
