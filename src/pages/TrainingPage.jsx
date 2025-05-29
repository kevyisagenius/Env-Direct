import React from 'react';

const TrainingPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4 text-gray-800">Environmental Training Programs</h1>
    <p className="text-gray-600 mb-6">
      Empower yourself and your organization with our specialized environmental training courses. 
      From regulatory compliance to sustainable practices, we offer comprehensive programs tailored to your needs.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {
        [
          { title: 'Waste Management & Recycling', description: 'Learn best practices for waste reduction, segregation, and recycling to minimize environmental impact.' },
          { title: 'Environmental Compliance & Auditing', description: 'Understand key environmental regulations and how to conduct effective compliance audits.' },
          { title: 'Sustainable Resource Management', description: 'Strategies for efficient use of natural resources, including water and energy conservation.' },
          { title: 'Climate Action & Carbon Footprint Reduction', description: 'Practical steps for businesses and individuals to reduce their carbon footprint.' }
        ].map((course, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-green-700 mb-2">{course.title}</h2>
            <p className="text-sm text-gray-500 mb-3">{course.description}</p>
            <a href="#" className="text-green-600 hover:text-green-800 font-medium">Learn More &rarr;</a>
          </div>
        ))
      }
    </div>
  </div>
);

export default TrainingPage; 