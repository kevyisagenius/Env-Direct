import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const reportSchema = z.object({
  location: z.string().min(5, 'Location description must be at least 5 characters'),
  issueType: z.enum(['air_pollution', 'water_pollution', 'waste_dumping', 'deforestation', 'other'], { 
    errorMap: () => ({ message: 'Please select a valid issue type.' })
  }),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  image: z.any().optional(), // Basic file handling for now
  reportedBy: z.string().min(3, 'Your name must be at least 3 characters').optional().or(z.literal('')),
  contactEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
});

const ReportFormPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      location: '',
      issueType: '',
      description: '',
      reportedBy: '',
      contactEmail: ''
    }
  });

  const imageFile = watch('image');

  const onSubmit = async (data) => {
    console.log('[DEBUG] onSubmit function CALLED. Data:', data);
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage(null);
    console.log('Submitting Report Data:', data);

    const formData = new FormData();

    // Append report data as a JSON string part
    const reportDataForBackend = {
      location: data.location,
      issueType: data.issueType,
      description: data.description,
      reportedBy: data.reportedBy || null,
      contactEmail: data.contactEmail || null,
    };
    formData.append('report', new Blob([JSON.stringify(reportDataForBackend)], { type: 'application/json' }));

    // Append image file if present
    if (data.image && data.image[0]) {
      formData.append('imageFile', data.image[0]);
    }

    try {
      // Axios will automatically set Content-Type to multipart/form-data
      const response = await axios.post(`${API_URL}/api/reports`, formData);
      console.log('API Response:', response.data);
      setSubmitStatus('success');
      setSubmitMessage('Report submitted successfully! Thank you.');
      reset(); // Reset form on success
    } catch (error) {
      console.error('API Submission Error:', error.response ? error.response.data : error.message);
      setSubmitStatus('error');
      setSubmitMessage('Submission failed. Please try again. ' + (error.response?.data?.message || error.message));
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Submit an Environmental Report
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Help us keep our environment clean and safe.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          {submitStatus === 'success' && (
            <div className="mb-4 p-4 rounded-md bg-green-100 text-green-700">
              {submitMessage}
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="mb-4 p-4 rounded-md bg-red-100 text-red-700">
              {submitMessage}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location of Issue</label>
              <input id="location" type="text" {...register('location')} className={`appearance-none block w-full px-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`} />
              {errors.location && <p className="mt-2 text-sm text-red-600">{errors.location.message}</p>}
            </div>

            <div>
              <label htmlFor="issueType" className="block text-sm font-medium text-gray-700">Type of Issue</label>
              <select id="issueType" {...register('issueType')} className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.issueType ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md`}>
                <option value="" disabled>Select an issue type</option>
                <option value="air_pollution">Air Pollution</option>
                <option value="water_pollution">Water Pollution</option>
                <option value="waste_dumping">Illegal Waste Dumping</option>
                <option value="deforestation">Deforestation</option>
                <option value="other">Other</option>
              </select>
              {errors.issueType && <p className="mt-2 text-sm text-red-600">{errors.issueType.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Detailed Description</label>
              <textarea id="description" rows="4" {...register('description')} className={`appearance-none block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}></textarea>
              {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Upload Image (Optional)</label>
              <input id="image" type="file" {...register('image')} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
              {imageFile && imageFile[0] && <p className='text-xs text-gray-500 mt-1'>Selected: {imageFile[0].name}</p>}
            </div>
            
            <hr className="my-6"/>

            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Your Information (Optional)</h3>

            <div>
              <label htmlFor="reportedBy" className="block text-sm font-medium text-gray-700">Your Name</label>
              <input id="reportedBy" type="text" {...register('reportedBy')} className={`appearance-none block w-full px-3 py-2 border ${errors.reportedBy ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`} />
              {errors.reportedBy && <p className="mt-2 text-sm text-red-600">{errors.reportedBy.message}</p>}
            </div>

             <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input id="contactEmail" type="email" {...register('contactEmail')} className={`appearance-none block w-full px-3 py-2 border ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`} />
              {errors.contactEmail && <p className="mt-2 text-sm text-red-600">{errors.contactEmail.message}</p>}
            </div>

            <div>
              <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition duration-150 ease-in-out">
                {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportFormPage; 