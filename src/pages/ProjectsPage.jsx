import React from 'react';

const ProjectsPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4 text-gray-800">Our Flagship Projects</h1>
    <p className="text-gray-600 mb-6">
      Discover some of our impactful environmental projects that have made a difference in communities and ecosystems.
    </p>
    <div className="space-y-8">
      {
        [
          {
            title: 'River Cleanup Initiative - City Central',
            description: 'A multi-year project focusing on removing pollutants and restoring the ecological balance of the City Central River. Involved community volunteers and local government collaboration.',
            imageUrl: 'https://via.placeholder.com/600x400.png?text=River+Cleanup', // Replace with actual image
            tags: ['Water Quality', 'Community', 'Restoration']
          },
          {
            title: 'Urban Reforestation Program',
            description: 'Planting thousands of native trees in urban areas to improve air quality, reduce heat island effect, and enhance biodiversity.',
            imageUrl: 'https://via.placeholder.com/600x400.png?text=Reforestation', // Replace with actual image
            tags: ['Reforestation', 'Air Quality', 'Urban Planning']
          },
          {
            title: 'Industrial Emissions Reduction Study',
            description: 'Worked with major industrial players to identify and implement technologies for significant reduction in harmful emissions.',
            imageUrl: 'https://via.placeholder.com/600x400.png?text=Emissions+Study', // Replace with actual image
            tags: ['Air Pollution', 'Industry', 'Technology']
          }
        ].map((project, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg overflow-hidden md:flex hover:shadow-xl transition-shadow">
            <img src={project.imageUrl} alt={project.title} className="w-full md:w-1/3 h-48 md:h-auto object-cover rounded-md md:rounded-l-lg md:rounded-r-none"/>
            <div className="md:pl-6 pt-4 md:pt-0">
              <h2 className="text-2xl font-semibold text-green-700 mb-2">{project.title}</h2>
              <div className="mb-3">
                {project.tags.map(tag => (
                  <span key={tag} className="inline-block bg-green-100 text-green-700 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <a href="#" className="text-green-600 hover:text-green-800 font-medium">View Project Details &rarr;</a>
            </div>
          </div>
        ))
      }
    </div>
  </div>
);

export default ProjectsPage; 