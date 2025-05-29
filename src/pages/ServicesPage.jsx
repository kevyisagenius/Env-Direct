import React from 'react';

const ServicesPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4 text-gray-800">Our Environmental Services</h1>
    <p className="text-gray-600 mb-6">
      We provide a wide range of environmental consulting and field services to help businesses and communities achieve their sustainability goals.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {
        [
          { title: 'Environmental Impact Assessments (EIA)', description: 'Comprehensive EIAs for new projects and developments.' },
          { title: 'Air Quality Monitoring & Management', description: 'Real-time air quality testing, analysis, and mitigation strategies.' },
          { title: 'Water Quality Testing & Remediation', description: 'Solutions for contaminated water bodies and drinking water safety.' },
          { title: 'Soil Contamination Assessment', description: 'Identifying and managing soil pollutants for land redevelopment.' },
          { title: 'Ecological Surveys & Biodiversity Plans', description: 'Protecting and enhancing natural habitats and wildlife.' },
          { title: 'Sustainability & ESG Consulting', description: 'Helping organizations integrate ESG principles into their operations.' }
        ].map((service, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-green-700 mb-2">{service.title}</h2>
            <p className="text-sm text-gray-500 mb-3">{service.description}</p>
            <a href="#" className="text-green-600 hover:text-green-800 font-medium">Request Service &rarr;</a>
          </div>
        ))
      }
    </div>
  </div>
);

export default ServicesPage; 