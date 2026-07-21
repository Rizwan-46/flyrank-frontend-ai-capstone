import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define strict validation schema using Zod
const settingsSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Full name must be at least 3 characters')
    .max(50, 'Full name cannot exceed 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  bio: z
    .string()
    .max(160, 'Bio cannot exceed 160 characters')
    .optional()
    .default(''),
  notifications: z.boolean().default(false),
});

export default function SettingsForm() {
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      fullName: '',
      email: '',
      bio: '',
      notifications: false,
    },
  });

  // Watch the bio field dynamically for the character counter
  const bioValue = watch('bio', '');

  const onSubmit = async (data) => {
    // Simulate an async network request
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    console.log('Validated Form Data Submitted:', data);
    
    // Show success banner
    setShowSuccess(true);
    
    // Reset form dirty state with the newly saved values
    reset(data);

    // Hide banner after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-8 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Update your personal details and public profile information.
        </p>
      </div>

      {showSuccess && (
        <div
          role="status"
          className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-lg text-sm font-medium flex items-center justify-between"
        >
          <span>Your settings have been updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Full Name Field */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="e.g. Jane Doe"
            aria-invalid={errors.fullName ? 'true' : 'false'}
            {...register('fullName')}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.fullName && (
            <p role="alert" className="text-red-500 text-sm mt-1.5 font-medium">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="jane@example.com"
            aria-invalid={errors.email ? 'true' : 'false'}
            {...register('email')}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.email && (
            <p role="alert" className="text-red-500 text-sm mt-1.5 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Bio Field with Live Counter */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="bio" className="block text-sm font-semibold">
              Short Bio
            </label>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {bioValue.length}/160
            </span>
          </div>
          <textarea
            id="bio"
            rows="3"
            placeholder="Tell us a little about your work and projects..."
            aria-invalid={errors.bio ? 'true' : 'false'}
            {...register('bio')}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          ></textarea>
          {errors.bio && (
            <p role="alert" className="text-red-500 text-sm mt-1.5 font-medium">
              {errors.bio.message}
            </p>
          )}
        </div>

        {/* Notifications Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register('notifications')}
              className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 dark:bg-slate-800 transition-colors cursor-pointer"
            />
            <div>
              <span className="text-sm font-medium block group-hover:text-blue-500 transition-colors">
                Marketing Communications
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Receive product updates, tips, and feature announcements via email.
              </span>
            </div>
          </label>
        </div>

        {/* Submit Button with Dynamic Guardrails */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-600 text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:shadow transition-all duration-200 disabled:cursor-not-allowed disabled:shadow-none flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving Changes...</span>
              </>
            ) : (
              'Save Settings'
            )}
          </button>
          {!isDirty && (
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-2">
              Make changes above to enable saving.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}